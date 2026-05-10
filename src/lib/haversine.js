// src/lib/haversine.js

/**
 * Haversine formula — returns distance in meters
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) *
      Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Detect fake/mock GPS
 * Returns { isFake, confidence, indicators, suspicionScore }
 */
export async function detectFakeGPS(position) {
  const indicators = [];
  let suspicionScore = 0;

  const { latitude, longitude, accuracy, altitude, speed } = position.coords;

  // Check 1: Suspiciously perfect accuracy
  if (accuracy !== null && accuracy < 5) {
    indicators.push("Suspiciously high GPS accuracy (possible mock)");
    suspicionScore += 2;
  }

  // Check 2: Exact 1m accuracy
  if (accuracy !== null && accuracy === 1) {
    indicators.push("Exact 1m accuracy — likely mock location app");
    suspicionScore += 3;
  }

  // Check 3: Zero altitude on real coordinates
  if (altitude === 0 && latitude !== 0 && longitude !== 0) {
    indicators.push("Altitude reported as exactly 0");
    suspicionScore += 1;
  }

  // Check 4: Negative speed
  if (speed !== null && speed < 0) {
    indicators.push("Negative speed detected");
    suspicionScore += 3;
  }

  // Check 5: Round coordinates
  const latDecimals = latitude.toString().split(".")[1]?.length ?? 0;
  const lonDecimals = longitude.toString().split(".")[1]?.length ?? 0;
  if (latDecimals <= 2 && lonDecimals <= 2) {
    indicators.push("Coordinates are suspiciously round numbers");
    suspicionScore += 2;
  }

  const isFake = suspicionScore >= 4;
  const confidence =
    suspicionScore === 0 ? "High" : suspicionScore <= 2 ? "Medium" : "Low";

  return {
    isFake,
    confidence,
    indicators,
    suspicionScore,
  };
}