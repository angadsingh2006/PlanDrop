import { PLANS } from "@/lib/plans-data";

function parseDurationHours(duration: string): number {
  const m = duration.trim().match(/(\d+(?:\.\d+)?)\s*hrs?/i);
  if (!m) return 0;
  return Number.parseFloat(m[1]!);
}

function cityFromPhotoCredit(photoCredit: string): string {
  const parts = photoCredit.split(/\s*[-·•]\s*/);
  const last = parts[parts.length - 1]?.trim();
  return last && last.length > 0 ? last : "Unknown";
}

/** Stats derived from the live catalog — updates when `PLANS` changes. */
export function getHomepageStats() {
  const plans = PLANS;
  const plansLiveToday = plans.length;
  const cities = new Set(plans.map((p) => cityFromPhotoCredit(p.photoCredit)));
  const citiesDropping = plans.length === 0 ? 0 : cities.size;

  const hours = plans.map((p) => parseDurationHours(p.duration)).filter((h) => h > 0);
  const avgHours =
    hours.length > 0
      ? hours.reduce((a, b) => a + b, 0) / hours.length
      : 2.5;
  const rounded = Math.round(avgHours * 10) / 10;
  const avgPlanLength =
    rounded % 1 === 0 ? `~${rounded} hr` : `~${rounded.toFixed(1)} hr`;

  return {
    plansLiveToday,
    citiesDropping,
    avgPlanLength,
  };
}
