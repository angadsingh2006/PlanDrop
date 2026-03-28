import type { Plan } from "@/lib/plans-data";

/** Strips duplicate address lines from AI bullets when `formattedAddress` is set separately. */
export function activityBulletsForDisplay(plan: Plan): string[] {
  const fa = plan.formattedAddress?.trim().toLowerCase();
  return plan.locationDetails.filter((line) => {
    const t = line.trim().toLowerCase();
    if (!fa) return true;
    if (t === fa) return false;
    if (t.length > 10 && fa.includes(t)) return false;
    if (fa.length > 14 && t.includes(fa.slice(0, 14))) return false;
    return true;
  });
}
