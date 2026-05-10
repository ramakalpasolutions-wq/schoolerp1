// src/app/api/auth/verify-otp/route.js

import { NextResponse } from "next/server";
import { verifyOTP, generateOTP } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ── VERIFY OTP ──────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp, action } = body;

    // ── Send OTP Action ─────────────────────────────────────
    if (action === "send") {
      if (!email) {
        return NextResponse.json(
          { success: false, message: "Email is required." },
          { status: 400 }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: "Please enter a valid email." },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, message: "No account found with this email." },
          { status: 404 }
        );
      }

      const otp = generateOTP(email.toLowerCase().trim());

      // In production, send via SMS/Email service
      console.log(`[DEV] OTP for ${email}: ${otp}`);

      return NextResponse.json(
        {
          success: true,
          message: "OTP sent successfully to your registered email.",
          // Remove in production:
          devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
        },
        { status: 200 }
      );
    }

    // ── Verify OTP Action ───────────────────────────────────
    if (action === "verify") {
      if (!email || !otp) {
        return NextResponse.json(
          { success: false, message: "Email and OTP are required." },
          { status: 400 }
        );
      }

      const result = verifyOTP(email.toLowerCase().trim(), otp);

      if (!result.valid) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: result.message,
          data: { verified: true, email },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Invalid action. Use 'send' or 'verify'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}