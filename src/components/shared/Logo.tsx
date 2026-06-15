import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

/**
 * Timão (ship's wheel) — Horizonte's brand mark.
 * Uses `currentColor`, so the surrounding text color controls it
 * (ocean on light backgrounds, white on dark).
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-7 w-7", className)}
      aria-hidden="true"
    >
      {/* spokes + handles (diameters extending past the rim) */}
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
      {/* rim */}
      <circle cx="12" cy="12" r="7" />
      {/* hub */}
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
