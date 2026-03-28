import Link from "next/link";
import { BrandLogoMark } from "@/components/brand-logo";

const nav = [
  ["/how-it-works", "How it works"],
  ["/drop", "Drop a pin"],
  ["/plans", "Browse plans"],
  ["/for-groups", "For groups"],
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="inline-block w-fit hover:opacity-90">
              <BrandLogoMark variant="footer" />
            </Link>
            <p className="mt-4 text-sm italic leading-relaxed text-zinc-500">
              ready to drop
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              Live plans for your crew—claim a spot, share one link, go.
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:items-end">
            <nav
              className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-zinc-700 lg:justify-end"
              aria-label="Footer"
            >
              {nav.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="transition hover:text-zinc-900"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <p className="text-xs text-zinc-500 lg:text-right">
              © {new Date().getFullYear()} PlanDrop · No sign-up required
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
