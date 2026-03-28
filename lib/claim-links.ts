import type { Plan } from "@/lib/plans-data";
import { planToCompressedSnapshot } from "@/lib/plan-snapshot";
import { clampRadiusMiles } from "@/lib/search-radius";

export function isAiPlanId(planId: string): boolean {
  return planId.startsWith("ai-");
}

function appendRadius(q: URLSearchParams, radiusMiles?: number | null) {
  if (radiusMiles != null && Number.isFinite(radiusMiles)) {
    q.set("radius", String(clampRadiusMiles(radiusMiles)));
  }
}

/** In-app navigation: short URLs (no snapshot); AI plans use session storage. */
export function buildClaimHref(
  plan: Plan,
  area: string | null | undefined,
  radiusMiles?: number | null,
): string {
  const q = new URLSearchParams();
  const a = area?.trim();
  if (a) q.set("area", a);
  appendRadius(q, radiusMiles);
  const qs = q.toString();
  return qs ? `/claim/${plan.id}?${qs}` : `/claim/${plan.id}`;
}

export function buildGoHref(
  plan: Plan,
  area: string | null | undefined,
  radiusMiles?: number | null,
): string {
  const q = new URLSearchParams();
  const a = area?.trim();
  if (a) q.set("area", a);
  appendRadius(q, radiusMiles);
  const qs = q.toString();
  return qs ? `/go/${plan.id}?${qs}` : `/go/${plan.id}`;
}

/**
 * Share / copy link: compressed `z` for ai-* (shorter than legacy base64 snapshot).
 */
export function buildGoShareQuery(
  plan: Plan,
  area: string | null | undefined,
  radiusMiles?: number | null,
): string {
  const q = new URLSearchParams();
  const a = area?.trim();
  if (a) q.set("area", a);
  appendRadius(q, radiusMiles);
  if (isAiPlanId(plan.id)) {
    q.set("z", planToCompressedSnapshot(plan));
  }
  return q.toString();
}

export function buildGoShareUrl(
  plan: Plan,
  area: string | null | undefined,
  origin: string,
  radiusMiles?: number | null,
): string {
  const qs = buildGoShareQuery(plan, area, radiusMiles);
  return qs ? `${origin}/go/${plan.id}?${qs}` : `${origin}/go/${plan.id}`;
}

export function buildClaimShareQuery(
  plan: Plan,
  area: string | null | undefined,
  radiusMiles?: number | null,
): string {
  const q = new URLSearchParams();
  const a = area?.trim();
  if (a) q.set("area", a);
  appendRadius(q, radiusMiles);
  if (isAiPlanId(plan.id)) {
    q.set("z", planToCompressedSnapshot(plan));
  }
  return q.toString();
}
