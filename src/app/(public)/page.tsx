import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { PageContainer } from "@/components/shared/PageContainer";

export default function LandingPage() {
  return (
    <section className="bg-ocean-gradient-animated">
      <PageContainer className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-20 text-center text-white">
        <Logo className="h-16 w-16 animate-float text-sky-light" />
        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">Horizonte</h1>
        <p className="mt-4 max-w-xl text-lg text-sky-lighter">
          Acompanhamento inteligente da sua carreira profissional.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-gold text-ocean hover:bg-gold-dark hover:text-white"
          >
            <Link href="/register">Começar agora</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/login">Já tenho conta</Link>
          </Button>
        </div>
        <p className="mt-10 text-sm text-white/60">
          A página completa de apresentação chega na Fase 03.
        </p>
      </PageContainer>
    </section>
  );
}
