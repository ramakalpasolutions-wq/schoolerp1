// src/app/(auth)/login/page.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Shield,
  Users,
  BarChart3,
  Bell,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Geo-Fenced Attendance",
    desc: "GPS-based with fake location detection",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    desc: "Live dashboards for instant insights",
  },
  {
    icon: Bell,
    title: "Auto SMS Alerts",
    desc: "Instant parent notifications on attendance",
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    desc: "Admin, Teacher, Student, Parent & more",
  },
  {
    icon: BookOpen,
    title: "Complete Exam Suite",
    desc: "Marks entry, grades, and report cards",
  },
];

const roleGradients = {
  SUPER_ADMIN: "from-purple-500 to-indigo-600",
  SCHOOL_ADMIN: "from-blue-500 to-indigo-600",
  TEACHER: "from-emerald-500 to-teal-600",
  STUDENT: "from-orange-500 to-amber-600",
  PARENT: "from-pink-500 to-rose-600",
  ACCOUNTANT: "from-violet-500 to-purple-600",
};

const roleIcons = {
  SUPER_ADMIN: "🛡️",
  SCHOOL_ADMIN: "🏫",
  TEACHER: "👨‍🏫",
  STUDENT: "🎓",
  PARENT: "👨‍👩‍👧",
  ACCOUNTANT: "💰",
};

const roleLabels = {
  SUPER_ADMIN: "Super Admin",
  SCHOOL_ADMIN: "School Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
  ACCOUNTANT: "Accountant",
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [detectedRole, setDetectedRole] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Check if already logged in ──────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const parsed = JSON.parse(user);
        const payload = JSON.parse(atob(token.split(".")[1]));

        if (payload.exp && Date.now() / 1000 < payload.exp) {
          const redirects = {
            SUPER_ADMIN: "/super-admin",
            SCHOOL_ADMIN: "/admin",
            TEACHER: "/teacher",
            STUDENT: "/student",
            PARENT: "/parent",
            ACCOUNTANT: "/accountant",
          };
          router.replace(redirects[parsed.role] || "/admin");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [router]);

  // ── Load remembered email ───────────────────────────────────
  useEffect(() => {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  // ── Validation ──────────────────────────────────────────────
  function validateForm() {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // ── Handle Submit ───────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setDetectedRole(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setIsLoading(false);
        return;
      }

      // ── Show detected role animation ────────────────────────
      const userRole = data.data.user.role;
      setDetectedRole(userRole);
      setSuccess(data.message);

      // ── Store credentials ───────────────────────────────────
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // ── Auto redirect after role reveal ─────────────────────
      setTimeout(() => {
        router.push(data.data.redirectPath);
      }, 1500);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  }

  // ── Handle Input Change ─────────────────────────────────────
  function handleEmailChange(value) {
    setEmail(value);
    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: "" }));
    if (error) setError("");
  }

  function handlePasswordChange(value) {
    setPassword(value);
    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: "" }));
    if (error) setError("");
  }

  return (
    <div className="min-h-screen flex">
      {/* ════════════════════════════════════════════════════════
          LEFT SIDE — BRANDING (Hidden on Mobile)
          ════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />

        {/* Animated Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 25%, rgba(59,130,246,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(99,102,241,0.3) 0%, transparent 50%)",
            }}
          />
        </div>

        {/* Floating Blobs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">School ERP</h1>
              <p className="text-sm text-blue-300">Enterprise Platform</p>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Manage Your
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              School Smarter
            </span>
          </h2>

          <p className="text-lg text-slate-300 mb-12 max-w-md leading-relaxed">
            One platform for everything — attendance, fees, exams,
            homework, CRM, and real-time analytics.
          </p>

          {/* Features */}
          <div className="space-y-5">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="w-11 h-11 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all duration-300">
                  <feature.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trusted Badge */}
          <div className="mt-14 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[
                "from-blue-400 to-cyan-400",
                "from-purple-400 to-pink-400",
                "from-amber-400 to-orange-400",
                "from-emerald-400 to-teal-400",
              ].map((gradient, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} border-2 border-slate-900 flex items-center justify-center`}
                >
                  <span className="text-white text-xs font-bold">
                    {["S", "V", "R", "P"][i]}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                Trusted by 500+ Schools
              </p>
              <p className="text-slate-400 text-xs">
                50,000+ Users across India
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          RIGHT SIDE — LOGIN FORM
          ════════════════════════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                School ERP
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enterprise Management Platform
              </p>
            </div>
          </div>

          {/* ── Role Detected Success State ────────────────────── */}
          {detectedRole && success && (
            <div className="text-center py-6 animate-in zoom-in-95 duration-300">
              {/* Role Avatar */}
              <div className="relative mx-auto mb-6">
                <div
                  className={`w-24 h-24 bg-gradient-to-br ${roleGradients[detectedRole]} rounded-3xl flex items-center justify-center shadow-2xl mx-auto`}
                >
                  <span className="text-4xl">
                    {roleIcons[detectedRole]}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-950">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome Back! 🎉
              </h2>

              <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                Role detected automatically
              </p>

              {/* Role Badge */}
              <div
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r ${roleGradients[detectedRole]} text-white font-semibold text-sm shadow-lg mb-6`}
              >
                <Sparkles className="w-4 h-4" />
                Logging in as {roleLabels[detectedRole]}
              </div>

              {/* Loading indicator */}
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Redirecting to your dashboard...</span>
              </div>
            </div>
          )}

          {/* ── Login Form ─────────────────────────────────────── */}
          {!detectedRole && (
            <>
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Welcome Back 👋
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                  Enter your credentials — we&apos;ll detect your role
                  automatically
                </p>
              </div>

              {/* Auto-detect badge */}
              <div className="mb-6 flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl">
                <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  Your role (Admin, Teacher, Student, etc.) is automatically
                  detected from your email
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">
                      Login Failed
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none ${
                        fieldErrors.email
                          ? "border-red-300 dark:border-red-700 ring-4 ring-red-500/10"
                          : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      }`}
                      disabled={isLoading}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      placeholder="Enter your password"
                      className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all duration-200 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none ${
                        fieldErrors.password
                          ? "border-red-300 dark:border-red-700 ring-4 ring-red-500/10"
                          : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      }`}
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-0.5"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200 flex items-center justify-center">
                        {rememberMe && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      Remember me
                    </span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-[0.98] group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Role Hints */}
              <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                  Supported Roles
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400"
                    >
                      <span>{roleIcons[key]}</span>
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Help */}
              <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Having trouble?{" "}
                <a
                  href="mailto:support@schoolerp.com"
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Contact Support
                </a>
              </p>

              {/* Copyright */}
              <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600">
                © {new Date().getFullYear()} School ERP — Rajyampet. All rights
                reserved.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}