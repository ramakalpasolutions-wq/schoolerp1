// components/attendance/GeoAttendance.js

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Navigation,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Crosshair,
  Radio,
  Shield,
  ShieldAlert,
  LocateFixed,
  Wifi,
  WifiOff,
} from "lucide-react";
import { calculateDistance, detectFakeGPS } from "@src/lib/haversine";

// ── Distance Bar ─────────────────────────────────────────────────
function DistanceBar({ distance, radius }) {
  const pct = Math.min((distance / (radius * 2)) * 100, 100);
  const isWithin = distance <= radius;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-500 dark:text-slate-400">School</span>
        <span className="text-slate-500 dark:text-slate-400">
          Boundary ({radius}m)
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          2× Radius ({radius * 2}m)
        </span>
      </div>
      <div className="relative h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        {/* Radius zone */}
        <div
          className="absolute top-0 left-0 h-full bg-emerald-200 dark:bg-emerald-500/20 rounded-full"
          style={{ width: "50%" }}
        />
        {/* Boundary line */}
        <div className="absolute top-0 left-1/2 h-full w-0.5 bg-emerald-500 dark:bg-emerald-400 z-10" />
        {/* User position */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-md transition-all duration-700 z-20 ${
            isWithin ? "bg-emerald-500" : "bg-red-500"
          }`}
          style={{ left: `calc(${Math.min(pct, 96)}% - 8px)` }}
        />
      </div>
      <div className="flex justify-center">
        <span
          className={`text-xs font-bold ${isWithin ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
        >
          You are {distance}m from school
          {isWithin ? " — Within range" : " — Out of range"}
        </span>
      </div>
    </div>
  );
}

// ── Pulsing GPS Dot ──────────────────────────────────────────────
function PulsingDot({ color = "blue" }) {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
  };
  const pulseColors = {
    blue: "bg-blue-400",
    green: "bg-emerald-400",
    red: "bg-red-400",
    amber: "bg-amber-400",
  };
  return (
    <span className="relative flex h-3 w-3">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pulseColors[color]} opacity-75`}
      />
      <span
        className={`relative inline-flex rounded-full h-3 w-3 ${colors[color]}`}
      />
    </span>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
export default function GeoAttendance({
  schoolLat = 14.6929,
  schoolLon = 79.1591,
  schoolRadius = 200,
  onLocationResult,
  showMapPlaceholder = true,
}) {
  const [gpsState, setGpsState] = useState("idle"); // idle | fetching | success | error | denied
  const [coords, setCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isWithin, setIsWithin] = useState(null);
  const [fakeGpsResult, setFakeGpsResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [accuracy, setAccuracy] = useState(null);

  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsState("error");
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }

    setGpsState("fetching");
    setCoords(null);
    setDistance(null);
    setIsWithin(null);
    setFakeGpsResult(null);
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy: acc } = position.coords;

        // ── Fake GPS detection ───────────────────────────────
        const fakeResult = await detectFakeGPS(position);
        setFakeGpsResult(fakeResult);

        // ── Distance calc ────────────────────────────────────
        const dist = Math.round(
          calculateDistance(latitude, longitude, schoolLat, schoolLon)
        );
        const within = dist <= schoolRadius;

        setCoords({ lat: latitude, lon: longitude });
        setAccuracy(Math.round(acc));
        setDistance(dist);
        setIsWithin(within);
        setGpsState("success");

        // Callback
        if (onLocationResult) {
          onLocationResult({
            coords: { lat: latitude, lon: longitude },
            distance: dist,
            isWithin: within,
            isFakeGps: fakeResult.isFake,
            accuracy: Math.round(acc),
          });
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGpsState("denied");
          setErrorMsg(
            "Location access denied. Please allow location access in your browser settings."
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsState("error");
          setErrorMsg("Location information unavailable. Please try again.");
        } else {
          setGpsState("error");
          setErrorMsg("Location request timed out. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, [schoolLat, schoolLon, schoolRadius, onLocationResult]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-blue-950/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
            <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Geo-Location Verification
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              School radius: {schoolRadius}m
            </p>
          </div>
        </div>

        {/* Live status dot */}
        <div className="flex items-center gap-2">
          {gpsState === "fetching" && <PulsingDot color="blue" />}
          {gpsState === "success" && isWithin && !fakeGpsResult?.isFake && (
            <PulsingDot color="green" />
          )}
          {gpsState === "success" && (!isWithin || fakeGpsResult?.isFake) && (
            <PulsingDot color="red" />
          )}
          {(gpsState === "error" || gpsState === "denied") && (
            <PulsingDot color="amber" />
          )}
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            {gpsState === "idle" && "Not started"}
            {gpsState === "fetching" && "Locating..."}
            {gpsState === "success" && "GPS Active"}
            {gpsState === "error" && "GPS Error"}
            {gpsState === "denied" && "Permission Denied"}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* ── IDLE STATE ─────────────────────────────────────── */}
        {gpsState === "idle" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <Crosshair className="w-10 h-10 text-blue-400 dark:text-blue-500" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-blue-200 dark:border-blue-500/20 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                GPS Location Not Fetched
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Click below to verify your location
              </p>
            </div>
          </div>
        )}

        {/* ── FETCHING STATE ─────────────────────────────────── */}
        {gpsState === "fetching" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative w-20 h-20">
              {/* Expanding rings */}
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-blue-400 dark:border-blue-500 animate-ping"
                  style={{ animationDelay: `${i * 0.3}s`, animationDuration: "1.5s" }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <MapPin className="w-5 h-5 text-white animate-bounce" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Fetching Your Location...
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Please allow location access when prompted
              </p>
            </div>

            {/* Animated progress */}
            <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: "60%" }} />
            </div>
          </div>
        )}

        {/* ── SUCCESS STATE ──────────────────────────────────── */}
        {gpsState === "success" && coords && (
          <div className="space-y-4">
            {/* Fake GPS Warning */}
            {fakeGpsResult?.isFake && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/30 animate-in slide-in-from-top-2 duration-300">
                <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-700 dark:text-red-400">
                    ⚠️ Fake GPS Detected!
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400/80 mt-1">
                    Mock location or VPN detected. Attendance cannot be marked
                    with a spoofed location.
                  </p>
                  {fakeGpsResult.indicators.length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                      {fakeGpsResult.indicators.map((ind, i) => (
                        <li key={i} className="text-xs text-red-500 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                          {ind}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Main status banner */}
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                isWithin && !fakeGpsResult?.isFake
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30"
                  : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isWithin && !fakeGpsResult?.isFake
                    ? "bg-emerald-100 dark:bg-emerald-500/20"
                    : "bg-red-100 dark:bg-red-500/20"
                }`}
              >
                {isWithin && !fakeGpsResult?.isFake ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <p
                  className={`text-base font-bold ${
                    isWithin && !fakeGpsResult?.isFake
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {isWithin && !fakeGpsResult?.isFake
                    ? "✅ Within School Premises"
                    : fakeGpsResult?.isFake
                      ? "🚫 Fake GPS Blocked"
                      : "❌ Outside School Radius"}
                </p>
                <p
                  className={`text-xs mt-0.5 ${
                    isWithin && !fakeGpsResult?.isFake
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {isWithin && !fakeGpsResult?.isFake
                    ? `You are ${distance}m from school — Attendance can be marked`
                    : fakeGpsResult?.isFake
                      ? "Disable mock location and try again"
                      : `You are ${distance}m away — Move closer to school (within ${schoolRadius}m)`}
                </p>
              </div>
            </div>

            {/* Coordinate Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Your Location */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <LocateFixed className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Location
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Lat: {coords.lat.toFixed(6)}
                </p>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Lon: {coords.lon.toFixed(6)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  Accuracy: ±{accuracy}m
                </p>
              </div>

              {/* School Location */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    School Location
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Lat: {schoolLat.toFixed(6)}
                </p>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Lon: {schoolLon.toFixed(6)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Radio className="w-3 h-3" />
                  Radius: {schoolRadius}m
                </p>
              </div>
            </div>

            {/* Distance Bar */}
            <DistanceBar distance={distance} radius={schoolRadius} />

            {/* GPS Trust indicator */}
            {!fakeGpsResult?.isFake && (
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  GPS trust:{" "}
                  <span
                    className={`font-semibold ${
                      fakeGpsResult?.confidence === "High"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : fakeGpsResult?.confidence === "Medium"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {fakeGpsResult?.confidence || "High"}
                  </span>{" "}
                  • Accuracy: ±{accuracy}m
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── ERROR / DENIED STATES ──────────────────────────── */}
        {(gpsState === "error" || gpsState === "denied") && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
              {gpsState === "denied" ? (
                <WifiOff className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                {gpsState === "denied" ? "Location Access Denied" : "GPS Error"}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
                {errorMsg}
              </p>
              {gpsState === "denied" && (
                <div className="mt-3 text-left text-xs text-slate-400 dark:text-slate-500 space-y-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  <p className="font-semibold text-slate-600 dark:text-slate-300">
                    How to enable location:
                  </p>
                  <p>• Click the lock icon 🔒 in your browser address bar</p>
                  <p>• Set Location to "Allow"</p>
                  <p>• Refresh the page and try again</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map Placeholder */}
        {showMapPlaceholder && gpsState === "success" && (
          <div className="h-32 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              {/* Grid pattern for map feel */}
              <div className="grid grid-cols-8 grid-rows-4 h-full w-full">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="border border-emerald-500" />
                ))}
              </div>
            </div>
            {/* School marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className={`w-8 h-8 rounded-full border-4 border-emerald-500 ${isWithin ? "bg-emerald-100" : "bg-red-100"} flex items-center justify-center`}>
                  <div className={`w-3 h-3 rounded-full ${isWithin ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
                </div>
                {/* Radius ring */}
                <div className="absolute inset-0 -m-6 w-20 h-20 rounded-full border-2 border-dashed border-emerald-400 dark:border-emerald-500 opacity-60 animate-pulse" />
              </div>
            </div>
            <div className="absolute bottom-2 right-3 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              📍 Map view (Google Maps integration ready)
            </div>
          </div>
        )}

        {/* Fetch Button */}
        <button
          onClick={fetchLocation}
          disabled={gpsState === "fetching"}
          className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 ${
            gpsState === "fetching"
              ? "bg-blue-100 dark:bg-blue-500/10 text-blue-400 cursor-not-allowed"
              : gpsState === "success"
                ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700"
          }`}
        >
          {gpsState === "fetching" ? (
            <>
              <PulsingDot color="blue" />
              Fetching GPS Location...
            </>
          ) : gpsState === "success" ? (
            <>
              <Navigation className="w-4 h-4" />
              Refresh Location
            </>
          ) : (
            <>
              <LocateFixed className="w-4 h-4" />
              Get My Location
            </>
          )}
        </button>
      </div>
    </div>
  );
}