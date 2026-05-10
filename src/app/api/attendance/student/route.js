// src/app/api/attendance/student/route.js

import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { getUserFromRequest, ROLES } from "../../../../../lib/auth";
import { sendAttendanceSMS } from "../../../../../lib/sms";

const ok = (data, message = "Success", status = 200) =>
  NextResponse.json({ success: true, message, data }, { status });
const err = (message = "Error", status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

const VALID_STATUSES = ["PRESENT", "ABSENT", "LATE", "HALFDAY"];

// ── POST — Submit attendance batch ────────────────────────────────
export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const allowed = [ROLES.TEACHER, ROLES.SCHOOL_ADMIN, ROLES.SUPER_ADMIN];
    if (!allowed.includes(user.role)) return err("Access denied.", 403);

    const body = await request.json().catch(() => null);
    if (!body) return err("Invalid request body.", 400);

    const { attendanceData = [], classId, date, academicYearId, sendSMS: shouldSendSMS = true } = body;

    if (!attendanceData.length) return err("Attendance data is required.", 400);
    if (!classId) return err("classId is required.", 400);

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);
    const schoolId = user.schoolId;

    // Validate statuses
    const invalidStatuses = attendanceData
      .filter((r) => !VALID_STATUSES.includes(r.status))
      .map((r) => r.status);

    if (invalidStatuses.length > 0) {
      return err(`Invalid statuses: ${invalidStatuses.join(", ")}. Must be one of: ${VALID_STATUSES.join(", ")}`, 400);
    }

    // ── Upsert attendance records ─────────────────────────────
    const savedRecords = [];
    const errors = [];

    for (const record of attendanceData) {
      try {
        // Check for existing record
        const existing = await prisma.attendance.findFirst({
          where: {
            studentId: record.studentId,
            classId,
            schoolId,
            date: { gte: attendanceDate, lt: new Date(attendanceDate.getTime() + 86400000) },
          },
        });

        let saved;
        if (existing) {
          saved = await prisma.attendance.update({
            where: { id: existing.id },
            data: {
              status: record.status,
              markedBy: user.id,
              markedAt: new Date(),
              remarks: record.remarks || null,
            },
          });
        } else {
          saved = await prisma.attendance.create({
            data: {
              studentId: record.studentId,
              classId,
              date: attendanceDate,
              status: record.status,
              markedBy: user.id,
              markedAt: new Date(),
              smsSent: false,
              remarks: record.remarks || null,
              schoolId,
              academicYearId: academicYearId || "",
            },
          });
        }
        savedRecords.push(saved);
      } catch (recErr) {
        errors.push({ studentId: record.studentId, error: recErr.message });
      }
    }

    // ── Send SMS for absent/late ──────────────────────────────
    let smsSent = 0;
    let smsFailed = 0;

    if (shouldSendSMS) {
      const school = await prisma.school.findUnique({
        where: { id: schoolId },
        select: { name: true },
      });

      const notifyStatuses = ["ABSENT", "LATE"];
      const studentsToNotify = attendanceData.filter((r) =>
        notifyStatuses.includes(r.status)
      );

      for (const record of studentsToNotify) {
        try {
          const student = await prisma.student.findUnique({
            where: { id: record.studentId },
            include: {
              parent: {
                select: { fatherPhone: true, motherPhone: true },
              },
            },
          });

          if (!student?.parent) continue;

          const phones = [
            student.parent.fatherPhone,
            student.parent.motherPhone,
          ].filter(Boolean);

          const timeStr = new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          });

          for (const phone of phones) {
            const result = await sendAttendanceSMS(
              student.name,
              record.status,
              timeStr,
              phone,
              school?.name
            );
            if (result.success) smsSent++;
            else smsFailed++;
          }

          // Update smsSent flag
          await prisma.attendance.updateMany({
            where: {
              studentId: record.studentId,
              date: { gte: attendanceDate, lt: new Date(attendanceDate.getTime() + 86400000) },
              schoolId,
            },
            data: { smsSent: smsSent > 0, smsSentAt: new Date() },
          });
        } catch (smsErr) {
          smsFailed++;
          console.error("[SMS Error]:", smsErr.message);
        }
      }
    }

    const summary = attendanceData.reduce(
      (acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; },
      {}
    );

    return ok(
      {
        saved: savedRecords.length,
        errors,
        summary,
        sms: { sent: smsSent, failed: smsFailed },
      },
      `Attendance saved for ${savedRecords.length} students. SMS sent to ${smsSent} parents.`
    );
  } catch (error) {
    console.error("[POST /api/attendance/student]:", error);
    return err("Failed to save attendance.", 500);
  }
}

// ── GET — Fetch attendance records ────────────────────────────────
export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const studentId = searchParams.get("studentId");
    const date = searchParams.get("date");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const where = { schoolId: user.schoolId };

    if (classId) where.classId = classId;
    if (studentId) where.studentId = studentId;

    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      where.date = { gte: d, lt: new Date(d.getTime() + 86400000) };
    } else if (startDate && endDate) {
      where.date = { gte: new Date(startDate), lte: new Date(endDate) };
    } else if (month && year) {
      where.date = {
        gte: new Date(parseInt(year), parseInt(month) - 1, 1),
        lt: new Date(parseInt(year), parseInt(month), 1),
      };
    }

    const records = await prisma.attendance.findMany({
      where,
      include: {
        student: { select: { name: true, admissionNo: true } },
        markedByUser: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    });

    return ok({ records, count: records.length });
  } catch (error) {
    console.error("[GET /api/attendance/student]:", error);
    return err("Failed to fetch attendance.", 500);
  }
}