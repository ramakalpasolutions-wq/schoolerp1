// src/app/api/students/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest, ROLES, hashPassword } from "@/lib/auth";
import { hashPassword } from "../../../../lib/auth";

const ok = (data, message = "Success", status = 200) =>
  NextResponse.json({ success: true, message, data }, { status });
const err = (message = "Error", status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

// ── GET — List students ───────────────────────────────────────────
export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const ALLOWED = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER];
    if (!ALLOWED.includes(user.role)) return err("Access denied.", 403);

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search") || "";
    const classId = searchParams.get("classId");
    const status = searchParams.get("status");
    const academicYearId = searchParams.get("academicYearId");
    const feeStatus = searchParams.get("feeStatus");
    const sortBy = searchParams.get("sortBy") || "name";
    const sortDir = searchParams.get("sortDir") === "desc" ? "desc" : "asc";

    const schoolId = user.role === ROLES.SUPER_ADMIN
      ? (searchParams.get("schoolId") || undefined)
      : user.schoolId;

    if (!schoolId) return err("School context required.", 400);

    // Build where clause
    const where = {
      schoolId,
      ...(classId && { classId }),
      ...(academicYearId && { academicYearId }),
      ...(status && { status }),
      ...(search.trim() && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { admissionNo: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          class: { select: { name: true, section: true } },
          parent: {
            select: {
              fatherName: true,
              fatherPhone: true,
              motherPhone: true,
            },
          },
          ...(feeStatus && {
            fees: {
              where: { status: feeStatus },
              select: { id: true, amount: true, status: true },
            },
          }),
        },
        orderBy: { [sortBy]: sortDir },
        skip,
        take: limit,
      }),
      prisma.student.count({ where }),
    ]);

    return ok({
      students,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("[GET /api/students]:", error);
    return err("Failed to fetch students.", 500);
  }
}

// ── POST — Create student ─────────────────────────────────────────
export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    if (![ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN].includes(user.role)) {
      return err("Only School Admins can add students.", 403);
    }

    const body = await request.json().catch(() => null);
    if (!body) return err("Invalid request body.", 400);

    const {
      admissionNo,
      name,
      dob,
      gender,
      bloodGroup,
      photo,
      classId,
      academicYearId,
      parentId,
      documents,
      address,
      city,
      state,
      pincode,
      religion,
      category,
      fatherName,
      fatherPhone,
      fatherEmail,
      fatherOccupation,
      motherName,
      motherPhone,
      motherEmail,
      motherOccupation,
      emergencyContactName,
      emergencyContactPhone,
      emergencyRelationship,
      previousSchool,
      rollNo,
      createParent,
    } = body;

    // ── Required field validation ─────────────────────────────
    const required = { name, dob, gender, classId, academicYearId };
    const missing = Object.entries(required)
      .filter(([, v]) => !v)
      .map(([k]) => k);

    if (missing.length > 0) {
      return err(`Missing required fields: ${missing.join(", ")}`, 400);
    }

    const schoolId = user.role === ROLES.SUPER_ADMIN
      ? (body.schoolId || user.schoolId)
      : user.schoolId;

    // ── Check admission number uniqueness ─────────────────────
    if (admissionNo) {
      const existing = await prisma.student.findUnique({ where: { admissionNo } });
      if (existing) return err(`Admission number "${admissionNo}" already exists.`, 409);
    }

    // ── Generate admission number if not provided ─────────────
    const finalAdmissionNo = admissionNo || await generateUniqueAdmissionNo(schoolId);

    // ── Create parent if needed ───────────────────────────────
    let resolvedParentId = parentId;

    if (createParent && fatherPhone && !parentId) {
      const existingParent = await prisma.parent.findFirst({
        where: {
          OR: [
            { fatherPhone: fatherPhone || undefined },
            { motherPhone: motherPhone || undefined },
          ],
          schoolId,
        },
      });

      if (existingParent) {
        resolvedParentId = existingParent.id;
      } else {
        const newParent = await prisma.parent.create({
          data: {
            fatherName: fatherName || null,
            fatherPhone: fatherPhone || null,
            fatherEmail: fatherEmail || null,
            fatherOccupation: fatherOccupation || null,
            motherName: motherName || null,
            motherPhone: motherPhone || null,
            motherEmail: motherEmail || null,
            motherOccupation: motherOccupation || null,
            emergencyContactName: emergencyContactName || null,
            emergencyContactPhone: emergencyContactPhone || null,
            emergencyRelationship: emergencyRelationship || null,
            address: address || null,
            city: city || null,
            state: state || null,
            pincode: pincode || null,
            studentIds: [],
            schoolId,
          },
        });
        resolvedParentId = newParent.id;
      }
    }

    // ── Create student record ─────────────────────────────────
    const student = await prisma.student.create({
      data: {
        admissionNo: finalAdmissionNo,
        name: name.trim(),
        dob: new Date(dob),
        gender,
        bloodGroup: bloodGroup || null,
        photo: photo || null,
        classId,
        schoolId,
        academicYearId,
        parentId: resolvedParentId || null,
        documents: documents || [],
        address: address || null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
        isActive: true,
        status: "ACTIVE",
      },
      include: {
        class: { select: { name: true, section: true } },
        parent: { select: { fatherName: true, fatherPhone: true } },
      },
    });

    // ── Update parent's studentIds array ──────────────────────
    if (resolvedParentId) {
      await prisma.parent.update({
        where: { id: resolvedParentId },
        data: {
          studentIds: { push: student.id },
        },
      });
    }

    // ── Create user account for student (optional) ────────────
    if (body.createAccount && body.email) {
      const hashedPass = await hashPassword(body.password || "student123");
      await prisma.user.upsert({
        where: { email: body.email.toLowerCase() },
        update: {},
        create: {
          name: student.name,
          email: body.email.toLowerCase(),
          password: hashedPass,
          role: "STUDENT",
          schoolId,
          isActive: true,
        },
      });
    }

    return ok({ student }, "Student enrolled successfully.", 201);
  } catch (error) {
    console.error("[POST /api/students]:", error);
    if (error.code === "P2002") {
      return err("A student with this admission number already exists.", 409);
    }
    return err("Failed to create student.", 500);
  }
}

async function generateUniqueAdmissionNo(schoolId) {
  const year = new Date().getFullYear();
  const count = await prisma.student.count({ where: { schoolId } });
  return `ADM/${year}/${String(count + 1).padStart(4, "0")}`;
}