// src/app/api/notifications/send/route.js

import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { getUserFromRequest, ROLES } from "../../../../../lib/auth";
import { sendBulkSMS } from "../../../../../lib/sms";
import { sendBulkEmail } from "../../../../../lib/email";

const ok = (data, message = "Success") =>
  NextResponse.json({ success: true, message, data });
const err = (message = "Error", status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

function personalizeMessage(template, data = {}) {
  let msg = template;
  Object.entries(data).forEach(([key, val]) => {
    msg = msg.replace(new RegExp(`\\[${key}\\]`, "g"), val ?? "");
  });
  return msg;
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const allowed = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER];
    if (!allowed.includes(user.role)) return err("Access denied.", 403);

    const body = await request.json().catch(() => null);
    if (!body) return err("Invalid request body.", 400);

    const {
      title,
      message: messageTemplate,
      type = "GENERAL",
      recipientType,
      classId,
      channels = { sms: false, whatsapp: false, email: false, push: false },
      scheduleAt,
      individualIds = [],
    } = body;

    if (!title?.trim()) return err("Title is required.", 400);
    if (!messageTemplate?.trim()) return err("Message is required.", 400);

    const activeChannels = Object.entries(channels).filter(([, v]) => v);
    if (!activeChannels.length) return err("Select at least one channel.", 400);

    const school = await prisma.school.findUnique({
      where: { id: user.schoolId },
      select: { name: true },
    });

    // ── Build recipient list ──────────────────────────────────
    let recipients = [];

    if (recipientType === "ALL_PARENTS" || recipientType === "ALL") {
      const students = await prisma.student.findMany({
        where: { schoolId: user.schoolId, isActive: true },
        include: {
          parent: {
            select: { fatherPhone: true, motherPhone: true, fatherEmail: true },
          },
        },
      });
      recipients = students.map((s) => ({
        name: s.name,
        phone: s.parent?.fatherPhone || s.parent?.motherPhone,
        email: s.parent?.fatherEmail,
        studentName: s.name,
      })).filter((r) => r.phone || r.email);
    } else if (recipientType === "ALL_TEACHERS") {
      const teachers = await prisma.teacher.findMany({
        where: { schoolId: user.schoolId, isActive: true },
        select: { name: true, phone: true, email: true },
      });
      recipients = teachers
        .map((t) => ({ name: t.name, phone: t.phone, email: t.email, studentName: "" }))
        .filter((r) => r.phone || r.email);
    } else if (recipientType === "CLASS" && classId) {
      const students = await prisma.student.findMany({
        where: { classId, schoolId: user.schoolId, isActive: true },
        include: {
          parent: { select: { fatherPhone: true, fatherEmail: true } },
        },
      });
      recipients = students.map((s) => ({
        name: s.name,
        phone: s.parent?.fatherPhone,
        email: s.parent?.fatherEmail,
        studentName: s.name,
      })).filter((r) => r.phone || r.email);
    } else if (recipientType === "INDIVIDUAL" && individualIds.length) {
      const students = await prisma.student.findMany({
        where: { id: { in: individualIds } },
        include: { parent: { select: { fatherPhone: true, fatherEmail: true } } },
      });
      recipients = students.map((s) => ({
        name: s.name,
        phone: s.parent?.fatherPhone,
        email: s.parent?.fatherEmail,
        studentName: s.name,
      })).filter((r) => r.phone || r.email);
    }

    // ── Log to DB first ───────────────────────────────────────
    const channelList = Object.entries(channels).filter(([, v]) => v).map(([k]) => k.toUpperCase());
    const recipientIds = await prisma.user
      .findMany({ where: { schoolId: user.schoolId }, select: { id: true } })
      .then((users) => users.map((u) => u.id));

    const notification = await prisma.notification.create({
      data: {
        title: title.trim(),
        message: messageTemplate.trim(),
        type,
        recipientType: recipientType || "ALL",
        recipientIds,
        channels: channelList,
        sentBy: user.id,
        sentAt: scheduleAt ? new Date(scheduleAt) : new Date(),
        schoolId: user.schoolId,
        totalSent: 0,
        totalFailed: 0,
      },
    });

    // ── If scheduled, return early ────────────────────────────
    if (scheduleAt) {
      return ok(
        { notificationId: notification.id, scheduled: true, scheduledAt: scheduleAt },
        `Notification scheduled for ${new Date(scheduleAt).toLocaleString("en-IN")}`
      );
    }

    // ── Send immediately ──────────────────────────────────────
    let totalSent = 0;
    let totalFailed = 0;

    // SMS
    if (channels.sms) {
      const phones = recipients.map((r) => r.phone).filter(Boolean);
      if (phones.length > 0) {
        const smsResults = await sendBulkSMS(
          phones,
          personalizeMessage(messageTemplate, { SCHOOL_NAME: school?.name })
        );
        totalSent += smsResults.sent || 0;
        totalFailed += smsResults.failed || 0;
      }
    }

    // Email
    if (channels.email) {
      const emailList = recipients
        .filter((r) => r.email)
        .map((r) => ({
          email: r.email,
          data: { STUDENT_NAME: r.studentName, SCHOOL_NAME: school?.name || "School" },
        }));

      if (emailList.length > 0) {
        const emailResult = await sendBulkEmail(emailList, title, messageTemplate);
        totalSent += emailResult.sent || 0;
        totalFailed += emailResult.failed || 0;
      }
    }

    // Update stats
    await prisma.notification.update({
      where: { id: notification.id },
      data: { totalSent, totalFailed },
    });

    return ok(
      {
        notificationId: notification.id,
        totalRecipients: recipients.length,
        totalSent,
        totalFailed,
        channels: channelList,
      },
      `Notification sent to ${totalSent} recipients.`
    );
  } catch (error) {
    console.error("[POST /api/notifications/send]:", error);
    return err("Failed to send notification.", 500);
  }
}