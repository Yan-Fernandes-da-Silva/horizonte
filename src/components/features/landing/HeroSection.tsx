"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "./WaveDivider";

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
    <section className="relative overflow-hidden bg-ocean-gradient-animated">
      {/* Decorative nautical map grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      {/* Faint compass rings */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 text-sky-light opacity-10 sm:h-96 sm:w-96"
      >
        <circle cx="100" cy="100" r="90" />
        <circle cx="100" cy="100" r="64" />
        <circle cx="100" cy="100" r="38" />
        <line x1="100" y1="0" x2="100" y2="200" />
        <line x1="0" y1="100" x2="200" y2="100" />
      </svg>

      <PageContainer className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-24 text-center text-white">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={item}>
            <Logo className="h-16 w-16 animate-float text-gold sm:h-20 sm:w-20" />
          </motion.div>
          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Horizonte
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-4 max-w-xl text-lg text-sky-lighter sm:text-xl"
          >
            Acompanhamento inteligente da sua carreira profissional.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="group bg-gold text-ocean hover:bg-gold-dark hover:text-white"
            >
              <Link href="/register">
                Começar agora
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/login">Já tenho conta</Link>
            </Button>
          </motion.div>
        </motion.div>
      </PageContainer>

      <WaveDivider />
    </section>
  );
}
