"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Motivation } from "@/lib/vocational-test/motivation";

interface Props {
  motivation: Motivation;
  /** Whether this transition leads to the results (last section). */
  isLast: boolean;
  loading?: boolean;
  onContinue: () => void;
}

/** Encouraging interstitial shown between sections, themed like the home panels. */
export function SectionTransition({ motivation, isLast, loading, onContinue }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-xl rounded-2xl border border-white/15 bg-white/10 p-8 text-center text-white shadow-sm backdrop-blur-sm"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/20">
        <Sparkles className="h-7 w-7 text-gold" />
      </span>
      <h2 className="mt-4 text-xl font-bold sm:text-2xl">{motivation.title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-white/80">{motivation.message}</p>
      <Button
        type="button"
        onClick={onContinue}
        disabled={loading}
        className="mt-6 bg-gold text-ocean hover:bg-gold-dark hover:text-white"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {isLast ? "Ver resultados" : "Continuar"}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </Button>
    </motion.div>
  );
}
