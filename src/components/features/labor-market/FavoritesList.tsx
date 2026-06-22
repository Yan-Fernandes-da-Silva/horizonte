"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, Search } from "lucide-react";

export interface FavoriteItem {
  occupationCode: string;
  title: string | null;
}

/**
 * Favorites list that revalidates itself on mount and when the window regains
 * focus, so favoriting/unfavoriting on a profession page shows up here without
 * a manual page reload.
 */
export function FavoritesList({ initial }: { initial: FavoriteItem[] }) {
  const [items, setItems] = React.useState<FavoriteItem[]>(initial);

  React.useEffect(() => {
    let active = true;
    const refetch = async () => {
      try {
        const res = await fetch("/api/favorites", { cache: "no-store" });
        if (!res.ok) return;
        const { favorites } = (await res.json()) as { favorites: FavoriteItem[] };
        if (active) setItems(favorites);
      } catch {
        /* keep the last known list on a network hiccup */
      }
    };
    refetch();
    const onFocus = () => refetch();
    window.addEventListener("focus", onFocus);
    return () => {
      active = false;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-white">
        <Heart className="h-5 w-5 text-gold" /> Suas profissões favoritas
      </h2>
      {items.length === 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-white/25 bg-white/5 p-6 text-center text-sm text-white/80 backdrop-blur-sm">
          <Search className="mx-auto mb-2 h-6 w-6 text-white/60" />
          Você ainda não favoritou profissões. Pesquise acima e salve as que mais te interessam.
        </div>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <Link
              key={f.occupationCode}
              href={`/labor-market/${f.occupationCode}`}
              className="group flex h-full flex-col rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15 hover:shadow-md"
            >
              {/* Reserve 2 lines for the title so the CBO codes line up across cards. */}
              <p className="line-clamp-2 min-h-[2.5rem] font-semibold leading-tight text-white group-hover:text-sky-light">
                {f.title ?? "Profissão"}
              </p>
              <p className="mt-2 text-xs text-white/70">CBO {f.occupationCode}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
