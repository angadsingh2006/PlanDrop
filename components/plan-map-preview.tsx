"use client";

import Link from "next/link";
import { buildGoogleMapsEmbedSrc, getGoogleMapsBrowserKey } from "@/lib/map-embed";
import { buildGoogleMapsHref } from "@/lib/maps-links";
import { buildStaticMapImageSrc } from "@/lib/static-map";
import type { Plan } from "@/lib/plans-data";

/** True when the component will render an embed or static map (not null). */
export function canShowPlanMapPreview(plan: Plan): boolean {
  const key = getGoogleMapsBrowserKey();
  if (key) {
    const embed = buildGoogleMapsEmbedSrc(plan, key);
    if (embed) return true;
  }
  return buildStaticMapImageSrc(plan) != null;
}

type PlanMapPreviewProps = {
  plan: Plan;
  className?: string;
  /** Static-image fallback shape when no embed key (modal vs /go page). */
  variant?: "modal" | "go";
};

const mapFrameClass = (variant: "modal" | "go") =>
  variant === "modal"
    ? "aspect-[21/10] min-h-[200px] sm:min-h-[240px]"
    : "aspect-[16/10] min-h-[180px]";

/**
 * Interactive Google Map (Embed API) when a browser key is set.
 * Layers `/api/static-map` under the iframe so map tiles show while the embed loads.
 */
export function PlanMapPreview({
  plan,
  className = "",
  variant = "modal",
}: PlanMapPreviewProps) {
  const browserKey = getGoogleMapsBrowserKey();
  const embedSrc = browserKey ? buildGoogleMapsEmbedSrc(plan, browserKey) : null;
  const staticSrc = buildStaticMapImageSrc(plan);
  const mapsHref = buildGoogleMapsHref(plan);

  if (embedSrc) {
    return (
      <div
        className={`overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-100 ${variant === "go" ? "max-w-sm" : ""} ${className}`}
      >
        <div className="border-b border-zinc-100 bg-zinc-50/90 px-3 py-2.5">
          <p className="text-sm font-medium leading-snug text-zinc-900">
            <span className="mr-2 text-zinc-400" aria-hidden>
              ♠
            </span>
            Venue: {plan.title}
          </p>
          {plan.formattedAddress ? (
            <p className="mt-1.5 text-[11px] leading-snug text-zinc-600">
              {plan.formattedAddress}
            </p>
          ) : null}
        </div>
        <div className={`relative w-full bg-zinc-100 ${mapFrameClass(variant)}`}>
          {staticSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- same-origin proxy
            <img
              src={staticSrc}
              alt=""
              aria-hidden
              className="absolute inset-0 z-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="absolute inset-0 z-0 bg-zinc-100" aria-hidden />
          )}
          <iframe
            title={`Map of ${plan.title}`}
            src={embedSrc}
            className="absolute inset-0 z-10 h-full w-full border-0 bg-transparent"
            loading="eager"
            allowFullScreen
            allow="clipboard-write; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <Link
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="block border-t border-zinc-100 bg-white px-2 py-2 text-center text-[9px] font-semibold uppercase tracking-wide text-brand transition hover:bg-zinc-50"
        >
          Open in Maps
        </Link>
      </div>
    );
  }

  if (staticSrc) {
    const staticBox =
      variant === "go"
        ? "relative aspect-square w-full max-w-[280px] bg-zinc-100"
        : "relative aspect-[5/3] w-full overflow-hidden rounded-t-lg bg-zinc-200";
    return (
      <Link
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-100 transition hover:ring-brand/30 ${variant === "go" ? "max-w-sm" : ""} ${className}`}
      >
        <span className={staticBox}>
          {/* eslint-disable-next-line @next/next/no-img-element -- proxy returns PNG/SVG */}
          <img
            src={staticSrc}
            alt={`Map preview near ${plan.title}`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </span>
        <span
          className={`block text-center font-semibold text-brand ${variant === "go" ? "px-3 py-2 text-xs" : "px-2 py-1.5 text-[9px] uppercase tracking-wide"}`}
        >
          {variant === "go" ? "Open in Google Maps" : "Open in Maps"}
        </span>
      </Link>
    );
  }

  return null;
}
