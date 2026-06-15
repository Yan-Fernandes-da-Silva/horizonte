import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

/** Empty state shown in dashboard cards before a feature has been used. */
export function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white/60 px-6 py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-lighter text-sky [&_svg]:h-7 [&_svg]:w-7">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-ocean">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {ctaLabel && ctaHref && (
        <Button
          asChild
          className="mt-5 bg-gold text-ocean hover:bg-gold-dark hover:text-white"
        >
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  );
}
