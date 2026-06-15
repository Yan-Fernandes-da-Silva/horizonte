"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface Hit {
  code: string;
  title: string;
}

/** Debounced autocomplete over CBO occupations; selecting one opens its dashboard. */
export function OccupationSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [hits, setHits] = React.useState<Hit[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/labor-market/search?q=${encodeURIComponent(q)}`);
        const { results } = (await res.json()) as { results: Hit[] };
        setHits(results);
        setOpen(true);
      } catch {
        setHits([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const go = (code: string) => {
    setOpen(false);
    router.push(`/labor-market/${code}`);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => hits.length && setOpen(true)}
          placeholder="Ex: Analista de sistemas, Enfermeiro, Pedreiro..."
          className="h-12 pl-11 pr-10 text-base"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-sky" />
        )}
      </div>

      {open && hits.length > 0 && (
        <ul className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-border bg-white p-1 shadow-lg">
          {hits.map((h) => (
            <li key={h.code}>
              <button
                type="button"
                onClick={() => go(h.code)}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-sky/10"
              >
                <span className="text-sm font-medium text-ocean">{h.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">CBO {h.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
