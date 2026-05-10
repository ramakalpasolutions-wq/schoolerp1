// src/app/api/fees/reminder/route.js

import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { getUserFromRequest, ROLES } from "../../../../../lib/auth";
import { sendFeeReminderSMS, sendBulkSMS } from "../../../../../lib/sms";

const ok = (data, message = "Success") =>
  NextResponse.json({ success: true, message, data });
const err = (message = "Error", status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const allowed = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.ACCOUNTANT];
    if (!allowed.includes(user.role)) return err("Access denied.", 403);

    const body = await request.json().catch(() => null);
    if (!body) return err("Invalid request body.", 400);

    const {
      studentIds = [],
      channels = { sms: true, whatsapp: false, email: false },
      customMessage,
    } = body;

    if (!studentIds.length) return err("At least one student ID required.", 400);

    const school = await prisma.school.findUnique({
      where: { id: user.schoolId },
      select: { name: true },
    });

    const results = {
      total: studentIds.length,
      processed: 0,
      smsSent: 0,
      smsFailed: 0,
      whatsappSent: 0,
      emailSent: 0,
      errors: [],
      reminders: [],
    };

    for (const studentId of studentIds) {
      try {
        const student = await prisma.student.findUnique({
          where: { id: studentId },
          include: {
            parent: {
              select: {
                id: true,
                fatherPhone: true,
                motherPhone: true,
                fatherEmail: true,
                motherEmail: true,
              },
            },
            fees: {
              where: { status: { in: ["PENDING", "OVERDUE"] } },
              orderBy: { dueDate: "asc" },
            },
          },
        });

        if (!student || !student.fees.length) continue;

        const totalPending = student.fees.reduce(
          (sum, f) => sum + (f.amount - (f.paidAmount || 0)),
          0
        );
        const earliestDue = student.fees[0]?.dueDate;
        const dueDate = earliestDue
          ? new Date(earliestDue).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })
          : "soon";

        const smsMessage = customMessage
          ? customMessage
              .replace("[STUDENT_NAME]", student.name)
              .replace("[AMOUNT]", totalPending.toLocaleString("en-IN"))
              .replace("[DATE]", dueDate)
              .replace("[SCHOOL_NAME]", school?.name || "School")
          : `Dear Parent, ${student.name}'s fee of Rs.${totalPending.toLocaleString("en-IN")} is due on ${dueDate}. Please pay at school. - ${school?.name || "School"}`;

        const phones = [
          student.parent?.fatherPhone,
          student.parent?.motherPhone,
        ].filter(Boolean);

        // Send SMS
        if (channels.sms && phones.length > 0) {
          const smsResult = await sendBulkSMS(phones, smsMessage);
          results.smsSent += smsResult.sent || 0;
          results.smsFailed += smsResult.failed || 0;
        }

        // Log reminder to DB
        if (student.parent) {
          const channelList = Object.entries(channels)
            .filter(([, v]) => v)
            .map(([k]) => k.toUpperCase());

          for (const fee of student.fees.slice(0, 1)) {
            for (const channel of channelList) {
              await prisma.feeReminder.create({
                data: {
                  studentId,
                  parentId: student.parent.id,
                  feeId: fee.id,
                  sentAt: new Date(),
                  channel,
                  status: "SENT",
                  message: smsMessage,
                  schoolId: user.schoolId,
                },
              });
            }
          }
        }

        results.processed++;
        results.reminders.push({
          studentId,
          studentName: student.name,
          pendingAmount: totalPending,
          phones,
          status: "sent",
        });
      } catch (studentErr) {
        results.errors.push({ studentId, error: studentErr.message });
      }
    }

    return ok(results, `Reminders sent: ${results.smsSent} SMS delivered, ${results.smsFailed} failed.`);
  } catch (error) {
    console.error("[POST /api/fees/reminder]:", error);
    return err("Failed to send reminders.", 500);
  }
}