"use client";

import { useEffect, useState } from "react";
import { CLAIM_BAN_UNTIL_KEY } from "@/lib/claim-storage";

export function ClaimBanModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (!open) return;
    const tick = () => {
      try {
        const raw = sessionStorage.getItem(CLAIM_BAN_UNTIL_KEY);
        const t = raw ? parseInt(raw, 10) : 0;
        setLeft(Math.max(0, t - Date.now()));
      } catch {
        setLeft(0);
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [open]);

  if (!open) return null;

  const m = Math.floor(left / 60000);
  const s = Math.floor((left % 60000) / 1000);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
        aria-label="Dismiss"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ban-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-amber-200 bg-white p-6 shadow-2xl"
      >
        <h2
          id="ban-title"
          className="font-display text-xl font-bold text-zinc-900"
        >
          Claiming paused
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-700">
          PlanDrop limits repeated claim-and-release so people can&apos;t use
          live slots to scout venues without going. After a few releases, we
          pause new claims briefly to keep the drop fair for everyone.
        </p>
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-center font-mono text-lg font-bold tabular-nums text-amber-950">
          {left <= 0 ? "0:00" : `${m}:${s.toString().padStart(2, "0")}`}
        </p>
        <p className="mt-2 text-center text-xs text-zinc-500">
          You can claim again when the timer hits zero.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
        >
          OK
        </button>
      </div>
    </div>
  );
}
