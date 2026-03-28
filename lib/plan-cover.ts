import type { Plan } from "@/lib/plans-data";

/** Resolved image URL for plan cards (local asset or Places photo proxy). */
export function planCoverImageUrl(plan: Plan): string {
  const ref =
    plan.placePhotoRefs?.find((r) => r?.trim())?.trim() ??
    plan.placePhotoRef?.trim();
  if (ref) {
    return `/api/place-photo?ref=${encodeURIComponent(ref)}`;
  }
  return plan.coverImageSrc;
}

/** All images to show on the plan briefing (Places refs, then local fallbacks). */
export function planGalleryImageUrls(plan: Plan): { src: string; alt: string }[] {
  const refs = plan.placePhotoRefs?.filter((r) => r?.trim()) ?? [];
  if (refs.length > 0) {
    return refs.map((ref, i) => ({
      src: `/api/place-photo?ref=${encodeURIComponent(ref.trim())}`,
      alt: i === 0 ? plan.coverImageAlt : `${plan.coverImageAlt} (${i + 1})`,
    }));
  }
  if (plan.placePhotoRef?.trim()) {
    return [
      {
        src: `/api/place-photo?ref=${encodeURIComponent(plan.placePhotoRef.trim())}`,
        alt: plan.coverImageAlt,
      },
    ];
  }
  const locals = plan.galleryImageSrcs?.filter((s) => s?.trim()) ?? [];
  if (locals.length > 0) {
    return locals.map((src, i) => ({
      src: src.trim(),
      alt: i === 0 ? plan.coverImageAlt : `${plan.coverImageAlt} (${i + 1})`,
    }));
  }
  return [{ src: plan.coverImageSrc, alt: plan.coverImageAlt }];
}

/** Count of gallery images (for badges). */
export function planPhotoCount(plan: Plan): number {
  if (plan.placePhotoRefs?.length) return plan.placePhotoRefs.length;
  if (plan.placePhotoRef?.trim()) return 1;
  if (plan.galleryImageSrcs?.length) return plan.galleryImageSrcs.length;
  return 1;
}
