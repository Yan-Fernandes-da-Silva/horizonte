import { cn } from "@/lib/utils";

interface WaveDividerProps {
  /**
   * Tailwind text-color class controlling the wave fill (via currentColor).
   * Set it to match the next section's background (e.g. `text-white`).
   */
  className?: string;
}

/**
 * Decorative SVG wave that transitions from one section into the next.
 * Meant to be placed inside a `relative` parent; it pins to the bottom and
 * gently bobs. A solid base strip prevents a gap while it animates.
 */
export function WaveDivider({ className }: WaveDividerProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 text-white",
        className
      )}
    >
      <div className="absolute inset-x-0 bottom-0 h-4 bg-current" />
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="currentColor"
        className="relative block h-[56px] w-full animate-wave sm:h-[88px]"
      >
        <path d="M0,64 C240,112 480,24 720,52 C960,80 1200,116 1440,60 L1440,120 L0,120 Z" />
      </svg>
    </div>
  );
}
