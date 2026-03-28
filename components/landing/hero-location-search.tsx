"use client";

import { Location01Icon, MapsIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
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

type PlacePrediction = {
  description: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
};

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

function newSessionToken(): string {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function HeroLocationSearch() {
  const router = useRouter();
  const listId = useId();
  const sessionRef = useRef(newSessionToken());
  const wrapRef = useRef<HTMLDivElement>(null);

  const [zip, setZip] = useState("");
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [listOpen, setListOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);

  const goToPlans = useCallback(
    (area: string) => {
      const trimmed = area.trim();
      if (!trimmed) {
        setError("Enter a city, ZIP code, or use your current location.");
        return;
      }
      setSkipDropFromLocation();
      setStoredArea(trimmed);
      router.push(buildPlansHref(trimmed));
    },
    [router],
  );

  const pickSuggestion = useCallback(
    (p: PlacePrediction) => {
      const label = p.description.trim();
      setSuggestions([]);
      setListOpen(false);
      setActiveIdx(-1);
      sessionRef.current = newSessionToken();
      setZip(label);
      setError(null);
      goToPlans(label);
    },
    [goToPlans],
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuggestions([]);
    setListOpen(false);
    sessionRef.current = newSessionToken();
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

  useEffect(() => {
    const q = zip.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setListOpen(false);
      setActiveIdx(-1);
      return;
    }

    const ac = new AbortController();
    const timer = window.setTimeout(async () => {
      setFetchingSuggestions(true);
      try {
        const st = sessionRef.current;
        const url = `/api/places-autocomplete?input=${encodeURIComponent(q)}&sessiontoken=${encodeURIComponent(st)}`;
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) {
          setSuggestions([]);
          return;
        }
        const data = (await res.json()) as { predictions?: PlacePrediction[] };
        const next = data.predictions ?? [];
        setSuggestions(next);
        setListOpen(next.length > 0);
        setActiveIdx(-1);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setSuggestions([]);
        }
      } finally {
        setFetchingSuggestions(false);
      }
    }, 260);

    return () => {
      window.clearTimeout(timer);
      ac.abort();
    };
  }, [zip]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const el = wrapRef.current;
      if (!el?.contains(e.target as Node)) {
        setListOpen(false);
        setActiveIdx(-1);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!listOpen || suggestions.length === 0) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setListOpen(false);
      setActiveIdx(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % suggestions.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      return;
    }
    if (e.key === "Enter" && activeIdx >= 0 && activeIdx < suggestions.length) {
      e.preventDefault();
      pickSuggestion(suggestions[activeIdx]!);
    }
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-xl sm:mt-10">
      <div ref={wrapRef} className="relative">
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
                role="combobox"
                autoComplete="off"
                placeholder="City or ZIP code"
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value);
                  setError(null);
                }}
                onKeyDown={onInputKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) setListOpen(true);
                }}
                aria-expanded={listOpen}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-busy={fetchingSuggestions}
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

        {listOpen && suggestions.length > 0 ? (
          <ul
            id={listId}
            role="listbox"
            aria-label="Location suggestions"
            className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-auto rounded-xl border border-zinc-200/90 bg-white py-1 shadow-lg shadow-zinc-200/50 ring-1 ring-zinc-100/90"
          >
            {suggestions.map((p, i) => (
              <li key={p.placeId || `${p.description}-${i}`} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={i === activeIdx}
                  className={`flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left text-sm transition hover:bg-zinc-50 ${
                    i === activeIdx ? "bg-brand-soft/60" : ""
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => pickSuggestion(p)}
                >
                  <span className="font-semibold text-zinc-900">{p.mainText}</span>
                  {p.secondaryText ? (
                    <span className="text-xs text-zinc-500">{p.secondaryText}</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

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
