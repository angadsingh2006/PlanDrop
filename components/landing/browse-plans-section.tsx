"use client";

import Link from "next/link";
import { useState } from "react";

const filters = [
  { id: "all", label: "All vibes" },
  { id: "chill", label: "🌴 Chill" },
  { id: "active", label: "⚡ Active" },
  { id: "foodie", label: "🍴 Foodie" },
  { id: "adv", label: "🔥 Adventurous" },
  { id: "p2", label: "👥 2 people" },
  { id: "p4", label: "👥 4+" },
] as const;

type Plan = {
  id: string;
  title: string;
  tagline: string;
  price: string;
  meta: string;
  metaClass: string;
  stop: string;
  gradient: string;
  emoji: string;
  available: boolean;
  viewing?: number;
};

const plans: Plan[] = [
  {
    id: "1",
    title: "Golden Hour on the Strip",
    tagline: "The kind of night you'll talk about for weeks.",
    price: "~$45/pp",
    meta: "🌴 CHILL · 4-6 PEOPLE · 2.5 HRS",
    metaClass: "bg-brand-soft text-brand",
    stop: "Pérez Art Museum (6:00 PM)",
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
    emoji: "🌆",
    available: true,
    viewing: 7,
  },
  {
    id: "2",
    title: "South Beach Morning Reset",
    tagline: "Salty air, cold brew, and no alarms.",
    price: "~$25/pp",
    meta: "⚡ ACTIVE · 2-4 PEOPLE · 3 HRS",
    metaClass: "bg-zinc-100 text-zinc-600",
    stop: "Lummus Park Beach (7:00 AM)",
    gradient: "from-rose-300 via-orange-200 to-amber-200",
    emoji: "🏖️",
    available: false,
  },
];

export function BrowsePlansSection() {
  const [active, setActive] = useState<string>("all");

  return (
    <section id="plans" className="scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8">
      {/* Live strip */}
      <div className="mx-auto mb-10 max-w-7xl overflow-hidden rounded-2xl bg-gradient-to-r from-navy-card via-[#252347] to-navy px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-white sm:text-base">
            <span aria-hidden>🔥</span> Plans are dropping in{" "}
            <span className="whitespace-nowrap">Miami right now</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white sm:text-sm">
              6 plans remaining tonight
            </span>
            <Link
              href="#plans"
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Claim yours →
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand">
              Live in Miami, FL
            </p>
            <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Available plans tonight
            </h2>
          </div>
          <Link
            href="#plans"
            className="text-sm font-semibold text-zinc-900 underline decoration-zinc-400 underline-offset-4 hover:decoration-brand"
          >
            Show all 48 plans →
          </Link>
        </div>

        <div className="no-scrollbar mb-10 flex gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                active === f.id
                  ? "border-navy bg-navy text-white"
                  : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-card ${!plan.available ? "opacity-90" : ""}`}
            >
              <div
                className={`relative aspect-[16/10] bg-gradient-to-br ${plan.gradient}`}
              >
                <div className="absolute inset-0 flex items-center justify-center text-7xl sm:text-8xl">
                  {plan.emoji}
                </div>
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {plan.available ? (
                    <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                      ● Available
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-500/90 px-3 py-1 text-xs font-bold text-white">
                      Claimed ✓
                    </span>
                  )}
                </div>
                {plan.viewing != null && plan.available ? (
                  <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    👀 {plan.viewing} viewing
                  </span>
                ) : null}
              </div>
              <div className={`p-6 ${!plan.available ? "text-zinc-400" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className={`font-display text-xl font-bold ${plan.available ? "text-zinc-900" : "text-zinc-500"}`}
                  >
                    {plan.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${plan.available ? "bg-zinc-100 text-zinc-800" : "bg-zinc-100/80 text-zinc-400"}`}
                  >
                    {plan.price}
                  </span>
                </div>
                <p
                  className={`mt-2 text-sm italic ${plan.available ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  {plan.tagline}
                </p>
                <p
                  className={`mt-4 inline-block rounded-full px-3 py-1.5 text-xs font-bold tracking-wide ${plan.metaClass}`}
                >
                  {plan.meta}
                </p>
                <p className="mt-4 text-sm font-medium text-zinc-700">
                  <span className="text-brand">●</span> {plan.stop}
                </p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="flex gap-4 text-xs text-zinc-400">
                    <span>
                      🕐 {plan.available ? "2.5 hrs" : "3 hrs"}
                    </span>
                    <span>👥 {plan.available ? "4–6" : "2–4"}</span>
                  </div>
                  {plan.available ? (
                    <button
                      type="button"
                      className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-hover"
                    >
                      Claim plan →
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="rounded-full bg-zinc-200 px-6 py-3 text-sm font-bold text-zinc-500"
                    >
                      Claimed ✓
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
