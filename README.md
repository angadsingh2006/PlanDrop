# PlanDrop

**Live demo:** [plandrop-1.vercel.app](https://plandrop-1.vercel.app/)

**Friend-group activities, first come first served.** Pick your area, browse a live pool of AI-made plans, claim one before another group does, then share the link so everyone sees the same itinerary—no more “what do you want to do?” loops.

Hackathon 2026 · built in 12 hours.

## What it is

PlanDrop is **curated group outings with scarcity**: each plan in the pool is **one-of-a-kind for your area**—when a group claims it, it’s **gone** for everyone else. That urgency cuts through indecision without you having to build a plan from scratch.

## Why it exists

Group planning often stalls on empty calendars and vague ideas. PlanDrop gives **ready-made options** (vibe, duration, stops, rough cost) so your crew can decide fast and actually go do something.

## How it works

1. Set your area.
2. Browse available plans and pick one your group likes.
3. **Claim** it—your group locks that plan.
4. Share the link so friends see the full outing.
5. Show up and enjoy.

## What we built (specifics)

- **Browse by place:** city / ZIP search with radius, optional geolocation, and Google Places–backed suggestions so the drop matches where people actually are.
- **Live plan pool:** plans live in Supabase (`plan_live`) with **Realtime** so when someone claims or releases a plan, everyone browsing the grid sees it update without refreshing.
- **Claim flow:** anonymous browser sessions can claim, unclaim, and revisit **Your claims**; shareable **`/go/[planId]`** pages give the group one canonical itinerary (stops, vibe, timing cues, map links).
- **Polished surface:** landing hero with a scrolling marquee of real venues and photos, vibe tags (chill / active / foodie / adventurous), static map previews, and API routes for autocomplete, reverse geocode, place photos, and AI plan generation (Claude) feeding the pool.
- **MVP boundaries:** no accounts or payments in the demo—focus is **claim → share → show up**, not bookings.

## Tech

Next.js (App Router), Supabase (Postgres + Realtime), Claude, Tailwind, deployed on **Vercel**. Anonymous sessions—no accounts required for the demo.

## What to know

- Plans are **generated ahead of time** so browsing stays fast; claiming updates **live** for everyone looking at the pool.
- **Web-first** MVP—focus is the shared claim-and-share experience, not bookings or payments.

---

*PlanDrop — ready to drop.*
