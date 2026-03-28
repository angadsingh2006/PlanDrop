"use client";

import { useEffect, useState } from "react";

/**
 * Demo “live viewers” tick for browse cards: small random walk from a seed so
 * numbers feel active without a backend.
 */
export function useLiveViewingCount(
  planId: string,
  seed: number | undefined,
): number | null {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (seed == null || !Number.isFinite(seed)) {
      setValue(null);
      return;
    }
    const base = Math.max(1, Math.min(98, Math.round(seed)));
    setValue(base);
    const id = window.setInterval(() => {
      setValue((prev) => {
        const cur = prev ?? base;
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(1, Math.min(99, cur + delta));
      });
    }, 2000 + Math.floor(Math.random() * 1500));
    return () => clearInterval(id);
  }, [planId, seed]);

  return value;
}
