// hooks/useGeoLocation.js
"use client";

import { useState, useCallback } from "react";
import { calculateDistance, detectFakeGPS } from "@src/lib/haversine";

export function useGeoLocation({
  schoolLat    = 14.6929,
  schoolLon    = 79.1591,
  schoolRadius = 200,
} = {}) {
  const [state, setState] = useState({
    status:    "idle",   // idle | fetching | success | error | denied
    coords:    null,
    distance:  null,
    accuracy:  null,
    isWithin:  null,
    isFakeGps: null,
    fakeResult:null,
    error:     "",
  });

  const fetch = useCallback(() => {
    if (!navigator.geolocation) {
      setState((p) => ({
        ...p,
        status: "error",
        error:  "Geolocation is not supported by your browser.",
      }));
      return;
    }

    setState((p) => ({ ...p, status: "fetching", error: "" }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        const fakeResult = await detectFakeGPS(position);
        const dist       = Math.round(
          calculateDistance(latitude, longitude, schoolLat, schoolLon)
        );
        const within = dist <= schoolRadius;

        setState({
          status:    "success",
          coords:    { lat: latitude, lon: longitude },
          distance:  dist,
          accuracy:  Math.round(accuracy),
          isWithin:  within,
          isFakeGps: fakeResult.isFake,
          fakeResult,
          error:     "",
        });
      },
      (err) => {
        const denied = err.code === err.PERMISSION_DENIED;
        setState((p) => ({
          ...p,
          status: denied ? "denied" : "error",
          error:  denied
            ? "Location access denied. Please allow in browser settings."
            : "Unable to get location. Please try again.",
        }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [schoolLat, schoolLon, schoolRadius]);

  const reset = useCallback(() => {
    setState({
      status: "idle", coords: null, distance: null,
      accuracy: null, isWithin: null, isFakeGps: null,
      fakeResult: null, error: "",
    });
  }, []);

  return { ...state, fetchLocation: fetch, reset };
}