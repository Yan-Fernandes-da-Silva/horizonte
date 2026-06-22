import { ChartColumnIncreasing, Compass, Route } from "lucide-react";

import { PageContainer } from "@/components/shared/PageContainer";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Compass,
    title: "Teste Vocacional",
    description:
      "Descubra seu perfil, interesses e objetivos relacionados com as qualificações e profissões mais compatíveis com quem você é.",
  },
  {
    icon: ChartColumnIncreasing,
    title: "Mercado de Trabalho",
    description:
      "Explore dados e tendências reais do mercado de trabalho brasileiro e analise como está as profissões de diferentes áreas.",
  },
  {
    icon: Route,
    title: "Plano de Carreira",
    description:
      "Receba um itinerário personalizado e customizável para sua carreira profissional e acompanhe seu progresso com metas claras.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#FFDCB6] py-24">
      {/* Sea edge meeting the sand (transition from the About sea) */}
      <ShoreEdge />

      <PageContainer className="relative">
        <h2 className="mx-auto max-w-5xl text-center text-3xl font-bold tracking-tight text-ocean sm:text-4xl lg:whitespace-nowrap">
          Tudo que você precisa para decolar na carreira
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

/** The sea's edge meeting the sand (no white foam). */
function ShoreEdge() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0">
      {/* Sea band */}
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-16 w-full sm:h-24"
        fill="#0a4f86"
      >
        <path d="M0,0 L1440,0 L1440,60 C1200,96 960,40 720,64 C480,88 240,40 0,72 Z" />
      </svg>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: Feature) {
  return (
    <div className="group h-full rounded-2xl border border-helm/20 bg-[#e0a560] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-ocean-gradient text-white shadow-md transition-transform duration-300 group-hover:scale-105">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-ocean">{title}</h3>
      <p className="mt-3 leading-relaxed text-justify text-ocean">{description}</p>
    </div>
  );
}
