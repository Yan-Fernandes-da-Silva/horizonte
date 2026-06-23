"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Warns the user before they navigate away mid-creation (and lose all progress).
 * - `beforeunload` covers tab close / refresh.
 * - A capture-phase click listener catches clicks on internal links (header, etc.)
 *   and shows a centered confirm modal. Links meant to be followed from inside the
 *   flow can opt out with `data-allow-nav`.
 * Known limitation: doesn't intercept the browser back/forward button.
 */
export function NavigationGuard({ active }: { active: boolean }) {
  const router = useRouter();
  const [pending, setPending] = React.useState<string | null>(null);
  const bypass = React.useRef(false);

  React.useEffect(() => {
    if (!active) return;

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const onClick = (e: MouseEvent) => {
      if (bypass.current || e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor || anchor.hasAttribute("data-allow-nav")) return;
      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");
      if (!href || target === "_blank" || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) {
        return;
      }
      // Internal navigation — intercept and confirm.
      e.preventDefault();
      e.stopPropagation();
      setPending(href);
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [active]);

  const leave = () => {
    bypass.current = true;
    const href = pending;
    setPending(null);
    if (href) router.push(href);
  };

  if (!pending) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ocean/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-ocean p-6 text-center text-white shadow-xl">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sun/20">
          <AlertTriangle className="h-6 w-6 text-sun" />
        </span>
        <h2 className="mt-4 text-lg font-bold">Sair vai apagar seu progresso</h2>
        <p className="mt-2 text-sm text-white/80">
          Se você sair agora, perderá todo o progresso de criação do plano de carreira e terá
          que recomeçar do zero.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={() => setPending(null)}
            className="flex-1 bg-gold text-ocean hover:bg-gold-dark hover:text-white"
          >
            Continuar criando
          </Button>
          <Button
            onClick={leave}
            variant="outline"
            className="flex-1 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            Sair mesmo assim
          </Button>
        </div>
      </div>
    </div>
  );
}
