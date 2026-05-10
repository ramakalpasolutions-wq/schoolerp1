// src/app/api/students/[id]/route.js

import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { getUserFromRequest, ROLES } from "../../../../../lib/auth";

const ok = (data, message = "Success", status = 200) =>
  NextResponse.json({ success: true, message, data }, { status });
const err = (message = "Error", status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

// ── GET — Student details ─────────────────────────────────────────
export async function GET(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const { id } = params;
    if (!id) return err("Student ID is required.", 400);

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        class: true,
        academicYear: { select: { name: true, isActive: true } },
        parent: true,
        school: { select: { name: true, logo: true } },
        fees: {
          orderBy: { dueDate: "desc" },
          take: 10,
        },
        attendances: {
          orderBy: { date: "desc" },
          take: 30,
        },
        examResults: {
          include: {
            exam: { select: { name: true, type: true } },
            subject: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        homeworkSubmissions: {
          include: {
            homework: { select: { title: true, dueDate: true, subject: { select: { name: true } } } },
          },
          orderBy: { submittedAt: "desc" },
          take: 10,
        },
        promotions: {
          orderBy: { promotedAt: "desc" },
        },
      },
    });

    if (!student) return err("Student not found.", 404);

    // ── Access control ────────────────────────────────────────
    if (user.role === ROLES.STUDENT) {
      // Students can only view their own profile
      const studentUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (student.admissionNo !== studentUser?.name) {
        return err("Access denied.", 403);
      }
    }

    if (user.role !== ROLES.SUPER_ADMIN && student.schoolId !== user.schoolId) {
      return err("Access denied.", 403);
    }

    // ── Compute attendance % ──────────────────────────────────
    const totalDays = student.attendances.length;
    const presentDays = student.attendances.filter(
      (a) => a.status === "PRESENT" || a.status === "LATE"
    ).length;
    const attendancePct = totalDays > 0
      ? Math.round((presentDays / totalDays) * 100)
      : 0;

    return ok({
      student,
      stats: {
        attendancePct,
        totalDays,
        presentDays,
        absentDays: totalDays - presentDays,
        totalFees: student.fees.reduce((s, f) => s + f.amount, 0),
        paidFees: student.fees.reduce((s, f) => s + (f.paidAmount || 0), 0),
      },
    });
  } catch (error) {
    console.error("[GET /api/students/[id]]:", error);
    return err("Failed to fetch student.", 500);
  }
}

// ── PUT — Update student ──────────────────────────────────────────
export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    if (![ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN].includes(user.role)) {
      return err("Access denied.", 403);
    }

    const { id } = params;
    const body = await request.json().catch(() => null);
    if (!body) return err("Invalid request body.", 400);

    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) return err("Student not found.", 404);

    if (user.role !== ROLES.SUPER_ADMIN && existing.schoolId !== user.schoolId) {
      return err("Access denied.", 403);
    }

    const {
      name, dob, gender, bloodGroup, photo, classId,
      academicYearId, parentId, documents, address, city,
      state, pincode, status, isActive,
    } = body;

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(dob && { dob: new Date(dob) }),
        ...(gender && { gender }),
        ...(bloodGroup !== undefined && { bloodGroup }),
        ...(photo !== undefined && { photo }),
        ...(classId && { classId }),
        ...(academicYearId && { academicYearId }),
        ...(parentId !== undefined && { parentId }),
        ...(documents && { documents }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(pincode !== undefined && { pincode }),
        ...(status && { status }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      },
      include: {
        class: { select: { name: true, section: true } },
        parent: { select: { fatherName: true, fatherPhone: true } },
      },
    });

    return ok({ student: updatedStudent }, "Student updated successfully.");
  } catch (error) {
    console.error("[PUT /api/students/[id]]:", error);
    return err("Failed to update student.", 500);
  }
}

// ── DELETE — Soft delete student ──────────────────────────────────
export async function DELETE(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    if (![ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN].includes(user.role)) {
      return err("Access denied.", 403);
    }

    const { id } = params;

    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) return err("Student not found.", 404);

    if (user.role !== ROLES.SUPER_ADMIN && existing.schoolId !== user.schoolId) {
      return err("Access denied.", 403);
    }

    // Soft delete — mark inactive
    await prisma.student.update({
      where: { id },
      data: { isActive: false, status: "INACTIVE" },
    });

    return ok({ id }, "Student deactivated successfully.");
  } catch (error) {
    console.error("[DELETE /api/students/[id]]:", error);
    return err("Failed to delete student.", 500);
  }
}