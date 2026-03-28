import type { Plan } from "@/lib/plans-data";

/** Opens in Google Maps (app on mobile when installed). */
export function buildGoogleMapsHref(plan: Plan): string {
  const direct = plan.mapsUrl?.trim();
  if (direct) return direct;

  const lat = plan.placeLat;
  const lng = plan.placeLng;
  if (
    lat != null &&
    lng != null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  const q =
    plan.formattedAddress?.trim() ||
    plan.stop.split(/[—–]/)[0]?.trim() ||
    plan.title;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
