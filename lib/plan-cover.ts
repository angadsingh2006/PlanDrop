import type { Plan } from "@/lib/plans-data";

/** Disambiguates Next/Image and CDN caches so each card stays tied to its plan. */
function placePhotoSrc(planId: string, ref: string): string {
  const r = ref.trim();
  return `/api/place-photo?ref=${encodeURIComponent(r)}&pid=${encodeURIComponent(planId)}`;
}

/** Resolved image URL for plan cards (local asset or Places photo proxy). */
export function planCoverImageUrl(plan: Plan): string {
  const ref =
    plan.placePhotoRefs?.find((r) => r?.trim())?.trim() ??
    plan.placePhotoRef?.trim();
  if (ref) {
    return placePhotoSrc(plan.id, ref);
  }
  return plan.coverImageSrc;
}

/** All images to show on the plan briefing (Places refs, then local fallbacks). */
export function planGalleryImageUrls(plan: Plan): { src: string; alt: string }[] {
  const out: { src: string; alt: string }[] = [];
  const seen = new Set<string>();
  const push = (src: string, alt: string) => {
    const k = src.trim();
    if (!k || seen.has(k)) return;
    seen.add(k);
    out.push({ src: k, alt });
  };

  const refs = plan.placePhotoRefs?.filter((r) => r?.trim()) ?? [];
  if (refs.length > 0) {
    refs.forEach((ref, i) => {
      push(
        placePhotoSrc(plan.id, ref),
        i === 0 ? plan.coverImageAlt : `${plan.coverImageAlt} (${i + 1})`,
      );
    });
  } else if (plan.placePhotoRef?.trim()) {
    push(placePhotoSrc(plan.id, plan.placePhotoRef), plan.coverImageAlt);
  }

  const locals = plan.galleryImageSrcs?.filter((s) => s?.trim()) ?? [];
  locals.forEach((src) => {
    const idx = out.length;
    push(
      src.trim(),
      idx === 0 ? plan.coverImageAlt : `${plan.coverImageAlt} (${idx + 1})`,
    );
  });

  if (out.length === 0) {
    push(plan.coverImageSrc, plan.coverImageAlt);
  }
  return out;
}
