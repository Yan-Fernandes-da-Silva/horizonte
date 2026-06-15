import { cn } from "@/lib/utils";

interface Props {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/** Consistent dashboard card. */
export function MetricCard({ title, children, className }: Props) {
  return (
    <div className={cn("rounded-2xl border border-border bg-white/80 p-5 shadow-sm backdrop-blur-sm", className)}>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
