import Link from "next/link";
import { BrowsePlansSection } from "@/components/landing/browse-plans-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              Live plans available now
            </p>
            <h1 className="font-display mt-8 text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
              Stop planning.
              <br />
              Start <span className="text-brand">dropping.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
              Ready-made plans for your crew, generated fresh and dropped daily.
              Claim one before someone else does — then just show up and have
              fun.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="#plans"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-hover"
              >
                Browse plans near me
                <span aria-hidden>→</span>
              </Link>
              <span className="text-sm text-zinc-500">+ No account needed</span>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-zinc-100 pt-12">
              {[
                ["48", "Plans live today"],
                ["12", "Cities dropping"],
                ["~2 hr", "Avg plan length"],
              ].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="font-display text-3xl font-bold text-zinc-900 sm:text-4xl">
                    {n}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{l}</p>
                </div>
              ))}
            </div>

            <Link
              href="#how-it-works"
              className="mt-14 inline-block text-xs font-bold uppercase tracking-widest text-brand hover:underline"
            >
              How PlanDrop works
            </Link>
          </div>
        </section>

        {/* How it works — 4 steps */}
        <section
          id="how-it-works"
          className="scroll-mt-24 border-t border-zinc-100 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">
              How PlanDrop works
            </p>
            <h2 className="font-display mt-3 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
              Four steps. Zero debates.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-zinc-600">
              We did the planning so you don&apos;t have to argue for 40 minutes
              about where to eat.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-8 sm:grid-cols-2 sm:gap-10">
            {[
              {
                icon: "📍",
                title: "Drop a pin",
                body: "Enter your city or neighborhood. We surface plans designed for your exact area.",
                ring: "bg-white shadow-icon",
              },
              {
                icon: "✨",
                title: "Browse the drop",
                body: "See the live grid of available plans — each with a vibe, duration, group size, and stops.",
                ring: "bg-white shadow-icon",
              },
              {
                icon: "⚡",
                title: "Claim it fast",
                body: "Hit Claim. It's atomically locked to your group in real-time — no double-bookings, ever.",
                ring: "bg-white shadow-icon",
              },
              {
                icon: "🎉",
                title: "Just show up",
                body: "Share a link with your crew. They see venues, timing, and what to expect. Then just go.",
                ring: "bg-brand text-white shadow-brand/30",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="flex gap-5 text-left sm:items-start"
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl ${s.ring}`}
                >
                  {s.icon}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-zinc-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <BrowsePlansSection />

        {/* Claim moment */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-b from-navy-card via-[#1a1744] to-navy-deep p-8 sm:p-12">
            <h2 className="font-display text-center text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              The claim moment hits different.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-white/80">
              Open two browser windows. Claim a plan in one. Watch it disappear
              in real-time in the other. No explanation needed — you just feel
              it.
            </p>
            <ul className="mx-auto mt-10 max-w-lg space-y-6">
              {[
                ["⚡", "Atomic claiming", "Database transaction checks availability and locks in one shot. No race conditions."],
                ["🔴", "Real-time updates", "Supabase Realtime flips every watcher's view the moment a plan is claimed."],
                ["✨", "AI-curated plans", "Each plan is crafted by Claude — unique vibe, real venues, timed stops."],
              ].map(([icon, title, desc]) => (
                <li key={title as string} className="flex gap-4">
                  <span className="text-xl" aria-hidden>
                    {icon}
                  </span>
                  <div>
                    <p className="font-bold text-white">{title}</p>
                    <p className="mt-1 text-sm text-white/70">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* For groups anchor */}
        <section
          id="for-groups"
          className="scroll-mt-24 border-t border-zinc-100 px-4 py-8 text-center sm:px-6 lg:px-8"
        >
          <p className="text-sm text-zinc-500">
            Built for friend groups, teams, and anyone tired of the group chat
            spiral.
          </p>
        </section>

        {/* Gradient CTA */}
        <section className="px-4 pb-0 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-t-3xl bg-gradient-to-r from-[#FF4B6B] via-brand to-[#D42A8F] px-6 py-16 text-center sm:px-12 sm:py-20">
            <h2 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              Your group&apos;s next move is waiting.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-white/95">
              Stop the &ldquo;what do you want to do?&rdquo; loop. Drop in now.
            </p>
            <Link
              href="#plans"
              className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand shadow-lg transition hover:bg-zinc-50"
            >
              Browse plans near me
              <span aria-hidden>→</span>
            </Link>
            <p className="mt-4 text-sm text-white/80">
              No sign-up. No payment. Just show up.
            </p>
          </div>
        </section>

        <div className="h-2 bg-gradient-to-r from-brand via-[#D42A8F] to-brand" aria-hidden />
      </main>

      <SiteFooter />
    </>
  );
}
