import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  /** Optional title — when omitted, the header row is not rendered. */
  title?: string;
  /** Optional gold icon shown to the left of the title. */
  icon?: LucideIcon;
  /** Optional content aligned to the right of the title (e.g. a status tag). */
  action?: React.ReactNode;
  /** Override the title color/size. */
  titleClassName?: string;
  /** Extra classes for the body wrapper (e.g. to center its content). */
  bodyClassName?: string;
  children: React.ReactNode;
  className?: string;
}

/** Consistent dashboard card — same glass look as the home cards. */
export function MetricCard({ title, icon: Icon, action, titleClassName, bodyClassName, children, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-white/15 bg-white/10 p-5 text-white shadow-sm backdrop-blur-sm",
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between gap-2">
          <h3 className={cn("flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/70", titleClassName)}>
            {Icon && <Icon className="h-4 w-4 shrink-0 text-gold" />}
            {title}
          </h3>
          {action}
        </div>
      )}
      <div className={cn(title && "mt-3", bodyClassName)}>{children}</div>
    </div>
  );
}
