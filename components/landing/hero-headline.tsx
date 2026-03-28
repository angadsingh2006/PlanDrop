"use client";

import { useEffect, useState } from "react";

const ROTATING_ENDINGS = [
  "tonight?",
  "this weekend?",
  "after work?",
  "for real?",
] as const;

export function HeroHeadline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % ROTATING_ENDINGS.length);
    }, 3200);

    const onChange = () => {
      if (mq.matches) setIndex(0);
    };
    mq.addEventListener("change", onChange);

    return () => {
      window.clearInterval(id);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const ending = ROTATING_ENDINGS[index];

  return (
    <h1 className="font-display mt-8 translate-x-2 text-[1.625rem] font-bold leading-[1.15] tracking-[-0.02em] text-zinc-900 sm:translate-x-3 sm:text-[2rem] sm:leading-[1.12] lg:translate-x-4 lg:text-[2.5rem]">
      <span className="block sm:inline">What are we doing </span>
      <span
        key={ending}
        className="hero-rotating-word text-brand sm:inline-block sm:min-h-[1.15em] sm:min-w-[12ch] sm:text-left"
      >
        {ending}
      </span>
    </h1>
  );
}
