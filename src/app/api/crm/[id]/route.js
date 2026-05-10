// src/app/api/crm/[id]/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest, ROLES } from "@/lib/auth";

const ok = (data, message = "Success", status = 200) =>
  NextResponse.json({ success: true, message, data }, { status });
const err = (message = "Error", status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

const STAGE_ORDER = [
  "NEW_LEAD", "INTERESTED", "COUNSELING",
  "VISIT_SCHEDULED", "CONFIRMED",
];

// ── GET — Lead details ────────────────────────────────────────────
export async function GET(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const allowed = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN];
    if (!allowed.includes(user.role)) return err("Access denied.", 403);

    const { id } = params;

    const lead = await prisma.admissionInquiry.findUnique({
      where: { id },
      include: {
        assignedUser: { select: { id: true, name: true, email: true } },
        school: { select: { name: true } },
      },
    });

    if (!lead) return err("Lead not found.", 404);

    if (user.role !== ROLES.SUPER_ADMIN && lead.schoolId !== user.schoolId) {
      return err("Access denied.", 404);
    }

    const stageIndex = STAGE_ORDER.indexOf(lead.stage);
    const nextStage = stageIndex < STAGE_ORDER.length - 1
      ? STAGE_ORDER[stageIndex + 1]
      : null;
    const previousStage = stageIndex > 0 ? STAGE_ORDER[stageIndex - 1] : null;

    return ok({
      lead,
      navigation: {
        currentStageIndex: stageIndex,
        totalStages: STAGE_ORDER.length,
        nextStage,
        previousStage,
        canAdvance: !!nextStage,
        isConverted: lead.stage === "CONFIRMED",
      },
    });
  } catch (error) {
    console.error("[GET /api/crm/[id]]:", error);
    return err("Failed to fetch lead.", 500);
  }
}

// ── PUT — Update lead / move stage ────────────────────────────────
export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const allowed = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN];
    if (!allowed.includes(user.role)) return err("Access denied.", 403);

    const { id } = params;
    const body = await request.json().catch(() => null);
    if (!body) return err("Invalid request body.", 400);

    const existing = await prisma.admissionInquiry.findUnique({ where: { id } });
    if (!existing) return err("Lead not found.", 404);

    if (user.role !== ROLES.SUPER_ADMIN && existing.schoolId !== user.schoolId) {
      return err("Access denied.", 403);
    }

    const {
      stage, parentName, parentPhone, parentEmail,
      childName, childAge, classInterested, source,
      assignedTo, followUpDate, notes, priority,
      visitDate, convertedAt,
    } = body;

    // Validate stage transition
    if (stage) {
      const validStages = [
        "NEW_LEAD", "INTERESTED", "COUNSELING",
        "VISIT_SCHEDULED", "CONFIRMED", "REJECTED", "DROPPED",
      ];
      if (!validStages.includes(stage)) {
        return err(`Invalid stage. Must be one of: ${validStages.join(", ")}`, 400);
      }
    }

    const updated = await prisma.admissionInquiry.update({
      where: { id },
      data: {
        ...(stage && { stage }),
        ...(parentName && { parentName: parentName.trim() }),
        ...(parentPhone && { parentPhone: parentPhone.replace(/\D/g, "").slice(-10) }),
        ...(parentEmail !== undefined && { parentEmail }),
        ...(childName !== undefined && { childName }),
        ...(childAge !== undefined && { childAge: parseInt(childAge) }),
        ...(classInterested && { classInterested }),
        ...(source && { source }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(followUpDate !== undefined && {
          followUpDate: followUpDate ? new Date(followUpDate) : null,
        }),
        ...(notes !== undefined && { notes }),
        ...(priority !== undefined && { priority }),
        ...(visitDate !== undefined && {
          visitDate: visitDate ? new Date(visitDate) : null,
        }),
        ...(stage === "CONFIRMED" && { convertedAt: new Date() }),
      },
      include: {
        assignedUser: { select: { id: true, name: true } },
      },
    });

    return ok({ lead: updated }, `Lead ${stage ? `moved to ${stage}` : "updated"} successfully.`);
  } catch (error) {
    console.error("[PUT /api/crm/[id]]:", error);
    return err("Failed to update lead.", 500);
  }
}

// ── DELETE — Delete lead ──────────────────────────────────────────
export async function DELETE(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const allowed = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN];
    if (!allowed.includes(user.role)) return err("Access denied.", 403);

    const { id } = params;

    const existing = await prisma.admissionInquiry.findUnique({ where: { id } });
    if (!existing) return err("Lead not found.", 404);

    if (user.role !== ROLES.SUPER_ADMIN && existing.schoolId !== user.schoolId) {
      return err("Access denied.", 403);
    }

    await prisma.admissionInquiry.delete({ where: { id } });

    return ok({ id }, "Lead deleted successfully.");
  } catch (error) {
    console.error("[DELETE /api/crm/[id]]:", error);
    return err("Failed to delete lead.", 500);
  }
}