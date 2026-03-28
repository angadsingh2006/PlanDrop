import Link from "next/link";
import { Suspense } from "react";
import { BrowsePlansSection } from "@/components/landing/browse-plans-section";
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
          className="px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand">
              <span className="h-2 w-2 rounded-full bg-brand animate-pulse" aria-hidden />
              Live plans available now
            </p>
            <h1 className="font-display mt-8 text-[2rem] font-bold leading-[1.15] tracking-[-0.02em] text-zinc-900 sm:text-[2.75rem] sm:leading-[1.12] lg:text-[3.25rem]">
              What are we doing{" "}
              <span className="text-brand">tonight?</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              Search your city or use your location to see curated hangs you can
              claim in one tap—no spreadsheet required.
            </p>
            <HeroLocationSearch />

            <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-5 rounded-2xl border border-zinc-200/70 bg-zinc-50/90 p-6 shadow-sm ring-1 ring-zinc-100/80 sm:mt-16 sm:grid-cols-3 sm:gap-6 sm:p-8">
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

        {/* Gradient CTA */}
        <section className="px-4 pb-0 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-t-[2.5rem] bg-brand px-6 py-20 text-center shadow-2xl sm:px-12 sm:py-24 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-400 via-brand to-brand-hover opacity-80" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold leading-snug tracking-[-0.02em] text-white sm:text-5xl">
                Your group&apos;s next move is waiting.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base text-white/90 sm:text-lg">
                Stop the &ldquo;what do you want to do?&rdquo; loop. Drop in now.
              </p>
              <Link
                href="/#hero-locate"
                className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-white px-10 py-5 text-lg font-bold text-brand shadow-xl transition-all hover:scale-105 hover:bg-zinc-50 hover:shadow-2xl"
              >
                Find plans near you
                <span aria-hidden>→</span>
              </Link>
              <p className="mt-6 text-sm font-medium text-white/80">
                No sign-up. No payment. Just show up.
              </p>
            </div>
          </div>
        </section>

        <div className="h-3 bg-gradient-to-r from-indigo-400 via-brand to-brand-hover" aria-hidden />
      </main>

      <SiteFooter />
    </>
  );
}
