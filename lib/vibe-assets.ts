import type { VibeId } from "@/lib/plans-data";

export function metaClassForVibe(vibe: VibeId): string {
  switch (vibe) {
    case "chill":
      return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100";
    case "active":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
    case "foodie":
      return "bg-amber-50 text-amber-800 ring-1 ring-amber-100";
    case "adv":
      return "bg-violet-50 text-violet-800 ring-1 ring-violet-100";
    default:
      return "bg-zinc-50 text-zinc-800 ring-1 ring-zinc-100";
  }
}

const COVERS: Record<VibeId, { src: string; alt: string }[]> = {
  chill: [
    {
      src: "/images/ponce-city-market.png",
      alt: "Outdoor market and dining scene",
    },
    {
      src: "/images/piedmont-park-clara-meer.png",
      alt: "Park paths and trees at golden hour",
    },
  ],
  active: [
    {
      src: "/images/piedmont-park-clara-meer.png",
      alt: "Park loop with skyline in the distance",
    },
    {
      src: "/images/mercedes-benz-stadium.png",
      alt: "Urban plaza and architecture",
    },
  ],
  foodie: [
    {
      src: "/images/krog-street-market.png",
      alt: "Food hall and patio dining",
    },
    {
      src: "/images/ponce-city-market.png",
      alt: "Market stalls and evening lights",
    },
  ],
  adv: [
    {
      src: "/images/mercedes-benz-stadium.png",
      alt: "Landmark building exterior",
    },
    {
      src: "/images/krog-street-market.png",
      alt: "Neighborhood murals and street scene",
    },
  ],
};

export function coverForVibe(vibe: VibeId, index: number): { src: string; alt: string } {
  const list = COVERS[vibe] ?? COVERS.chill;
  return list[index % list.length]!;
}
