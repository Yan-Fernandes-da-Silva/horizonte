import Link from "next/link";

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

export function FinalCtaSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Nautical backdrop: a large sky on top and a smaller sea band below. */}
      <div aria-hidden className="absolute inset-0">
        {/* Sky (dominant) */}
        <div className="absolute inset-x-0 top-0 h-[72%] bg-sky-day" />
        {/* Clouds */}
        <div className="absolute inset-x-0 top-0 h-[72%] text-white">
          <Cloud className="absolute left-[6%] top-[12%] w-32 opacity-85 animate-drift sm:w-44" />
          <Cloud className="absolute right-[8%] top-[22%] w-24 opacity-75 animate-drift sm:w-32" />
        </div>
        {/* Sea (smaller band at the bottom) */}
        <div className="absolute inset-x-0 top-[72%] bottom-0 bg-sea" />
        {/* Horizon haze where sky meets sea */}
        <div className="absolute inset-x-0 top-[72%] h-16 -translate-y-1/2 bg-gradient-to-b from-sky-light/40 to-transparent" />
      </div>

      <PageContainer className="relative text-center">
        {/* Content sits on the sky, so it uses dark (ocean) text. */}
        <div className="mx-auto mb-[18%] max-w-2xl text-ocean">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pronto para encontrar seu caminho?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ocean/80">
            Comece agora e descubra para onde o seu horizonte aponta.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="bg-ocean px-8 text-white shadow-lg hover:bg-ocean-500"
            >
              <Link href="/register">Criar minha conta</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
