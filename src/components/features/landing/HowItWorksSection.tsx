import { ClipboardList, Target, TrendingUp } from "lucide-react";

import { PageContainer } from "@/components/shared/PageContainer";
import { Reveal } from "@/components/shared/Reveal";

interface Step {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "1",
    icon: ClipboardList,
    title: "Faça o teste vocacional",
    description:
      "Responda perguntas sobre seus interesses, habilidades e valores. Leva cerca de 10 minutos.",
  },
  {
    number: "2",
    icon: TrendingUp,
    title: "Explore o mercado",
    description:
      "Veja como está a demanda, os salários e o perfil profissional de cada área que te interessa.",
  },
  {
    number: "3",
    icon: Target,
    title: "Monte seu plano",
    description:
      "Com base no seu perfil e no mercado, receba um roadmap personalizado para a sua carreira.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-ocean-gradient py-20 text-white sm:py-28">
      <PageContainer className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Como funciona
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Em 3 passos simples
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Dashed line connecting the steps (desktop only) */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-white/20 md:block"
          />
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.15} className="relative">
              <StepItem {...step} />
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

function StepItem({ number, icon: Icon, title, description }: Step) {
  return (
    <div className="flex flex-col items-center text-center md:items-start md:text-left">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl font-bold text-ocean shadow-lg ring-8 ring-ocean">
        {number}
      </div>
      <Icon className="mt-5 h-5 w-5 text-gold" />
      <h3 className="mt-2 text-xl font-bold">{title}</h3>
      <p className="mt-2 leading-relaxed text-sky-lighter/90">{description}</p>
    </div>
  );
}
