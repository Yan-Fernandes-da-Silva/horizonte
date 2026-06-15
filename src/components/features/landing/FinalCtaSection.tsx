import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageContainer } from "@/components/shared/PageContainer";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="bg-gradient-to-br from-sky to-sky-light py-24 sm:py-32">
      <PageContainer className="text-center">
        <Reveal className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-ocean sm:text-4xl">
            Pronto para encontrar seu caminho?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ocean/80">
            É grátis, sem complicação. Comece agora e descubra para onde o seu
            horizonte aponta.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="group bg-ocean text-white hover:bg-ocean-500"
            >
              <Link href="/register">
                Criar minha conta
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
