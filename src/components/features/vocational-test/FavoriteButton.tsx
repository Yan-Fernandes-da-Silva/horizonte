"use client";

import * as React from "react";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

interface Props {
  occupationCode: string;
  initialFavorited?: boolean;
  /** "glass" = transparent button for dark glass headers (gold heart when active). */
  variant?: "default" | "glass";
}

/** Toggles a favorited occupation (used in results and the labor-market feature). */
export function FavoriteButton({ occupationCode, initialFavorited = false, variant = "default" }: Props) {
  const [favorited, setFavorited] = React.useState(initialFavorited);
  const [loading, setLoading] = React.useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ occupationCode }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        favorited?: boolean;
        error?: string;
        limitReached?: boolean;
      };
      // Hit the favorites cap → show the bottom-right notice (not a toast).
      if (res.status === 409 && data.limitReached) {
        window.dispatchEvent(
          new CustomEvent("favorites:limit", { detail: { message: data.error } })
        );
        return;
      }
      if (!res.ok) throw new Error();
      setFavorited(Boolean(data.favorited));
      toast.success(data.favorited ? "Profissão favoritada!" : "Removida dos favoritos.");
    } catch {
      toast.error("Não foi possível atualizar o favorito.");
    } finally {
      setLoading(false);
    }
  };

  const isGlass = variant === "glass";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={favorited}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
        isGlass
          ? "border-white/30 bg-transparent text-white hover:bg-white/10"
          : favorited
            ? "border-red-400/50 bg-red-500/30 text-white"
            : "border-border bg-white text-muted-foreground hover:border-sun/40 hover:text-sun"
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart
          className={cn(
            "h-4 w-4",
            favorited && (isGlass ? "fill-gold text-gold" : "fill-red-500 text-red-500")
          )}
        />
      )}
      {favorited ? "Favoritada" : "Favoritar"}
    </button>
  );
}
