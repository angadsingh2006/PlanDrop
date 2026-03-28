import type { Plan } from "@/lib/plans-data";

/**
 * Browser key for Maps Embed API (iframe). Use NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in `.env.local`.
 * Same GCP key as Places works if Maps Embed API is enabled on the project.
 */
export function getGoogleMapsBrowserKey(): string | undefined {
  const a = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (a) return a;
  const b = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY?.trim();
  if (b) return b;
  return undefined;
}

function buildEmbedPlaceUrl(apiKey: string, q: string): string {
  const params = new URLSearchParams({
    key: apiKey,
    q,
    zoom: "16",
    maptype: "roadmap",
  });
  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
}

/**
 * Google Maps Embed API (Place mode) — interactive map with real Google UI.
 * @see https://developers.google.com/maps/documentation/embed/embedding-guide
 */
export function buildGoogleMapsEmbedSrc(plan: Plan, apiKey: string): string | null {
  const pid = plan.placeId?.trim();
  if (pid) {
    return buildEmbedPlaceUrl(apiKey, `place_id:${pid}`);
  }
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
    return buildEmbedPlaceUrl(apiKey, `${lat},${lng}`);
  }
  const addr = plan.formattedAddress?.trim();
  if (addr) {
    return buildEmbedPlaceUrl(apiKey, addr);
  }
  const fallback = plan.stop.split(/[—–]/)[0]?.trim() || plan.title;
  if (fallback) {
    return buildEmbedPlaceUrl(apiKey, fallback);
  }
  return null;
}
