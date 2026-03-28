import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_ADDRESS_LEN = 280;

const FETCH_USER_AGENT = "PlanDrop/1.0 (static map preview; +https://plandrop.app)";

/**
 * Google API keys restricted to "HTTP referrers" still expect a Referer on server-side
 * requests; without it, Static Maps / Geocoding can return REQUEST_DENIED.
 */
function googleMapsReferer(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    try {
      const withSlash = explicit.endsWith("/") ? explicit : `${explicit}/`;
      return new URL(withSlash).origin + "/";
    } catch {
      /* fall through */
    }
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const base = vercel.startsWith("http") ? vercel : `https://${vercel}`;
    try {
      return new URL(base.endsWith("/") ? base : `${base}/`).origin + "/";
    } catch {
      /* fall through */
    }
  }
  return "http://localhost:3000/";
}

function googleFetchInit(): RequestInit {
  return {
    headers: {
      Referer: googleMapsReferer(),
    },
  };
}

async function geocodeAddress(
  address: string,
  key: string,
): Promise<{ lat: number; lng: number } | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${encodeURIComponent(key)}`;
  const res = await fetch(url, googleFetchInit());
  if (!res.ok) return null;
  const data = (await res.json()) as {
    status: string;
    results?: { geometry: { location: { lat: number; lng: number } } }[];
  };
  if (data.status !== "OK" || !data.results?.[0]) return null;
  const loc = data.results[0].geometry.location;
  if (
    typeof loc.lat !== "number" ||
    typeof loc.lng !== "number" ||
    !Number.isFinite(loc.lat) ||
    !Number.isFinite(loc.lng)
  ) {
    return null;
  }
  return { lat: loc.lat, lng: loc.lng };
}

/** Free geocode when Google key is not configured (Nominatim usage policy: identify app). */
async function geocodeNominatim(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": FETCH_USER_AGENT,
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { lat?: string; lon?: string }[];
    const row = data[0];
    if (!row?.lat || !row?.lon) return null;
    const la = Number.parseFloat(row.lat);
    const ln = Number.parseFloat(row.lon);
    if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;
    if (Math.abs(la) > 90 || Math.abs(ln) > 180) return null;
    return { lat: la, lng: ln };
  } catch {
    return null;
  }
}

function staticMapUrl(lat: number, lng: number, key: string): string {
  const center = `${lat},${lng}`;
  const markers = encodeURIComponent(`color:0x2B53C1|${center}`);
  return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(center)}&zoom=16&size=512x512&scale=2&maptype=roadmap&markers=${markers}&key=${encodeURIComponent(key)}`;
}

/** Used when Google Static Maps is unavailable or no API key (billing, API not enabled, etc.). */
function openStreetMapPreviewUrl(lat: number, lng: number): string {
  const center = `${lat},${lng}`;
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${encodeURIComponent(center)}&zoom=16&size=512x512&maptype=mapnik&markers=${lat},${lng},red-pushpin`;
}

function isImageContentType(ct: string): boolean {
  return /^image\//i.test(ct.trim());
}

function imageResponse(buf: ArrayBuffer, contentType: string): Response {
  return new Response(buf, {
    headers: {
      "Content-Type": contentType.includes("/") ? contentType : "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

async function fetchOpenStreetMapImage(
  lat: number,
  lng: number,
): Promise<{ buf: ArrayBuffer; contentType: string } | null> {
  try {
    const osmUrl = openStreetMapPreviewUrl(lat, lng);
    const imgRes = await fetch(osmUrl, {
      headers: {
        Accept: "image/*",
        "User-Agent": FETCH_USER_AGENT,
      },
    });
    const contentType = imgRes.headers.get("content-type") ?? "";
    if (!imgRes.ok || !isImageContentType(contentType)) return null;
    const buf = await imgRes.arrayBuffer();
    return { buf, contentType };
  } catch {
    return null;
  }
}

/** Last resort so the modal always shows a graphic (offline, DNS, or OSM down). */
function svgMapFallback(lat: number, lng: number): Response {
  const safeLat = lat.toFixed(5);
  const safeLng = lng.toFixed(5);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect fill="#fafafa" width="400" height="400"/>
  <rect fill="#e4e4e7" x="40" y="40" width="320" height="280" rx="12"/>
  <circle cx="200" cy="150" r="10" fill="#2B53C1"/>
  <path d="M200 160 L200 230" stroke="#2B53C1" stroke-width="4" fill="none" stroke-linecap="round"/>
  <text x="200" y="300" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="14" fill="#3f3f46">${safeLat}, ${safeLng}</text>
  <text x="200" y="328" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" fill="#71717a">Open in Maps for full map</text>
</svg>`;
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Proxies map tiles so the browser never sees the Google API key.
 * GET /api/static-map?lat=..&lng=..  OR  ?address=..
 *
 * Without GOOGLE_PLACES_API_KEY: uses OSM for imagery and Nominatim for address → coords.
 * With key: tries Google Static Maps first, then OSM fallback.
 */
export async function GET(req: Request) {
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();

  const { searchParams } = new URL(req.url);
  const latRaw = searchParams.get("lat");
  const lngRaw = searchParams.get("lng");
  const address = searchParams.get("address")?.trim() ?? "";

  let lat: number | undefined;
  let lng: number | undefined;

  if (latRaw != null && lngRaw != null) {
    lat = Number.parseFloat(latRaw);
    lng = Number.parseFloat(lngRaw);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "Bad coordinates" }, { status: 400 });
    }
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return NextResponse.json({ error: "Out of range" }, { status: 400 });
    }
  } else if (address.length > 0 && address.length <= MAX_ADDRESS_LEN) {
    const g = key
      ? await geocodeAddress(address, key)
      : await geocodeNominatim(address);
    if (!g) {
      return NextResponse.json({ error: "Could not geocode address" }, { status: 404 });
    }
    lat = g.lat;
    lng = g.lng;
  } else {
    return NextResponse.json(
      { error: "Provide lat & lng, or address" },
      { status: 400 },
    );
  }

  const latN = lat!;
  const lngN = lng!;

  if (key) {
    try {
      const mapUrl = staticMapUrl(latN, lngN, key);
      const imgRes = await fetch(mapUrl, googleFetchInit());
      const contentType = imgRes.headers.get("content-type") ?? "";
      if (
        imgRes.ok &&
        isImageContentType(contentType) &&
        !contentType.includes("json")
      ) {
        const buf = await imgRes.arrayBuffer();
        return imageResponse(buf, contentType);
      }
    } catch {
      /* fall through to OSM / SVG */
    }
  }

  const osm = await fetchOpenStreetMapImage(latN, lngN);
  if (osm) {
    return imageResponse(osm.buf, osm.contentType);
  }

  return svgMapFallback(latN, lngN);
}
