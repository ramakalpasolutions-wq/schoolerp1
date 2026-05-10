// src/app/api/crm/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest, ROLES } from "@/lib/auth";

const ok = (data, message = "Success", status = 200) =>
  NextResponse.json({ success: true, message, data }, { status });
const err = (message = "Error", status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

const VALID_STAGES = [
  "NEW_LEAD", "INTERESTED", "COUNSELING",
  "VISIT_SCHEDULED", "CONFIRMED", "REJECTED", "DROPPED",
];

const VALID_SOURCES = [
  "GOOGLE", "FACEBOOK", "WALKIN", "REFERENCE",
  "INSTAGRAM", "NEWSPAPER", "OTHER",
];

// ── GET — List leads ──────────────────────────────────────────────
export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const allowed = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN];
    if (!allowed.includes(user.role)) return err("Access denied.", 403);

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;
    const stage = searchParams.get("stage");
    const source = searchParams.get("source");
    const search = searchParams.get("search") || "";
    const assignedTo = searchParams.get("assignedTo");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDir = searchParams.get("sortDir") === "asc" ? "asc" : "desc";

    const schoolId = user.role === ROLES.SUPER_ADMIN
      ? (searchParams.get("schoolId") || user.schoolId)
      : user.schoolId;

    const where = {
      schoolId,
      ...(stage && { stage }),
      ...(source && { source }),
      ...(assignedTo && { assignedTo }),
      ...(search && {
        OR: [
          { parentName: { contains: search, mode: "insensitive" } },
          { childName: { contains: search, mode: "insensitive" } },
          { parentPhone: { contains: search } },
        ],
      }),
    };

    const [leads, total, stageStats] = await Promise.all([
      prisma.admissionInquiry.findMany({
        where,
        include: {
          assignedUser: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { [sortBy]: sortDir },
        skip,
        take: limit,
      }),
      prisma.admissionInquiry.count({ where }),
      prisma.admissionInquiry.groupBy({
        by: ["stage"],
        where: { schoolId },
        _count: { stage: true },
      }),
    ]);

    const stageSummary = stageStats.reduce(
      (acc, s) => { acc[s.stage] = s._count.stage; return acc; },
      {}
    );

    return ok({
      leads,
      stageSummary,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/crm]:", error);
    return err("Failed to fetch leads.", 500);
  }
}

// ── POST — Create lead ────────────────────────────────────────────
export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const allowed = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN];
    if (!allowed.includes(user.role)) return err("Access denied.", 403);

    const body = await request.json().catch(() => null);
    if (!body) return err("Invalid request body.", 400);

    const {
      parentName, parentPhone, parentEmail, childName,
      childAge, childDob, classInterested, source,
      assignedTo, followUpDate, notes, priority,
      previousSchool, siblingInSchool, visitDate,
    } = body;

    if (!parentName?.trim()) return err("Parent name is required.", 400);
    if (!parentPhone?.trim()) return err("Parent phone is required.", 400);
    if (!/^\d{10}$/.test(parentPhone.replace(/\D/g, "").slice(-10))) {
      return err("Please enter a valid 10-digit phone number.", 400);
    }
    if (!classInterested) return err("Class interested is required.", 400);
    if (!source || !VALID_SOURCES.includes(source)) {
      return err(`Source must be one of: ${VALID_SOURCES.join(", ")}`, 400);
    }

    const lead = await prisma.admissionInquiry.create({
      data: {
        parentName: parentName.trim(),
        parentPhone: parentPhone.replace(/\D/g, "").slice(-10),
        parentEmail: parentEmail?.trim() || null,
        childName: childName?.trim() || null,
        childAge: childAge ? parseInt(childAge) : null,
        childDob: childDob ? new Date(childDob) : null,
        classInterested,
        source,
        stage: "NEW_LEAD",
        assignedTo: assignedTo || null,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        notes: notes?.trim() || null,
        priority: priority || "MEDIUM",
        previousSchool: previousSchool?.trim() || null,
        siblingInSchool: siblingInSchool || false,
        visitDate: visitDate ? new Date(visitDate) : null,
        schoolId: user.schoolId,
      },
      include: {
        assignedUser: { select: { id: true, name: true } },
      },
    });

    return ok({ lead }, "Admission inquiry created successfully.", 201);
  } catch (error) {
    console.error("[POST /api/crm]:", error);
    return err("Failed to create lead.", 500);
  }
}