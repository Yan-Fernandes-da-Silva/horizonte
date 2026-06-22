import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface HomeFeatureCardProps {
  icon: LucideIcon;
  title: string;
  /** "Estado atual" line — changes with the user's progress. */
  state: string;
  /** Supporting line below the state. */
  support: string;
  /** The whole card links here (destination depends on the state). */
  href: string;
}

/**
 * Home dashboard card, styled like the landing's "Como funciona" steps:
 * sea-tone translucent surface, gold icon (top-left) and white title
 * (top-right). The entire card is a single link.
 */
export function HomeFeatureCard({
  icon: Icon,
  title,
  state,
  support,
  href,
}: HomeFeatureCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-white/15 bg-white/10 p-6 text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-9 w-9 shrink-0 text-gold" />
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      {/* Reserve ~2 lines for each block so they line up across all cards. */}
      <p className="mt-5 flex min-h-[3rem] items-start font-semibold text-sky-lighter">
        {state}
      </p>
      <p className="flex min-h-[2.75rem] items-start text-sm leading-relaxed text-white/80">
        {support}
      </p>
    </Link>
  );
}
