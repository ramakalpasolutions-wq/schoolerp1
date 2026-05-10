// lib/auth.js

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.JWT_SECRET || "school-erp-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const SALT_ROUNDS = 12;

// ── Role constants ───────────────────────────────────────────────
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  SCHOOL_ADMIN: "SCHOOL_ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  PARENT: "PARENT",
  ACCOUNTANT: "ACCOUNTANT",
};

export const ROLE_REDIRECTS = {
  SUPER_ADMIN: "/super-admin",
  SCHOOL_ADMIN: "/admin",
  TEACHER: "/teacher",
  STUDENT: "/student",
  PARENT: "/parent",
  ACCOUNTANT: "/accountant",
};

// ══════════════════════════════════════════════════════════════════
// JWT FUNCTIONS
// ══════════════════════════════════════════════════════════════════

/**
 * Generate a signed JWT token
 * @param {Object} payload - { id, email, role, schoolId, name }
 * @returns {string} signed JWT
 */
export function generateToken(payload) {
  if (!payload?.id || !payload?.role) {
    throw new Error("Token payload must include id and role");
  }

  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      schoolId: payload.schoolId || null,
      name: payload.name || "",
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verify and decode a JWT token
 * @param {string} token
 * @returns {{ valid: boolean, decoded: Object|null, error: string|null }}
 */
export function verifyToken(token) {
  if (!token) {
    return { valid: false, decoded: null, error: "No token provided" };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, decoded, error: null };
  } catch (error) {
    const errorMap = {
      TokenExpiredError: "Token has expired. Please login again.",
      JsonWebTokenError: "Invalid token. Please login again.",
      NotBeforeError: "Token not yet valid.",
    };
    return {
      valid: false,
      decoded: null,
      error: errorMap[error.name] || "Token verification failed.",
    };
  }
}

/**
 * Decode token without verification (for reading claims only)
 */
export function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
}

// ══════════════════════════════════════════════════════════════════
// PASSWORD FUNCTIONS
// ══════════════════════════════════════════════════════════════════

/**
 * Hash a plain-text password
 */
export async function hashPassword(password) {
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain-text password against a hash
 */
export async function comparePassword(password, hashedPassword) {
  if (!password || !hashedPassword) return false;
  return bcrypt.compare(password, hashedPassword);
}

// ══════════════════════════════════════════════════════════════════
// REQUEST HELPERS
// ══════════════════════════════════════════════════════════════════

/**
 * Extract and verify token from Authorization header
 * Usage in API routes: const user = getUserFromRequest(request)
 */
export function getUserFromRequest(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cookieHeader = request.cookies?.get?.("token")?.value;

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : cookieHeader;

    if (!token) return null;

    const { valid, decoded } = verifyToken(token);
    return valid ? decoded : null;
  } catch {
    return null;
  }
}

/**
 * Server-side session from cookies (Next.js Server Components)
 */
export async function getServerSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const { valid, decoded } = verifyToken(token);
    return valid ? decoded : null;
  } catch {
    return null;
  }
}

/**
 * Require authentication — returns user or throws
 */
export function requireAuth(request) {
  const user = getUserFromRequest(request);
  if (!user) {
    const error = new Error("Authentication required. Please login.");
    error.status = 401;
    throw error;
  }
  return user;
}

/**
 * Require specific role(s)
 */
export function requireRole(user, roles = []) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  if (!allowedRoles.includes(user.role)) {
    const error = new Error(
      `Access denied. Required role: ${allowedRoles.join(" or ")}`
    );
    error.status = 403;
    throw error;
  }
  return true;
}

/**
 * Require school context (non-super-admin users must have schoolId)
 */
export function requireSchool(user) {
  if (user.role !== ROLES.SUPER_ADMIN && !user.schoolId) {
    const error = new Error("School context required.");
    error.status = 403;
    throw error;
  }
  return true;
}

// ══════════════════════════════════════════════════════════════════
// OTP UTILITIES (in-memory, replace with Redis in production)
// ══════════════════════════════════════════════════════════════════

const otpStore = new Map();

export function generateOTP(email) {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    attempts: 0,
  });
  return otp;
}

export function verifyOTP(email, otp) {
  const key = email.toLowerCase();
  const stored = otpStore.get(key);

  if (!stored) {
    return { valid: false, message: "OTP not found. Request a new one." };
  }
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(key);
    return { valid: false, message: "OTP expired. Request a new one." };
  }
  if (stored.attempts >= 3) {
    otpStore.delete(key);
    return { valid: false, message: "Too many attempts. Request a new OTP." };
  }
  if (stored.otp !== otp) {
    stored.attempts += 1;
    return {
      valid: false,
      message: `Invalid OTP. ${3 - stored.attempts} attempts remaining.`,
    };
  }

  otpStore.delete(key);
  return { valid: true, message: "OTP verified successfully." };
}