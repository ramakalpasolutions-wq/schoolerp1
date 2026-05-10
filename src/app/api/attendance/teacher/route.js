// src/app/api/attendance/teacher/route.js

import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { getUserFromRequest, ROLES } from "../../../../../lib/auth";
import { calculateDistance } from "../../../../../lib/haversine";

const ok = (data, message = "Success", status = 200) =>
  NextResponse.json({ success: true, message, data }, { status });
const err = (message = "Error", status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

// ── POST — Teacher check-in ───────────────────────────────────────
export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const allowed = [ROLES.TEACHER, ROLES.SCHOOL_ADMIN, ROLES.SUPER_ADMIN];
    if (!allowed.includes(user.role)) return err("Access denied.", 403);

    const body = await request.json().catch(() => null);
    if (!body) return err("Invalid request body.", 400);

    const { checkInLat, checkInLong, isFakeGps = false, accuracy, action } = body;

    if (!checkInLat || !checkInLong) {
      return err("GPS coordinates (checkInLat, checkInLong) are required.", 400);
    }

    const lat = parseFloat(checkInLat);
    const lon = parseFloat(checkInLong);

    if (isNaN(lat) || isNaN(lon)) {
      return err("Invalid coordinates. Must be valid numbers.", 400);
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return err("Coordinates out of valid range.", 400);
    }

    // ── Block fake GPS ────────────────────────────────────────
    if (isFakeGps) {
      return NextResponse.json(
        {
          success: false,
          error: "Fake GPS detected. Cannot mark attendance with mock location.",
          code: "FAKE_GPS_DETECTED",
        },
        { status: 403 }
      );
    }

    // ── Fetch school geo location ─────────────────────────────
    const school = await prisma.school.findUnique({
      where: { id: user.schoolId },
      select: { geoLatitude: true, geoLongitude: true, geoRadius: true, name: true },
    });

    if (!school?.geoLatitude || !school?.geoLongitude) {
      return err("School geo-location not configured. Contact administrator.", 400);
    }

    const distance = Math.round(
      calculateDistance(lat, lon, school.geoLatitude, school.geoLongitude)
    );
    const radius = school.geoRadius || 200;

    if (distance > radius) {
      return NextResponse.json(
        {
          success: false,
          error: `You are ${distance}m from school. Must be within ${radius}m radius.`,
          code: "OUT_OF_RANGE",
          data: { distance, radius, allowed: radius },
        },
        { status: 403 }
      );
    }

    // ── Check already checked in today ────────────────────────
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86400000);

    const existingRecord = await prisma.teacherAttendance.findFirst({
      where: {
        teacherId: user.id,
        date: { gte: today, lt: tomorrow },
        schoolId: user.schoolId,
      },
    });

    if (existingRecord?.checkIn) {
      return NextResponse.json(
        {
          success: false,
          error: "Already checked in today.",
          code: "ALREADY_CHECKED_IN",
          data: { checkIn: existingRecord.checkIn },
        },
        { status: 409 }
      );
    }

    // ── Determine status (LATE if after 9:15 AM) ──────────────
    const now = new Date();
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);
    const attendanceStatus = isLate ? "LATE" : "PRESENT";

    // ── Save check-in ─────────────────────────────────────────
    const record = await prisma.teacherAttendance.create({
      data: {
        teacherId: user.id,
        date: today,
        checkIn: now,
        checkInLat: lat,
        checkInLong: lon,
        status: attendanceStatus,
        isFakeGps: false,
        schoolId: user.schoolId,
      },
    });

    return ok(
      {
        id: record.id,
        checkIn: record.checkIn,
        status: record.status,
        distance,
        radius,
      },
      `Check-in successful! ${isLate ? "Marked as LATE." : "On time. Status: PRESENT."}`
    );
  } catch (error) {
    console.error("[POST /api/attendance/teacher]:", error);
    return err("Failed to record check-in.", 500);
  }
}

// ── PUT — Teacher check-out ───────────────────────────────────────
export async function PUT(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const body = await request.json().catch(() => null);
    const { checkOutLat, checkOutLong } = body || {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86400000);

    const todayRecord = await prisma.teacherAttendance.findFirst({
      where: {
        teacherId: user.id,
        date: { gte: today, lt: tomorrow },
        schoolId: user.schoolId,
      },
    });

    if (!todayRecord) {
      return err("No check-in record found for today.", 404);
    }

    if (todayRecord.checkOut) {
      return NextResponse.json(
        { success: false, error: "Already checked out.", code: "ALREADY_CHECKED_OUT" },
        { status: 409 }
      );
    }

    const now = new Date();
    const diffMs = now - new Date(todayRecord.checkIn);
    const diffHours = diffMs / 3600000;

    const updated = await prisma.teacherAttendance.update({
      where: { id: todayRecord.id },
      data: {
        checkOut: now,
        checkOutLat: checkOutLat ? parseFloat(checkOutLat) : null,
        checkOutLong: checkOutLong ? parseFloat(checkOutLong) : null,
        workingHours: parseFloat(diffHours.toFixed(2)),
      },
    });

    const hours = Math.floor(diffHours);
    const minutes = Math.floor((diffHours - hours) * 60);

    return ok(
      {
        checkOut: updated.checkOut,
        workingHours: `${hours}h ${minutes}m`,
        workingHoursDecimal: updated.workingHours,
        status: updated.status,
      },
      `Check-out successful! Total: ${hours}h ${minutes}m`
    );
  } catch (error) {
    console.error("[PUT /api/attendance/teacher]:", error);
    return err("Failed to record check-out.", 500);
  }
}

// ── GET — Teacher attendance history ─────────────────────────────
export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId") || user.id;
    const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

    // Admin can see any teacher; teachers see only their own
    if (teacherId !== user.id && user.role === ROLES.TEACHER) {
      return err("Access denied.", 403);
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const records = await prisma.teacherAttendance.findMany({
      where: {
        teacherId,
        schoolId: user.schoolId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: "desc" },
    });

    const stats = {
      totalDays: records.length,
      present: records.filter((r) => r.status === "PRESENT").length,
      late: records.filter((r) => r.status === "LATE").length,
      absent: records.filter((r) => r.status === "ABSENT").length,
      avgHours:
        records.filter((r) => r.workingHours).length > 0
          ? parseFloat(
              (
                records
                  .filter((r) => r.workingHours)
                  .reduce((s, r) => s + r.workingHours, 0) /
                records.filter((r) => r.workingHours).length
              ).toFixed(2)
            )
          : 0,
    };

    return ok({ records, stats, month, year });
  } catch (error) {
    console.error("[GET /api/attendance/teacher]:", error);
    return err("Failed to fetch teacher attendance.", 500);
  }
}