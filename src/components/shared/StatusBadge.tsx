import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        success: "bg-emerald-100 text-emerald-700",
        warning: "bg-gold/15 text-gold-dark",
        danger: "bg-red-100 text-red-700",
        info: "bg-sky-lighter text-ocean",
        neutral: "bg-slate-100 text-slate-600",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  label: string;
  className?: string;
}

/** Colored status badge used for market indicators (success/warning/danger/info/neutral). */
export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)}>{label}</span>
  );
}
