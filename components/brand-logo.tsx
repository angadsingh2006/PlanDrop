import { Location01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/huge-icon";

/** Same pin mark everywhere (header, footer) — matches location UI. */
export function BrandLogoMark({
  variant,
  className,
}: {
  variant: "header" | "footer";
  className?: string;
}) {
  const onLight = variant === "header" || variant === "footer";
  return (
    <span className={`flex items-center gap-2 ${className ?? ""}`}>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          onLight
            ? "bg-brand text-white shadow-sm"
            : "bg-white text-brand"
        }`}
      >
        <HugeIcon
          icon={Location01Icon}
          size={18}
          strokeWidth={1.75}
          aria-hidden
        />
      </span>
      <span
        className={`font-display font-semibold tracking-[-0.02em] ${
          onLight ? "text-xl text-brand" : "text-lg text-white"
        }`}
      >
        PlanDrop
      </span>
    </span>
  );
}
