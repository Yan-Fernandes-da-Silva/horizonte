import { ClipboardList, Target, TrendingUp } from "lucide-react";

import { PageContainer } from "@/components/shared/PageContainer";

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
      "Responda perguntas sobre interesses e objetivos. Leva cerca de 10 minutos.",
  },
  {
    number: "2",
    icon: TrendingUp,
    title: "Explore o mercado de trabalho",
    description:
      "Veja como está a demanda, os salários e o perfil profissional de cada profissão que te interessa.",
  },
  {
    number: "3",
    icon: Target,
    title: "Monte seu plano de carreira",
    description:
      "Gerencie seu itinerário, customize metas e prazos, acompanhe o progresso do seu plano.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-sea-top text-white">
      {/* Beach + small port at the top — transition from the Features sand */}
      <PortTop />

      <PageContainer className="relative pb-16 pt-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Como funciona
        </h2>
        <p className="mt-3 text-lg font-semibold uppercase tracking-widest text-gold sm:text-xl">
          3 passos simples
        </p>
      </PageContainer>

      {/* Maritime route weaving down the sea, one full screen per step */}
      <div className="relative mx-auto max-w-3xl px-4">
        <RouteCurve />
        <div className="relative">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex min-h-[58vh] flex-col items-center justify-center"
            >
              <StepItem {...step} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepItem({ number, icon: Icon, title, description }: Step) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gold text-3xl font-bold text-ocean shadow-lg">
        {number}
      </div>
      <div className="mt-6 w-full max-w-2xl rounded-3xl border border-white/15 bg-white/10 p-10 backdrop-blur-sm sm:p-12">
        <Icon className="mx-auto h-9 w-9 text-gold" />
        <h3 className="mt-4 text-2xl font-bold sm:text-3xl">{title}</h3>
        <p className="mt-4 text-lg leading-relaxed text-sky-lighter/90">
          {description}
        </p>
      </div>
    </div>
  );
}

/** Curved dashed maritime route weaving between the three steps. */
function RouteCurve() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 300"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      fill="none"
    >
      <path
        d="M50,0 L50,300"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="12 12"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A strip of beach sand with a small pier where the route begins. */
function PortTop() {
  return (
    <div aria-hidden className="pointer-events-none relative">
      {/* Sand band */}
      <div className="relative h-20 bg-beach sm:h-24">
        {/* Sea edge eating into the sand */}
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 block h-8 w-full sm:h-10"
          fill="#0a4f86"
        >
          <path d="M0,60 L1440,60 L1440,28 C1200,4 960,52 720,30 C480,8 240,48 0,26 Z" />
        </svg>
        {/* Pier / dock, centred, reaching down into the sea */}
        <div className="absolute left-1/2 top-6 h-16 w-10 -translate-x-1/2">
          <div className="mx-auto h-full w-3 rounded-sm bg-helm-dark" />
          <div className="absolute left-1/2 top-2 h-1.5 w-9 -translate-x-1/2 rounded-sm bg-helm" />
          <div className="absolute left-1/2 top-6 h-1.5 w-9 -translate-x-1/2 rounded-sm bg-helm" />
        </div>
      </div>
    </div>
  );
}
