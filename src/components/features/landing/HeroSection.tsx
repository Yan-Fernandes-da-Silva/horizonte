"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { Logo } from "@/components/shared/Logo";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";

/** A flat, fluffy cloud drawn from overlapping shapes. */
function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" fill="currentColor" aria-hidden className={className}>
      <ellipse cx="42" cy="42" rx="32" ry="17" />
      <circle cx="58" cy="30" r="22" />
      <circle cx="84" cy="38" r="17" />
      <rect x="34" y="38" width="62" height="15" rx="7.5" />
    </svg>
  );
}

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };
  const item: Variants = {
    hidden: shouldReduceMotion ? {} : { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-sky-day">
      {/* Drifting clouds — pushed to the sides so they clear the centred content,
          with varied sizes/positions so the two sides don't mirror each other. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 text-white">
        <Cloud className="absolute left-[1%] top-[10%] w-36 opacity-90 animate-drift sm:w-52" />
        <Cloud className="absolute left-[3%] top-[64%] w-24 opacity-70 animate-drift sm:w-32" />
        <Cloud className="absolute right-[2%] top-[26%] w-44 opacity-85 animate-drift sm:w-60" />
        <Cloud className="absolute right-[7%] top-[74%] w-20 opacity-65 animate-drift sm:w-28" />
      </div>

      <PageContainer className="relative flex flex-1 flex-col items-center justify-center py-24 text-center text-white">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={item}>
            <Logo className="h-24 w-24 animate-float text-helm drop-shadow-md sm:h-28 sm:w-28" />
          </motion.div>
          <motion.h1
            variants={item}
            className="mt-6 text-5xl font-bold tracking-tight text-white drop-shadow sm:text-6xl lg:text-7xl"
          >
            Horizonte
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-4 max-w-xl text-lg font-medium text-white drop-shadow sm:text-xl"
          >
            Acompanhamento inteligente da sua carreira profissional.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="bg-gold px-8 text-ocean shadow-md hover:bg-gold-dark hover:text-white"
            >
              <Link href="/register">Começar agora</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-ocean/30 bg-white/50 px-8 text-ocean backdrop-blur-sm hover:bg-white/70 hover:text-ocean"
            >
              <Link href="/login">Já tenho conta</Link>
            </Button>
          </motion.div>
        </motion.div>
      </PageContainer>
    </section>
  );
}
