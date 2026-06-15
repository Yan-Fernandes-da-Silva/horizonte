import { ChartColumnIncreasing, Compass, Route } from "lucide-react";

import { PageContainer } from "@/components/shared/PageContainer";
import { Reveal } from "@/components/shared/Reveal";

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
      "Descubra seu perfil, suas forças e as profissões mais compatíveis com quem você é.",
  },
  {
    icon: ChartColumnIncreasing,
    title: "Mercado de Trabalho",
    description:
      "Explore dados reais do mercado brasileiro: salários, demanda e tendências por profissão.",
  },
  {
    icon: Route,
    title: "Plano de Carreira",
    description:
      "Receba um roadmap personalizado e acompanhe seu progresso com metas claras.",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-sand py-20 sm:py-28">
      <PageContainer>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ocean sm:text-4xl">
            Tudo que você precisa para decolar na carreira
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.12}>
              <FeatureCard {...feature} />
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description }: Feature) {
  return (
    <div className="group h-full rounded-2xl border border-white/60 bg-white/70 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-ocean-gradient text-white shadow-md transition-transform duration-300 group-hover:scale-105">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-ocean">{title}</h3>
      <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
