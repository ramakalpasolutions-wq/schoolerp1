// src/app/(auth)/forgot-password/page.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Send,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [fieldError, setFieldError] = useState("");

  function validateEmail() {
    if (!email.trim()) {
      setFieldError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldError("Please enter a valid email address");
      return false;
    }
    setFieldError("");
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          action: "send",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setIsLoading(false);
        return;
      }

      setIsSent(true);
      sessionStorage.setItem("resetEmail", email.toLowerCase().trim());
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6">
      {/* Decorative */}
      <div className="fixed top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        {/* Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 p-8 sm:p-10">
          {!isSent ? (
            <>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 mx-auto">
                <Mail className="w-8 h-8 text-white" />
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Forgot Password?
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                  Enter your registered email. We&apos;ll send you a 6-digit OTP.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldError) setFieldError("");
                        if (error) setError("");
                      }}
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none ${
                        fieldError
                          ? "border-red-300 dark:border-red-700"
                          : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      }`}
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                  {fieldError && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {fieldError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send OTP
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-950/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in-50 duration-300">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                OTP Sent! ✉️
              </h2>

              <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                We&apos;ve sent a 6-digit OTP to
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-semibold mb-8">
                {email}
              </p>

              <div className="flex items-center gap-2 justify-center mb-8 text-sm text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4" />
                <span>OTP is valid for 5 minutes</span>
              </div>

              <button
                onClick={() => router.push("/otp-verify")}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Enter OTP
              </button>

              <button
                onClick={() => {
                  setIsSent(false);
                  setError("");
                }}
                className="mt-4 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Didn&apos;t receive? Try different email
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
          © {new Date().getFullYear()} School ERP — Rajyampet
        </p>
      </div>
    </div>
  );
}