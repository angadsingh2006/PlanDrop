export type VibeId = "chill" | "active" | "foodie" | "adv";

export type Plan = {
  id: string;
  title: string;
  tagline: string;
  price: string;
  meta: string;
  metaClass: string;
  stop: string;
  coverImageSrc: string;
  coverImageAlt: string;
  photoCredit: string;
  /** When set, cover image is loaded via `/api/place-photo` (Google Places). */
  placePhotoRef?: string;
  /** Multiple Place photo refs (same venue); used on briefings / galleries. */
  placePhotoRefs?: string[];
  /** Extra local images for catalog plans (public paths). */
  galleryImageSrcs?: string[];
  /** Google Place ID from search/details (for enrichment). */
  placeId?: string;
  /** Canonical address from Places (shown + Maps link). */
  formattedAddress?: string;
  /** Google Maps URL for this place (opens in app when tapped). */
  mapsUrl?: string;
  placeLat?: number;
  placeLng?: number;
  /** Short line for cards, e.g. "Open now · 9:00 AM – 9:00 PM" */
  openingHoursLine?: string;
  /** Full weekday lines from Places (modal). */
  openingHoursWeekday?: string[];
  duration: string;
  groupLabel: string;
  vibe: VibeId;
  minGroup: number;
  maxGroup: number;
  /** Seed data: whether this plan is still open in the pool */
  available: boolean;
  viewing?: number;
  locationDetails: string[];
};

export const PLANS: Plan[] = [
  {
    id: "1",
    title: "Ponce & BeltLine golden hour",
    tagline: "Stroll the Eastside Trail, then settle in at the market.",
    price: "~$42/pp",
    meta: "CHILL · 4–6 PEOPLE · 2.5 HRS",
    metaClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    stop: "Ponce City Market (6:30 PM)",
    coverImageSrc: "/images/ponce-city-market.png",
    coverImageAlt:
      "Ponce City Market exterior with orange awning and signage in Atlanta",
    photoCredit: "Ponce City Market - Atlanta",
    placeLat: 33.7721,
    placeLng: -84.3653,
    formattedAddress:
      "675 Ponce De Leon Ave NE, Atlanta, GA 30308, USA",
    duration: "2.5 hrs",
    groupLabel: "4–6",
    vibe: "chill",
    minGroup: 4,
    maxGroup: 6,
    available: true,
    viewing: 7,
    locationDetails: [
      "Hop between food stalls, sit-down spots, and shops under the brick arches.",
      "Walk or bike the Eastside Trail right outside for golden-hour views.",
      "Grab drinks on a patio and keep the group loose — no single table required.",
      "Meet at the central courtyard when everyone arrives on their own time.",
    ],
  },
  {
    id: "2",
    title: "Piedmont Park morning loop",
    tagline: "Lake loop, skyline views, cold coffee after.",
    price: "~$18/pp",
    meta: "ACTIVE · 2–4 PEOPLE · 2 HRS",
    metaClass: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    stop: "Piedmont Park — 12th St & Piedmont Ave (8:00 AM)",
    coverImageSrc: "/images/piedmont-park-clara-meer.png",
    coverImageAlt:
      "Lake Clara Meer in Piedmont Park with Midtown Atlanta skyline reflected on the water",
    photoCredit: "Piedmont Park - Atlanta",
    /** Second local asset for gallery arrows in modals (swap for another park shot if you add one). */
    galleryImageSrcs: [
      "/images/piedmont-park-clara-meer.png",
      "/images/ponce-city-market.png",
    ],
    placeLat: 33.786,
    placeLng: -84.3732,
    formattedAddress: "400 Park Dr NE, Atlanta, GA 30309, USA",
    duration: "2 hrs",
    groupLabel: "2–4",
    vibe: "active",
    minGroup: 2,
    maxGroup: 4,
    available: false,
    locationDetails: [
      "Circle Lake Clara Meer for a flat, easy loop with skyline reflections.",
      "Spread out on open lawns or use the active oval for a light jog.",
      "Catch Midtown towers over the treeline — classic Atlanta postcard views.",
      "Use the dog park or sports courts if your crew wants a little extra movement.",
      "Finish with cold coffee from a nearby café on the park edge.",
    ],
  },
  {
    id: "3",
    title: "Krog Street tasting line",
    tagline: "Small plates, shared tables, zero decision fatigue.",
    price: "~$55/pp",
    meta: "FOODIE · 4 PEOPLE · 3 HRS",
    metaClass: "bg-amber-50 text-amber-800 ring-1 ring-amber-100",
    stop: "Krog Street Market (7:15 PM)",
    coverImageSrc: "/images/krog-street-market.png",
    coverImageAlt:
      "Krog Street Market exterior at dusk with patio, signage, and parking in front",
    photoCredit: "Krog Street Market - Atlanta",
    placeLat: 33.752,
    placeLng: -84.3644,
    formattedAddress: "99 Krog St NE, Atlanta, GA 30307, USA",
    duration: "3 hrs",
    groupLabel: "4",
    vibe: "foodie",
    minGroup: 4,
    maxGroup: 4,
    available: true,
    locationDetails: [
      "Share small plates from different vendors so nobody has to pick one restaurant.",
      "Post up on the covered patio or high-top rails for a social, low-pressure dinner.",
      "Browse beer and wine at Hop City–style counters before you commit to food.",
      "Stroll Krog Street Tunnel murals if you want a quick art break between bites.",
      "Easy parking and BeltLine access for late arrivals.",
    ],
  },
  {
    id: "4",
    title: "Mercedes-Benz Stadium circuit",
    tagline: "The pinwheel roof, the plaza, then easy hops to Westside food.",
    price: "~$45/pp",
    meta: "ADVENTUROUS · 2–4 PEOPLE · 3 HRS",
    metaClass: "bg-violet-50 text-violet-800 ring-1 ring-violet-100",
    stop: "Mercedes-Benz Stadium — Northside Dr NW (4:30 PM)",
    coverImageSrc: "/images/mercedes-benz-stadium.png",
    coverImageAlt:
      "Aerial view of Mercedes-Benz Stadium with closed retractable roof and Mercedes star on the facade",
    photoCredit: "Mercedes-Benz Stadium - Atlanta",
    placeLat: 33.7554,
    placeLng: -84.4008,
    formattedAddress: "1 AMB Dr NW, Atlanta, GA 30313, USA",
    duration: "3 hrs",
    groupLabel: "2–4",
    vibe: "adv",
    minGroup: 2,
    maxGroup: 4,
    available: true,
    locationDetails: [
      "Walk the plaza and take in the pinwheel roof and Mercedes star facade.",
      "On event days, soak up pregame energy; off-days, quiet architecture photos.",
      "Visit the team store for gear if your group wants a shared souvenir stop.",
      "Loop the stadium footprint, then cut toward Westside or GWCC-adjacent dining.",
      "Pair with a short rideshare hop if you want Atlantic Station or Vine City after.",
    ],
  },
];

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
