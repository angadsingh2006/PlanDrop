import { NextRequest, NextResponse } from "next/server";

/** Proxy to Nominatim (OSM) — see https://operations.osmfoundation.org/policies/nominatim/ */

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  neighbourhood?: string;
  state?: string;
  county?: string;
  country?: string;
};

type NominatimReverse = {
  display_name?: string;
  address?: NominatimAddress;
};

function shortLabel(data: NominatimReverse): string {
  const a = data.address;
  if (!a) {
    const d = data.display_name ?? "";
    return d.split(",").slice(0, 3).join(",").trim() || "Unknown area";
  }
  const place =
    a.neighbourhood ??
    a.suburb ??
    a.city ??
    a.town ??
    a.village ??
    a.county;
  const region = a.state ?? a.country;
  if (place && region) return `${place}, ${region}`;
  if (place) return place;
  return data.display_name?.split(",").slice(0, 2).join(",").trim() ?? "Unknown area";
}

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");
  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon required" }, { status: 400 });
  }

  const latN = Number(lat);
  const lonN = Number(lon);
  if (!Number.isFinite(latN) || !Number.isFinite(lonN)) {
    return NextResponse.json({ error: "invalid coordinates" }, { status: 400 });
  }
  if (latN < -90 || latN > 90 || lonN < -180 || lonN > 180) {
    return NextResponse.json({ error: "coordinates out of range" }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(latN));
  url.searchParams.set("lon", String(lonN));
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Accept-Language": "en",
      "User-Agent": "PlanDrop/1.0 (https://github.com/plandrop)",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "geocoding failed" },
      { status: res.status === 429 ? 429 : 502 },
    );
  }

  const data = (await res.json()) as NominatimReverse;
  const label = shortLabel(data);

  return NextResponse.json({
    label,
    displayName: data.display_name ?? label,
  });
}
