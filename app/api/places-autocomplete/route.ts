import { NextRequest, NextResponse } from "next/server";

type GooglePrediction = {
  description?: string;
  place_id?: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

/**
 * Proxies Google Places Autocomplete (legacy JSON) so the browser key is not required
 * for suggestions. Uses GOOGLE_PLACES_API_KEY (Places API + Autocomplete enabled).
 */
export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("input")?.trim() ?? "";
  const sessiontoken = req.nextUrl.searchParams.get("sessiontoken")?.trim() ?? "";

  if (input.length < 2) {
    return NextResponse.json({ predictions: [] });
  }
  if (input.length > 256) {
    return NextResponse.json({ error: "input too long" }, { status: 400 });
  }

  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!key) {
    return NextResponse.json({ predictions: [], unavailable: true });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", input);
  url.searchParams.set("key", key);
  url.searchParams.set("language", "en");
  if (sessiontoken) {
    url.searchParams.set("sessiontoken", sessiontoken);
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ predictions: [] });
  }

  const data = (await res.json()) as {
    status: string;
    error_message?: string;
    predictions?: GooglePrediction[];
  };

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    if (data.status !== "INVALID_REQUEST") {
      console.warn("Places autocomplete:", data.status, data.error_message);
    }
    return NextResponse.json({ predictions: [] });
  }

  const predictions = (data.predictions ?? []).map((p) => ({
    description: p.description ?? "",
    placeId: p.place_id ?? "",
    mainText: p.structured_formatting?.main_text ?? p.description ?? "",
    secondaryText: p.structured_formatting?.secondary_text ?? "",
  }));

  return NextResponse.json({ predictions });
}
