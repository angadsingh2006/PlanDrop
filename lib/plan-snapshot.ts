import LZString from "lz-string";
import type { Plan } from "@/lib/plans-data";

function isValidPlanShape(p: unknown): p is Plan {
  return (
    p != null &&
    typeof p === "object" &&
    typeof (p as Plan).id === "string" &&
    typeof (p as Plan).title === "string"
  );
}

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
    const p = JSON.parse(json) as unknown;
    return isValidPlanShape(p) ? p : null;
  } catch {
    return null;
  }
}

/** Shorter than raw base64 snapshot — use query param `z` for shared links. */
export function planToCompressedSnapshot(plan: Plan): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(plan));
}

export function compressedSnapshotToPlan(s: string): Plan | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(s);
    if (!json) return null;
    const p = JSON.parse(json) as unknown;
    return isValidPlanShape(p) ? p : null;
  } catch {
    return null;
  }
}

/** Decode plan from URL: prefers `z` (compressed), then legacy `snapshot` (base64). */
export function planFromUrlPayload(
  snapshot: string | null | undefined,
  z: string | null | undefined,
): Plan | null {
  if (z?.trim()) {
    const fromZ = compressedSnapshotToPlan(z.trim());
    if (fromZ) return fromZ;
  }
  if (snapshot?.trim()) {
    return snapshotToPlan(snapshot.trim());
  }
  return null;
}
