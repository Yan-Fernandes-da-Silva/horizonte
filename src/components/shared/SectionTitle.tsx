import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

/** Section heading with an optional subtitle. */
export function SectionTitle({
  title,
  subtitle,
  align = "left",
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("space-y-2", align === "center" && "text-center", className)}>
      <h2 className="text-2xl font-bold tracking-tight text-ocean sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "max-w-2xl text-muted-foreground",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
