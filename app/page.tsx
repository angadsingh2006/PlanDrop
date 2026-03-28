import Link from "next/link";
import { Suspense } from "react";
import { BrowsePlansSection } from "@/components/landing/browse-plans-section";
import { HeroHeadline } from "@/components/landing/hero-headline";
import { HeroPlanCardsMarquee } from "@/components/landing/hero-plan-cards-marquee";
import { HeroLocationSearch } from "@/components/landing/hero-location-search";
import { getHomepageStats } from "@/lib/homepage-stats";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function Home() {
  const stats = getHomepageStats();

  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section
          id="hero-locate"
          className="overflow-x-hidden pb-16 pt-12 sm:pb-24 sm:pt-16"
        >
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand">
              <span className="h-2 w-2 rounded-full bg-brand animate-pulse" aria-hidden />
              Live plans available now
            </p>
            <HeroHeadline />
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              Browse famous spots below, or search your city for AI-built plans
              for your crew. Claim in one tap—no spreadsheet, no group-chat
              meltdown.
            </p>
            <HeroLocationSearch />
          </div>

          <div className="mt-10 sm:mt-12">
            <HeroPlanCardsMarquee />
          </div>

          <div className="mx-auto mt-14 max-w-3xl px-4 sm:mt-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-5 rounded-2xl border border-zinc-200/70 bg-zinc-50/90 p-6 shadow-sm ring-1 ring-zinc-100/80 sm:grid-cols-3 sm:gap-6 sm:p-8">
              {[
                [String(stats.plansLiveToday), "Plans live today"],
                [String(stats.citiesDropping), "Cities dropping"],
                [stats.avgPlanLength, "Avg plan length"],
              ].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="font-display text-2xl font-semibold tabular-nums text-brand sm:text-4xl">
                    {n}
                  </p>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-zinc-500 sm:text-xs">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HowItWorksSection />

        <Suspense fallback={null}>
          <BrowsePlansSection />
        </Suspense>

        {/* For groups */}
        <section
          id="for-groups"
          className="scroll-mt-24 border-t border-zinc-100 px-4 py-12 text-center sm:px-6 lg:px-8"
        >
          <p className="text-base font-medium text-zinc-600">
            Built for friend groups, teams, and anyone tired of the group chat
            spiral.
          </p>
          <Link
            href="/for-groups"
            className="mt-4 inline-block text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
          >
            Why PlanDrop works for groups →
          </Link>
        </section>

        {/* CTA — floating card (full rounding + margin) so it doesn’t flush to the viewport edge */}
        <section className="px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-brand shadow-[0_24px_80px_-12px_rgba(43,83,193,0.45)] ring-1 ring-black/5 sm:rounded-[2rem]">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 1px, transparent 0)`,
                backgroundSize: "24px 24px",
              }}
              aria-hidden
            />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-light/30 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-hover/25 blur-3xl" aria-hidden />
            <div className="relative px-6 py-16 text-center sm:px-12 sm:py-20 lg:py-24">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                Worldwide · tonight
              </p>
              <h2 className="font-display mt-4 text-3xl font-bold leading-[1.15] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                Your group&apos;s next move is waiting.
              </h2>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/#hero-locate"
                  className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold text-brand shadow-lg transition hover:bg-zinc-50 hover:shadow-xl sm:w-auto sm:py-5 sm:text-lg"
                >
                  Find plans near you
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/plans"
                  className="text-sm font-semibold text-white/90 underline decoration-white/40 underline-offset-4 transition hover:text-white hover:decoration-white"
                >
                  Browse all plans
                </Link>
              </div>
              <p className="mt-8 text-sm text-white/75">
                No sign-up · No payment · <span className="italic text-white/90">ready to drop</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
