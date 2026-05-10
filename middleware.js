// middleware.js

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const getSecret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET || "school-erp-secret-key-change-in-production"
  );

// ── Role → allowed path prefixes ────────────────────────────────
const ROLE_PATHS = {
  SUPER_ADMIN: ["/super-admin", "/api"],
  SCHOOL_ADMIN: ["/admin", "/api"],
  TEACHER: ["/teacher", "/api"],
  STUDENT: ["/student", "/api"],
  PARENT: ["/parent", "/api"],
  ACCOUNTANT: ["/accountant", "/admin/fees", "/api"],
};

const PUBLIC_PATHS = [
  "/login",
  "/forgot-password",
  "/otp-verify",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/verify-otp",
  "/_next",
  "/favicon.ico",
  "/public",
  "/file.svg",
  "/globe.svg",
  "/next.svg",
  "/vercel.svg",
  "/window.svg",
];

const DASHBOARD_ROLE_MAP = {
  "/super-admin": ["SUPER_ADMIN"],
  "/admin": ["SCHOOL_ADMIN", "SUPER_ADMIN"],
  "/teacher": ["TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"],
  "/student": ["STUDENT", "SCHOOL_ADMIN", "SUPER_ADMIN"],
  "/parent": ["PARENT", "SCHOOL_ADMIN", "SUPER_ADMIN"],
  "/accountant": ["ACCOUNTANT", "SCHOOL_ADMIN", "SUPER_ADMIN"],
};

const ROLE_HOME = {
  SUPER_ADMIN: "/super-admin",
  SCHOOL_ADMIN: "/admin",
  TEACHER: "/teacher",
  STUDENT: "/student",
  PARENT: "/parent",
  ACCOUNTANT: "/accountant",
};

function isPublic(pathname) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith("/_next")
  );
}

function getToken(request) {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return request.cookies.get("token")?.value || null;
}

async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { ok: true, payload };
  } catch (e) {
    return { ok: false, payload: null };
  }
}

function jsonErr(msg, status) {
  return new NextResponse(JSON.stringify({ success: false, error: msg }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ── Static / public paths ────────────────────────────────────
  if (pathname.includes(".") || isPublic(pathname)) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── API routes ───────────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const token = getToken(request);
    if (!token) return jsonErr("Authentication required.", 401);

    const { ok, payload } = await verifyJWT(token);
    if (!ok) return jsonErr("Invalid or expired token. Please login again.", 401);

    const headers = new Headers(request.headers);
    headers.set("x-user-id", payload.id || "");
    headers.set("x-user-role", payload.role || "");
    headers.set("x-user-school", payload.schoolId || "");
    headers.set("x-user-email", payload.email || "");
    headers.set("x-user-name", payload.name || "");

    return NextResponse.next({ request: { headers } });
  }

  // ── Dashboard routes ─────────────────────────────────────────
  const matchedPrefix = Object.keys(DASHBOARD_ROLE_MAP).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!matchedPrefix) return NextResponse.next();

  const token = getToken(request);

  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  const { ok, payload } = await verifyJWT(token);

  if (!ok) {
    const url = new URL("/login", request.url);
    url.searchParams.set("expired", "1");
    const res = NextResponse.redirect(url);
    res.cookies.delete("token");
    return res;
  }

  const allowedRoles = DASHBOARD_ROLE_MAP[matchedPrefix];
  if (!allowedRoles.includes(payload.role)) {
    const home = ROLE_HOME[payload.role] || "/login";
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};