// src/app/api/promotions/route.js

import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getUserFromRequest, ROLES } from "../../../../lib/auth";

const ok = (data, message = "Success", status = 200) =>
  NextResponse.json({ success: true, message, data }, { status });
const err = (message = "Error", status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

// ── POST — Process promotions ─────────────────────────────────────
export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    if (user.role !== ROLES.SCHOOL_ADMIN && user.role !== ROLES.SUPER_ADMIN) {
      return err("Only School Admins can process promotions.", 403);
    }

    const body = await request.json().catch(() => null);
    if (!body) return err("Invalid request body.", 400);

    const { classId, fromAcademicYearId, toAcademicYearId, students = [] } = body;

    if (!classId) return err("classId is required.", 400);
    if (!fromAcademicYearId) return err("fromAcademicYearId is required.", 400);
    if (!toAcademicYearId) return err("toAcademicYearId is required.", 400);
    if (!students.length) return err("At least one student required.", 400);

    const [fromYear, toYear, fromClass] = await Promise.all([
      prisma.academicYear.findUnique({ where: { id: fromAcademicYearId } }),
      prisma.academicYear.findUnique({ where: { id: toAcademicYearId } }),
      prisma.class.findUnique({ where: { id: classId } }),
    ]);

    if (!fromYear) return err("Source academic year not found.", 404);
    if (!toYear) return err("Target academic year not found.", 404);
    if (!fromClass) return err("Source class not found.", 404);

    const results = {
      promoted: 0,
      held: 0,
      transferred: 0,
      failed: 0,
      promotedStudents: [],
      heldStudents: [],
      errors: [],
    };

    for (const studentData of students) {
      const { studentId, toClassId, toSection, status, reason, notes } = studentData;

      try {
        const student = await prisma.student.findUnique({
          where: { id: studentId },
          select: { id: true, name: true, classId: true, schoolId: true },
        });

        if (!student) {
          results.failed++;
          results.errors.push({ studentId, error: "Student not found" });
          continue;
        }

        if (student.schoolId !== user.schoolId && user.role !== ROLES.SUPER_ADMIN) {
          results.failed++;
          results.errors.push({ studentId, error: "Access denied for this student" });
          continue;
        }

        if (status === "PROMOTED") {
          let targetClassId = toClassId;

          // Find or create target class
          if (!targetClassId) {
            const nextClassName = String(parseInt(fromClass.name) + 1);
            let targetClass = await prisma.class.findFirst({
              where: {
                name: nextClassName,
                section: toSection || fromClass.section,
                schoolId: student.schoolId,
                academicYearId: toAcademicYearId,
              },
            });

            if (!targetClass) {
              targetClass = await prisma.class.create({
                data: {
                  name: nextClassName,
                  section: toSection || fromClass.section,
                  schoolId: student.schoolId,
                  academicYearId: toAcademicYearId,
                },
              });
            }
            targetClassId = targetClass.id;
          }

          // Update student
          await prisma.student.update({
            where: { id: studentId },
            data: {
              classId: targetClassId,
              academicYearId: toAcademicYearId,
            },
          });

          // Create promotion record
          await prisma.promotion.create({
            data: {
              studentId,
              fromClass: fromClass.name,
              fromSection: fromClass.section,
              toClass: String(parseInt(fromClass.name) + 1),
              toSection: toSection || fromClass.section,
              fromAcademicYear: fromAcademicYearId,
              toAcademicYear: toAcademicYearId,
              status: "PROMOTED",
              reason: notes || null,
              promotedBy: user.id,
              schoolId: student.schoolId,
            },
          });

          results.promoted++;
          results.promotedStudents.push({ id: studentId, name: student.name });

        } else if (status === "HELD") {
          // Stay in same class — create hold record
          await prisma.promotion.create({
            data: {
              studentId,
              fromClass: fromClass.name,
              fromSection: fromClass.section,
              toClass: null,
              toSection: null,
              fromAcademicYear: fromAcademicYearId,
              toAcademicYear: null,
              status: "HELD",
              reason: reason || notes || "Held back",
              promotedBy: user.id,
              schoolId: student.schoolId,
            },
          });

          results.held++;
          results.heldStudents.push({
            id: studentId,
            name: student.name,
            reason: reason || "Not specified",
          });

        } else if (status === "TRANSFERRED") {
          await prisma.student.update({
            where: { id: studentId },
            data: { status: "TRANSFERRED", isActive: false },
          });

          await prisma.promotion.create({
            data: {
              studentId,
              fromClass: fromClass.name,
              fromSection: fromClass.section,
              toClass: null,
              toSection: null,
              fromAcademicYear: fromAcademicYearId,
              toAcademicYear: null,
              status: "TRANSFERRED",
              reason: reason || notes || null,
              promotedBy: user.id,
              schoolId: student.schoolId,
            },
          });

          results.transferred++;
        }
      } catch (studentError) {
        console.error(`[Promotion] Error for student ${studentId}:`, studentError);
        results.failed++;
        results.errors.push({ studentId, error: studentError.message });
      }
    }

    return ok(
      {
        fromYear: fromYear.name,
        toYear: toYear.name,
        fromClass: `${fromClass.name}-${fromClass.section}`,
        results,
      },
      `Promotion complete: ${results.promoted} promoted, ${results.held} held, ${results.failed} failed.`
    );
  } catch (error) {
    console.error("[POST /api/promotions]:", error);
    return err("Failed to process promotions.", 500);
  }
}

// ── GET — Promotion history ───────────────────────────────────────
export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const status = searchParams.get("status");
    const academicYear = searchParams.get("academicYear");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const where = {
      schoolId: user.schoolId,
      ...(studentId && { studentId }),
      ...(status && { status }),
      ...(academicYear && { fromAcademicYear: academicYear }),
    };

    const [promotions, total, stats] = await Promise.all([
      prisma.promotion.findMany({
        where,
        include: {
          student: { select: { name: true, admissionNo: true, photo: true } },
        },
        orderBy: { promotedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.promotion.count({ where }),
      prisma.promotion.groupBy({
        by: ["status"],
        where: { schoolId: user.schoolId },
        _count: { status: true },
      }),
    ]);

    return ok({
      promotions,
      stats: stats.reduce((acc, s) => { acc[s.status] = s._count.status; return acc; }, {}),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/promotions]:", error);
    return err("Failed to fetch promotion history.", 500);
  }
}