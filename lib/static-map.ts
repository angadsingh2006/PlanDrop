import type { Plan } from "@/lib/plans-data";

/** Returns `/api/static-map?...` for a square map image, or null if we cannot place a pin. */
export function buildStaticMapImageSrc(plan: Plan): string | null {
  const lat = plan.placeLat;
  const lng = plan.placeLng;
  if (
    lat != null &&
    lng != null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  ) {
    return `/api/static-map?lat=${encodeURIComponent(String(lat))}&lng=${encodeURIComponent(String(lng))}`;
  }
  const addr = plan.formattedAddress?.trim();
  if (addr) {
    return `/api/static-map?address=${encodeURIComponent(addr)}`;
  }
  return null;
}
