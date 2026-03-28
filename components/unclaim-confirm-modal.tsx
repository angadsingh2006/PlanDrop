"use client";

export function UnclaimConfirmModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
        aria-label="Dismiss"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="unclaim-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl"
      >
        <h2
          id="unclaim-title"
          className="font-display text-xl font-bold text-zinc-900"
        >
          Release this plan?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-700">
          Your lock is cleared and this spot goes back to the live pool so
          someone else can claim it. Don&apos;t claim and release over and over
          just to browse venues — repeated releases can briefly pause new claims
          for your session.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 sm:w-auto sm:min-w-[140px]"
          >
            No, keep my plan
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 sm:w-auto sm:min-w-[200px]"
          >
            Yes, release it
          </button>
        </div>
      </div>
    </div>
  );
}
