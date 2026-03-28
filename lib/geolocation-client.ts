/** Browser Geolocation helpers (client-only). */

export function isGeolocationSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.geolocation;
}

export function getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error("Geolocation is not supported in this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 20_000,
      maximumAge: 0,
      ...options,
    });
  });
}

/**
 * Subscribes to position updates (GPS / Wi‑Fi). Call the returned function to stop.
 * Throttle reverse-geocoding in the caller — Nominatim allows ~1 req/sec.
 */
export function watchPosition(
  onSuccess: (position: GeolocationPosition) => void,
  onError: (error: GeolocationPositionError) => void,
  options?: PositionOptions,
): () => void {
  if (!isGeolocationSupported()) {
    return () => {};
  }
  const id = navigator.geolocation.watchPosition(onSuccess, onError, {
    enableHighAccuracy: true,
    maximumAge: 10_000,
    ...options,
  });
  return () => navigator.geolocation.clearWatch(id);
}

/** Great-circle distance in meters (WGS84 sphere). */
export function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6_371_000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * R * Math.asin(Math.sqrt(Math.min(1, x)));
}

export function positionErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return "Location permission denied. Allow access in your browser settings, or type an area below.";
    case 2:
      return "Position unavailable. Try again outdoors or check device location settings.";
    case 3:
      return "Location request timed out. Try again.";
    default:
      return "Could not read your location.";
  }
}
