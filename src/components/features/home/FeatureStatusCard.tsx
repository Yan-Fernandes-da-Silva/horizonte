import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Accent = "sky" | "gold" | "success";

interface CardAction {
  label: string;
  href: string;
}

interface FeatureStatusCardProps {
  icon: LucideIcon;
  accent: Accent;
  title: string;
  description?: string;
  /** Optional element shown at the top-right (e.g. a count badge). */
  badge?: React.ReactNode;
  /** Extra content between the description and the actions (progress bars, stats). */
  children?: React.ReactNode;
  primaryAction: CardAction;
  secondaryAction?: CardAction;
}

// Icon tile background per accent (matches the landing page's gradient style).
const accentTile: Record<Accent, string> = {
  sky: "bg-ocean-gradient text-white",
  gold: "bg-gold text-ocean",
  success: "bg-emerald-500 text-white",
};

// Thin top bar that color-codes the card's state.
const accentBar: Record<Accent, string> = {
  sky: "from-sky to-ocean",
  gold: "from-gold to-gold-dark",
  success: "from-emerald-400 to-emerald-600",
};

/**
 * Shared presentational card for the home dashboard. Each feature card
 * (Vocational, Labor Market, Career Plan) feeds its own content/state into it,
 * keeping the visual structure consistent across all three.
 */
export function FeatureStatusCard({
  icon: Icon,
  accent,
  title,
  description,
  badge,
  children,
  primaryAction,
  secondaryAction,
}: FeatureStatusCardProps) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          accentBar[accent]
        )}
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105",
            accentTile[accent]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        {badge}
      </div>

      <h3 className="mt-5 text-lg font-bold text-ocean">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}

      {children ? <div className="mt-4">{children}</div> : null}

      <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
        <Button
          asChild
          className="bg-gold text-ocean hover:bg-gold-dark hover:text-white"
        >
          <Link href={primaryAction.href}>{primaryAction.label}</Link>
        </Button>
        {secondaryAction ? (
          <Button
            asChild
            variant="outline"
            className="border-ocean/30 text-ocean hover:bg-ocean/5"
          >
            <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
