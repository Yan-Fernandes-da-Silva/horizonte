import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap: Record<NonNullable<LoadingSpinnerProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

/** Centered loading indicator in the sky color. */
export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      role="status"
      aria-label="Carregando"
    >
      <Loader2 className={cn("animate-spin text-sky", sizeMap[size])} />
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
