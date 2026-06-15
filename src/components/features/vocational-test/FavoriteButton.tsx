"use client";

import * as React from "react";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

interface Props {
  occupationCode: string;
  initialFavorited?: boolean;
}

/** Toggles a favorited occupation (used in results and the labor-market feature). */
export function FavoriteButton({ occupationCode, initialFavorited = false }: Props) {
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
      if (!res.ok) throw new Error();
      const { favorited: now } = (await res.json()) as { favorited: boolean };
      setFavorited(now);
      toast.success(now ? "Profissão favoritada!" : "Removida dos favoritos.");
    } catch {
      toast.error("Não foi possível atualizar o favorito.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={favorited}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
        favorited
          ? "border-sun/40 bg-sun/10 text-sun"
          : "border-border bg-white text-muted-foreground hover:border-sun/40 hover:text-sun"
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={cn("h-4 w-4", favorited && "fill-sun")} />
      )}
      {favorited ? "Favoritada" : "Favoritar"}
    </button>
  );
}
