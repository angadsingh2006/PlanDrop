"use client";

import { CheckmarkCircle02Icon, ZapIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SetupFlowStepper } from "@/components/setup-flow-stepper";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { HugeIcon } from "@/components/ui/huge-icon";
import { ClaimBanModal } from "@/components/claim-ban-modal";
import {
  buildPlansHref,
  getClaimedPlanId,
  getStoredAiPlan,
  getStoredArea,
  isClaimBanned,
  mergeAiPlanIntoStorage,
  setClaimedPlanId,
} from "@/lib/claim-storage";
import { buildGoHref } from "@/lib/claim-links";
import { planToSnapshot, snapshotToPlan } from "@/lib/plan-snapshot";
import type { Plan } from "@/lib/plans-data";
import { getPlanById } from "@/lib/plans-data";

export function ClaimPlanClient({
  planId,
  staticPlan,
  areaFromQuery,
  snapshotFromQuery,
}: {
  planId: string;
  staticPlan: Plan | null;
  areaFromQuery: string | null;
  snapshotFromQuery: string | null;
}) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(staticPlan);
  const [resolved, setResolved] = useState(!!staticPlan);
  const [claiming, setClaiming] = useState(false);
  const [existingClaim, setExistingClaim] = useState<string | null>(null);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [claimBlocked, setClaimBlocked] = useState(false);

  useEffect(() => {
    setExistingClaim(getClaimedPlanId());
  }, []);

  useEffect(() => {
    const tick = () => setClaimBlocked(isClaimBanned());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (staticPlan) {
      setPlan(staticPlan);
      setResolved(true);
      return;
    }
    const fromSnap = snapshotFromQuery ? snapshotToPlan(snapshotFromQuery) : null;
    if (fromSnap && fromSnap.id === planId) {
      setPlan(fromSnap);
      mergeAiPlanIntoStorage(fromSnap);
      setResolved(true);
      return;
    }
    const stored = getStoredAiPlan(planId);
    if (stored) {
      setPlan(stored);
      setResolved(true);
      return;
    }
    setResolved(true);
  }, [planId, staticPlan, snapshotFromQuery]);

  const area = areaFromQuery ?? getStoredArea() ?? "Atlanta, GA";
  const plansBack = buildPlansHref(area);

  const alreadyClaimedThis = existingClaim === planId;
  const alreadyClaimedOther =
    existingClaim != null && existingClaim !== planId;

  function handleClaim() {
    if (!plan?.available || alreadyClaimedOther || alreadyClaimedThis) return;
    if (isClaimBanned()) {
      setBanModalOpen(true);
      return;
    }
    setClaiming(true);
    window.setTimeout(() => {
      setClaimedPlanId(plan.id);
      setClaiming(false);
      const q = new URLSearchParams();
      if (area.trim()) q.set("area", area.trim());
      if (plan.id.startsWith("ai-")) q.set("snapshot", planToSnapshot(plan));
      const qs = q.toString();
      router.push(qs ? `/go/${plan.id}?${qs}` : `/go/${plan.id}`);
    }, 650);
  }

  if (!resolved) {
    return null;
  }

  if (!plan) {
    return (
      <>
        <SiteHeader />
        <main className="px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="font-display text-2xl font-bold text-zinc-900">
              Plan not found
            </h1>
            <p className="mt-3 text-zinc-600">
              Open this link from your browse session, or pick a plan again from
              the drop board.
            </p>
            <Link
              href={plansBack}
              className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white"
            >
              Back to browse
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <ClaimBanModal open={banModalOpen} onClose={() => setBanModalOpen(false)} />
      <SiteHeader />
      <SetupFlowStepper currentStep={3} planId={plan.id} areaHint={area} />
      <main className="px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8">
        <div className="mx-auto max-w-lg">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            Step 3 of 4
          </p>
          <h1 className="font-display mt-3 flex items-center gap-2 text-3xl font-bold leading-snug tracking-[-0.02em] text-zinc-900 sm:text-4xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <HugeIcon icon={ZapIcon} size={22} strokeWidth={1.5} />
            </span>
            Claim it fast
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Hit Claim. It&apos;s atomically locked to your group in real time — no
            double-bookings, ever. (Demo uses your browser session as the lock.)
          </p>

          {claimBlocked ? (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Claiming is paused for a few minutes after repeated
              claim-and-release. This keeps spots from being used just to browse
              venues. You can still view plans; try claiming again when the timer
              on the block screen ends.
            </div>
          ) : null}

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50/90 p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Plan
            </p>
            <p className="font-display mt-1 text-xl font-bold text-zinc-900">
              {plan.title}
            </p>
            <p className="mt-1 text-sm text-zinc-600">{plan.tagline}</p>
            <p className="mt-3 text-xs font-medium text-zinc-700">{plan.stop}</p>
          </div>

          {!plan.available ? (
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              This plan is already claimed in the live pool.{" "}
              <Link href={plansBack} className="font-semibold underline">
                Browse other plans
              </Link>
            </div>
          ) : null}

          {alreadyClaimedOther ? (
            <div className="mt-8 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800">
              You already have a plan locked for this session.{" "}
              <Link
                href={(() => {
                  const p = getPlanById(existingClaim) ?? getStoredAiPlan(existingClaim);
                  return p
                    ? buildGoHref(p, area)
                    : `/go/${existingClaim}`;
                })()}
                className="font-semibold text-brand underline decoration-brand/30"
              >
                Open your plan
              </Link>{" "}
              or{" "}
              <Link href={plansBack} className="font-semibold underline">
                browse the drop
              </Link>
              .
            </div>
          ) : null}

          {plan.available && !alreadyClaimedOther && !alreadyClaimedThis ? (
            <div className="mt-10 space-y-4">
              <button
                type="button"
                disabled={claiming || claimBlocked}
                onClick={handleClaim}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand/20 transition hover:bg-brand-hover disabled:opacity-70"
              >
                {claiming ? (
                  "Locking…"
                ) : (
                  <>
                    Claim & lock for my group
                    <span aria-hidden>→</span>
                  </>
                )}
              </button>
              <Link
                href={plansBack}
                className="block text-center text-sm font-semibold text-zinc-600 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900"
              >
                Back to browse
              </Link>
            </div>
          ) : null}

          {existingClaim === plan.id ? (
            <div className="mt-8 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
              <HugeIcon icon={CheckmarkCircle02Icon} size={18} />
              You&apos;ve already locked this plan.{" "}
              <Link
                href={
                  plan.id.startsWith("ai-") && area.trim()
                    ? `/go/${plan.id}?area=${encodeURIComponent(area.trim())}&snapshot=${encodeURIComponent(planToSnapshot(plan))}`
                    : `/go/${plan.id}`
                }
                className="font-semibold underline"
              >
                Crew briefing →
              </Link>
            </div>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
