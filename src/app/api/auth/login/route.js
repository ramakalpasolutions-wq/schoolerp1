// src/app/api/auth/login/route.js

import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { comparePassword, generateToken, ROLE_REDIRECTS } from "../../../../lib/auth";

// ── Response helpers ─────────────────────────────────────────────
const ok = (data, message = "Success", status = 200) =>
  NextResponse.json({ success: true, message, data }, { status });

const err = (message = "Error", status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) return err("Invalid JSON body.", 400);

    const { email, password } = body;

    // ── Input validation ──────────────────────────────────────
    if (!email?.trim()) return err("Email is required.", 400);
    if (!password) return err("Password is required.", 400);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return err("Please enter a valid email address.", 400);
    }

    if (password.length < 6) {
      return err("Password must be at least 6 characters.", 400);
    }

    // ── Find user ─────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            logo: true,
            isActive: true,
            subscription: true,
          },
        },
      },
    });

    if (!user) {
      return err("No account found with this email address.", 401);
    }

    // ── Account status checks ─────────────────────────────────
    if (!user.isActive) {
      return err("Your account has been deactivated. Please contact your administrator.", 403);
    }

    if (user.role !== "SUPER_ADMIN") {
      if (user.school && !user.school.isActive) {
        return err("Your school account is currently inactive. Please contact support.", 403);
      }
      if (user.school?.subscription && !user.school.subscription.isActive) {
        return err("School subscription has expired. Please contact your administrator.", 403);
      }
    }

    // ── Verify password ───────────────────────────────────────
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return err("Incorrect password. Please try again.", 401);
    }

    // ── Generate token ────────────────────────────────────────
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      name: user.name,
    });

    // ── Update last login ─────────────────────────────────────
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        deviceInfo: {
          userAgent: request.headers.get("user-agent") || "unknown",
          loginAt: new Date().toISOString(),
          ip: request.headers.get("x-forwarded-for") || "unknown",
        },
      },
    });

    // ── Build response ────────────────────────────────────────
    const redirectPath = ROLE_REDIRECTS[user.role] || "/admin";

    const response = ok(
      {
        token,
        redirectPath,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          schoolId: user.schoolId,
          school: user.school
            ? { id: user.school.id, name: user.school.name, logo: user.school.logo }
            : null,
        },
      },
      `Welcome back, ${user.name}!`
    );

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Login API Error]:", error);
    return err("Internal server error. Please try again later.", 500);
  }
}