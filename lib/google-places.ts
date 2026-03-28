/**
 * Google Places (legacy) Text Search + photo enrichment.
 * Requires GOOGLE_PLACES_API_KEY and Places API enabled on the GCP project.
 */

export type EnrichedPlace = {
  name: string;
  formattedAddress: string;
  placeId?: string;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  photoRef?: string;
  /** Distinct photo references from the top result (for galleries). */
  photoRefs?: string[];
};

export type PlaceDetailsEnrichment = {
  mapsUrl?: string;
  lat?: number;
  lng?: number;
  formattedAddress?: string;
  openingHoursLine?: string;
  weekdayText?: string[];
  /** Extra photo refs from Place Details (merged with Text Search for larger galleries). */
  photoReferences?: string[];
};

/** Monday-first index (Google weekday_text order for en-US). */
function mondayFirstIndexFromJsDay(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

function formatOpeningSummary(
  weekdayText: string[] | undefined,
  openNow: boolean | undefined,
): string | undefined {
  if (!weekdayText?.length) return undefined;
  const idx = mondayFirstIndexFromJsDay(new Date().getDay());
  const todayLine = weekdayText[idx] ?? weekdayText[0];
  if (!todayLine) return undefined;
  const hoursPart = todayLine.replace(/^[^:]+:\s*/, "").trim();
  if (!hoursPart) return undefined;
  if (openNow === true) return `Open now · ${hoursPart}`;
  if (openNow === false) return `Closed now · ${hoursPart}`;
  return `Today · ${hoursPart}`;
}

/**
 * Place Details — hours, geometry, Maps URL. Uses same API key as Text Search.
 */
export async function getPlaceDetails(
  placeId: string,
): Promise<PlaceDetailsEnrichment | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key?.trim() || !placeId.trim()) return null;

  const fields = [
    "place_id",
    "url",
    "geometry",
    "formatted_address",
    "opening_hours",
    "photos",
  ].join(",");

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId.trim())}&fields=${encodeURIComponent(fields)}&key=${encodeURIComponent(key)}`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as {
    status: string;
    error_message?: string;
    result?: {
      url?: string;
      formatted_address?: string;
      geometry?: { location: { lat: number; lng: number } };
      opening_hours?: {
        open_now?: boolean;
        weekday_text?: string[];
      };
      photos?: { photo_reference: string }[];
    };
  };

  if (data.status !== "OK" || !data.result) {
    if (data.status !== "NOT_FOUND") {
      console.warn("Place details:", data.status, data.error_message);
    }
    return null;
  }

  const r = data.result;
  const lat = r.geometry?.location?.lat;
  const lng = r.geometry?.location?.lng;
  const wh = r.opening_hours;

  const openingHoursLine = formatOpeningSummary(
    wh?.weekday_text,
    wh?.open_now,
  );

  const photoReferences = (r.photos ?? [])
    .map((p) => p.photo_reference)
    .filter((x): x is string => Boolean(x))
    .filter((x, i, a) => a.indexOf(x) === i)
    .slice(0, 10);

  return {
    mapsUrl: r.url?.trim(),
    lat: typeof lat === "number" && Number.isFinite(lat) ? lat : undefined,
    lng: typeof lng === "number" && Number.isFinite(lng) ? lng : undefined,
    formattedAddress: r.formatted_address?.trim(),
    openingHoursLine,
    weekdayText: wh?.weekday_text,
    photoReferences:
      photoReferences.length > 0 ? photoReferences : undefined,
  };
}

/** Single-line price like the catalog cards (~$42/pp). Maps tier is used server-side for search only. */
export function formatPriceFromMaps(
  _level: number | undefined,
  aiFallback?: string,
): string {
  void _level;
  const t = aiFallback?.trim();
  return t && t.length > 0 ? t : "~$35/pp";
}

export async function findPlaceByText(
  query: string,
  opts?: { lat?: number; lng?: number; radiusM?: number },
): Promise<EnrichedPlace | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key?.trim()) return null;

  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${encodeURIComponent(key)}`;
  if (
    opts?.lat != null &&
    opts?.lng != null &&
    Number.isFinite(opts.lat) &&
    Number.isFinite(opts.lng)
  ) {
    url += `&location=${opts.lat},${opts.lng}&radius=${opts.radiusM ?? 50000}`;
  }

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as {
    status: string;
    error_message?: string;
    results?: Array<{
      place_id: string;
      name: string;
      formatted_address: string;
      rating?: number;
      user_ratings_total?: number;
      price_level?: number;
      photos?: { photo_reference: string }[];
    }>;
  };

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    console.warn("Places text search:", data.status, data.error_message);
    return null;
  }

  const r = data.results?.[0];
  if (!r) return null;

  const photoRefs = (r.photos ?? [])
    .map((p) => p.photo_reference)
    .filter((x): x is string => Boolean(x))
    .filter((x, i, a) => a.indexOf(x) === i)
    .slice(0, 10);

  return {
    name: r.name,
    formattedAddress: r.formatted_address,
    placeId: r.place_id,
    rating: r.rating,
    userRatingsTotal: r.user_ratings_total,
    priceLevel: r.price_level,
    photoRef: photoRefs[0],
    photoRefs: photoRefs.length > 0 ? photoRefs : undefined,
  };
}

/** Take text after last em dash as the time / window phrase. */
export function timeFromStop(stop: string): string {
  const parts = stop.split(/[—–]/);
  if (parts.length > 1) {
    return parts[parts.length - 1]!.trim();
  }
  return stop.trim();
}
