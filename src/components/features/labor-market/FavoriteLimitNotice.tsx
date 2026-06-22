"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert, X } from "lucide-react";

/**
 * Bottom-right notice (above the footer) shown when the user hits the favorites
 * cap. Uses the same solid ocean-blue / white look as the header and footer.
 * Triggered from anywhere via `window` event `favorites:limit`.
 */
export function FavoriteLimitNotice() {
  const [message, setMessage] = React.useState<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => {
    const onLimit = (e: Event) => {
      const detail = (e as CustomEvent<{ message?: string }>).detail;
      setMessage(detail?.message ?? "Limite de favoritos atingido.");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(null), 5000);
    };
    window.addEventListener("favorites:limit", onLimit);
    return () => {
      window.removeEventListener("favorites:limit", onLimit);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-20 right-4 z-50 flex max-w-xs items-start gap-3 rounded-xl border border-white/10 bg-ocean px-4 py-3 text-white shadow-lg sm:right-6"
        >
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <p className="text-sm leading-snug">{message}</p>
          <button
            type="button"
            onClick={() => setMessage(null)}
            aria-label="Fechar aviso"
            className="ml-1 shrink-0 text-white/70 transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
