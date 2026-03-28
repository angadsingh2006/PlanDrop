import type { Plan } from "@/lib/plans-data";

/** Compact share payload for AI / session-only plans (URL-safe base64). */
export function planToSnapshot(plan: Plan): string {
  const json = JSON.stringify(plan);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function snapshotToPlan(s: string): Plan | null {
  try {
    const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    const p = JSON.parse(json) as Plan;
    if (typeof p.id !== "string" || typeof p.title !== "string") return null;
    return p;
  } catch {
    return null;
  }
}
