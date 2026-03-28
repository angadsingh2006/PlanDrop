"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getClaimedPlanId } from "@/lib/claim-storage";

export function useClaimedPlanId(): string | null {
  const pathname = usePathname();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setId(getClaimedPlanId());
    sync();
    window.addEventListener("plandrop-claim-change", sync);
    return () => window.removeEventListener("plandrop-claim-change", sync);
  }, [pathname]);

  return id;
}
