"use client";

import { Location01Icon, MapsIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  buildPlansHref,
  setSkipDropFromLocation,
  setStoredArea,
  setStoredPin,
  type StoredPin,
} from "@/lib/claim-storage";
import {
  getCurrentPosition,
  isGeolocationSupported,
  positionErrorMessage,
} from "@/lib/geolocation-client";
import { HugeIcon } from "@/components/ui/huge-icon";

async function reverseGeocodeLabel(lat: number, lng: number): Promise<string> {
  const res = await fetch(
    `/api/reverse-geocode?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lng))}`,
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Could not resolve address");
  }
  const data = (await res.json()) as { label: string };
  return data.label;
}

export function HeroLocationSearch() {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function goToPlans(area: string) {
    const trimmed = area.trim();
    if (!trimmed) {
      setError("Enter a city, ZIP code, or use your current location.");
      return;
    }
    setSkipDropFromLocation();
    setStoredArea(trimmed);
    router.push(buildPlansHref(trimmed));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    goToPlans(zip);
  }

  async function requestDeviceLocation() {
    if (!isGeolocationSupported()) {
      setError(
        "Location isn’t available in this browser. Enter a city or ZIP instead.",
      );
      return;
    }
    setError(null);
    setLocLoading(true);
    try {
      setSkipDropFromLocation();
      const pos = await getCurrentPosition();
      const { latitude: lat, longitude: lng, accuracy } = pos.coords;
      const pin: StoredPin = {
        lat,
        lng,
        accuracyM: Number.isFinite(accuracy) ? accuracy : undefined,
        at: Date.now(),
      };
      setStoredPin(pin);

      try {
        const label = await reverseGeocodeLabel(lat, lng);
        setStoredArea(label);
        setZip(label);
        router.push(buildPlansHref(label));
      } catch {
        const fallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setStoredArea(fallback);
        setZip(fallback);
        router.push(buildPlansHref(fallback));
      }
    } catch (e) {
      const code =
        e && typeof e === "object" && "code" in e
          ? Number((e as GeolocationPositionError).code)
          : 0;
      setError(positionErrorMessage(code));
    } finally {
      setLocLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-xl sm:mt-10">
      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-zinc-200/80 bg-white p-1.5 shadow-md shadow-zinc-200/40 ring-1 ring-zinc-100/90"
        role="search"
        aria-label="Find plans by location"
      >
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-0">
          <label className="group flex min-h-[42px] flex-1 cursor-text items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition hover:bg-zinc-50/80 sm:min-h-[44px] sm:px-3">
            <span className="text-zinc-400" aria-hidden>
              <HugeIcon icon={Location01Icon} size={18} strokeWidth={1.5} />
            </span>
            <span className="sr-only">City or ZIP code</span>
            <input
              type="text"
              name="zip"
              autoComplete="address-level2"
              placeholder="City or ZIP code"
              value={zip}
              onChange={(e) => {
                setZip(e.target.value);
                setError(null);
              }}
              className="min-w-0 flex-1 border-0 bg-transparent py-1.5 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 sm:text-[15px]"
            />
          </label>

          <div className="hidden h-7 w-px shrink-0 self-center bg-zinc-200/90 sm:block" aria-hidden />

          <div className="flex shrink-0 gap-1.5 sm:pl-1">
            <button
              type="button"
              onClick={() => void requestDeviceLocation()}
              disabled={locLoading}
              aria-busy={locLoading}
              className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200/90 bg-zinc-50/90 px-3 text-xs font-semibold text-zinc-700 transition hover:border-brand/25 hover:bg-brand-soft/50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-[40px] sm:flex-none sm:px-3.5 sm:text-[13px]"
            >
              <HugeIcon icon={MapsIcon} size={16} strokeWidth={1.5} aria-hidden />
              {locLoading ? "Locating…" : "Use my location"}
            </button>
            <button
              type="submit"
              className="inline-flex min-h-[40px] min-w-[5.5rem] items-center justify-center rounded-lg bg-brand px-4 text-xs font-bold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-hover sm:min-h-[40px] sm:px-5 sm:text-[13px]"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {error ? (
        <p className="mt-3 text-center text-sm font-medium text-amber-800" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-3 text-center text-sm text-zinc-500">
          We’ll show plans near you — no account needed.
        </p>
      )}

      <p className="mt-4 text-center text-sm text-zinc-500">
        <Link
          href="/drop?edit=1"
          className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
        >
          Full setup
        </Link>{" "}
        <span className="text-zinc-400">·</span>{" "}
        <Link
          href="/plans"
          className="font-semibold text-zinc-600 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900"
        >
          Browse all (demo)
        </Link>
      </p>
    </div>
  );
}
