import { SparklesIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { BrandLogoMark } from "@/components/brand-logo";
import { HugeIcon } from "@/components/ui/huge-icon";

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <Link href="/" className="inline-block w-fit hover:opacity-95">
          <BrandLogoMark variant="footer" />
        </Link>
        <nav className="flex flex-wrap gap-x-10 gap-y-3 text-sm font-medium text-white/90">
          <Link href="/how-it-works" className="hover:text-white">
            How it works
          </Link>
          <Link href="/drop" className="hover:text-white">
            Drop a pin
          </Link>
          <Link href="/plans" className="hover:text-white">
            Browse plans
          </Link>
          <Link href="/for-groups" className="hover:text-white">
            For groups
          </Link>
        </nav>
        <p className="inline-flex items-center gap-1.5 text-sm text-white/50">
          <span>
            Contact · © {new Date().getFullYear()} PlanDrop · Built in 12 hours
          </span>
          <HugeIcon icon={SparklesIcon} size={14} className="text-white/40" />
        </p>
      </div>
    </footer>
  );
}
