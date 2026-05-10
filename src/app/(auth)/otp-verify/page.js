// src/app/(auth)/otp-verify/page.js

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  KeyRound,
} from "lucide-react";

export default function OTPVerifyPage() {
  const router = useRouter();
  const inputRefs = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // ── Get email from session ──────────────────────────────────
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/forgot-password");
    }
  }, [router]);

  // ── Countdown Timer ─────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // ── Auto focus first input ──────────────────────────────────
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // ── Handle OTP Input Change ─────────────────────────────────
  function handleChange(index, value) {
    if (error) setError("");
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === 6) {
        handleVerify(fullOtp);
      }
    }
  }

  // ── Handle Key Down ─────────────────────────────────────────
  function handleKeyDown(index, e) {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  // ── Handle Paste ────────────────────────────────────────────
  function handlePaste(e) {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (digits.length === 0) return;

    const newOtp = [...otp];
    digits.split("").forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    setOtp(newOtp);

    const focusIndex = Math.min(digits.length, 5);
    inputRefs.current[focusIndex]?.focus();

    if (digits.length === 6) handleVerify(digits);
  }

  // ── Verify OTP ──────────────────────────────────────────────
  const handleVerify = useCallback(
    async (otpString) => {
      const finalOtp = otpString || otp.join("");
      if (finalOtp.length !== 6) {
        setError("Please enter the complete 6-digit OTP");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            otp: finalOtp,
            action: "verify",
          }),
        });

        const data = await res.json();

        if (!data.success) {
          setError(data.message);
          setIsLoading(false);
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
          return;
        }

        setSuccess(true);
        setTimeout(() => {
          sessionStorage.removeItem("resetEmail");
          router.push("/login");
        }, 2000);
      } catch (err) {
        setError("Network error. Please try again.");
        setIsLoading(false);
      }
    },
    [otp, email, router]
  );

  // ── Resend OTP ──────────────────────────────────────────────
  async function handleResend() {
    if (!canResend) return;
    setIsResending(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "send" }),
      });

      const data = await res.json();

      if (data.success) {
        setCountdown(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  }

  // ── Helpers ─────────────────────────────────────────────────
  function formatCountdown(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function maskEmail(e) {
    if (!e) return "";
    const [local, domain] = e.split("@");
    return `${local.charAt(0)}***${local.charAt(local.length - 1)}@${domain}`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6">
      <div className="fixed top-40 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 p-8 sm:p-10">
          {!success ? (
            <>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 mx-auto">
                <KeyRound className="w-8 h-8 text-white" />
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Verify OTP
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm mt-1">
                  {maskEmail(email)}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* OTP Boxes */}
              <div className="flex justify-center gap-3 sm:gap-4 mb-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={isLoading}
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none ${
                      digit
                        ? "border-blue-500 ring-2 ring-blue-500/20"
                        : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    } disabled:opacity-50`}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="text-center mb-6">
                {!canResend ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {countdown}
                      </span>
                    </div>
                    <span>
                      Resend in{" "}
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {formatCountdown(countdown)}
                      </span>
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={isResending}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isResending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    {isResending ? "Resending..." : "Resend OTP"}
                  </button>
                )}
              </div>

              <button
                onClick={() => handleVerify()}
                disabled={isLoading || otp.join("").length !== 6}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Verify OTP
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Expires in 5 min • Max 3 attempts</span>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-950/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in-50 duration-300">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Verified! ✓
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Your identity has been verified. Redirecting to login...
              </p>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  Redirecting...
                </span>
              </div>
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