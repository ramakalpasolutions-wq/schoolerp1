// src/app/api/fees/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest, ROLES } from "@/lib/auth";

const ok = (data, message = "Success", status = 200) =>
  NextResponse.json({ success: true, message, data }, { status });
const err = (message = "Error", status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

// ── GET — List fees ───────────────────────────────────────────────
export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const allowed = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.ACCOUNTANT];
    if (!allowed.includes(user.role)) return err("Access denied.", 403);

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const studentId = searchParams.get("studentId");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const academicYearId = searchParams.get("academicYearId");
    const overdueOnly = searchParams.get("overdueOnly") === "true";
    const search = searchParams.get("search") || "";

    const schoolId = user.role === ROLES.SUPER_ADMIN
      ? (searchParams.get("schoolId") || user.schoolId)
      : user.schoolId;

    const where = {
      schoolId,
      ...(studentId && { studentId }),
      ...(status && { status }),
      ...(category && { category }),
      ...(academicYearId && { academicYearId }),
      ...(overdueOnly && {
        status: "OVERDUE",
        dueDate: { lt: new Date() },
      }),
      ...(search && {
        student: {
          name: { contains: search, mode: "insensitive" },
        },
      }),
    };

    const [fees, total, summary] = await Promise.all([
      prisma.fee.findMany({
        where,
        include: {
          student: {
            select: {
              name: true,
              admissionNo: true,
              photo: true,
              class: { select: { name: true, section: true } },
              parent: { select: { fatherPhone: true, motherPhone: true } },
            },
          },
        },
        orderBy: [{ status: "asc" }, { dueDate: "asc" }],
        skip,
        take: limit,
      }),
      prisma.fee.count({ where }),
      prisma.fee.groupBy({
        by: ["status"],
        where: { schoolId },
        _sum: { amount: true, paidAmount: true },
        _count: { status: true },
      }),
    ]);

    const summaryMap = summary.reduce(
      (acc, s) => {
        acc[s.status] = {
          count: s._count.status,
          totalAmount: s._sum.amount || 0,
          paidAmount: s._sum.paidAmount || 0,
        };
        return acc;
      },
      {}
    );

    return ok({
      fees,
      summary: summaryMap,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/fees]:", error);
    return err("Failed to fetch fees.", 500);
  }
}

// ── POST — Record fee payment ─────────────────────────────────────
export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const allowed = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.ACCOUNTANT];
    if (!allowed.includes(user.role)) return err("Access denied.", 403);

    const body = await request.json().catch(() => null);
    if (!body) return err("Invalid request body.", 400);

    const {
      studentId,
      category,
      amount,
      dueDate,
      paidAmount,
      paidDate,
      paymentMethod,
      transactionId,
      remarks,
      discount,
      fine,
      academicYearId,
    } = body;

    if (!studentId || !category || !amount || !dueDate) {
      return err("studentId, category, amount, and dueDate are required.", 400);
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return err("Amount must be a positive number.", 400);
    }

    const schoolId = user.schoolId;

    const student = await prisma.student.findFirst({
      where: { id: studentId, schoolId },
    });
    if (!student) return err("Student not found in your school.", 404);

    const paid = parseFloat(paidAmount || 0);
    const total = parseFloat(amount);
    const disc = parseFloat(discount || 0);
    const fineAmt = parseFloat(fine || 0);

    const status = paid >= total ? "PAID" : paid > 0 ? "PARTIAL" : "PENDING";

    // Generate receipt number for paid fees
    let receiptNo = null;
    if (status === "PAID" || paid > 0) {
      const count = await prisma.fee.count({ where: { schoolId } });
      receiptNo = `RCP/${new Date().getFullYear()}/${String(count + 1).padStart(5, "0")}`;
    }

    const fee = await prisma.fee.create({
      data: {
        studentId,
        schoolId,
        category,
        amount: total,
        dueDate: new Date(dueDate),
        paidDate: paidDate ? new Date(paidDate) : paid > 0 ? new Date() : null,
        paidAmount: paid,
        discount: disc,
        fine: fineAmt,
        status,
        receiptNo,
        paymentMethod: paymentMethod || null,
        transactionId: transactionId || null,
        remarks: remarks || null,
        academicYearId: academicYearId || null,
      },
      include: {
        student: { select: { name: true, admissionNo: true } },
      },
    });

    return ok({ fee, receiptNo }, "Fee recorded successfully.", 201);
  } catch (error) {
    console.error("[POST /api/fees]:", error);
    return err("Failed to record fee.", 500);
  }
}

// ── PUT — Update fee / collect payment ────────────────────────────
export async function PUT(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const allowed = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.ACCOUNTANT];
    if (!allowed.includes(user.role)) return err("Access denied.", 403);

    const body = await request.json().catch(() => null);
    if (!body?.feeId) return err("feeId is required.", 400);

    const existing = await prisma.fee.findFirst({
      where: { id: body.feeId, schoolId: user.schoolId },
    });
    if (!existing) return err("Fee record not found.", 404);

    const paid = parseFloat(body.paidAmount ?? existing.paidAmount);
    const status =
      paid >= existing.amount ? "PAID"
      : paid > 0 ? "PARTIAL"
      : existing.status;

    let receiptNo = existing.receiptNo;
    if (status === "PAID" && !receiptNo) {
      const count = await prisma.fee.count({ where: { schoolId: user.schoolId } });
      receiptNo = `RCP/${new Date().getFullYear()}/${String(count + 1).padStart(5, "0")}`;
    }

    const updated = await prisma.fee.update({
      where: { id: body.feeId },
      data: {
        paidAmount: paid,
        paidDate: body.paidDate ? new Date(body.paidDate) : new Date(),
        status,
        paymentMethod: body.paymentMethod ?? existing.paymentMethod,
        transactionId: body.transactionId ?? existing.transactionId,
        remarks: body.remarks ?? existing.remarks,
        receiptNo,
      },
    });

    return ok({ fee: updated, receiptNo }, "Payment recorded successfully.");
  } catch (error) {
    console.error("[PUT /api/fees]:", error);
    return err("Failed to update fee.", 500);
  }
}