import { Lightbulb } from "lucide-react";

interface WelcomeBannerProps {
  name: string;
}

// Time-based greeting using the server's clock.
function getGreeting(hour: number): string {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

// One tip per day of the week (Date.getDay() → 0..6).
const tips = [
  "Networking não é sobre quantidade de contatos, mas sobre qualidade das relações.",
  "Profissionalizar seu LinkedIn pode aumentar em até 40% suas chances de ser encontrado por recrutadores.",
  "Dominar um segundo idioma pode aumentar seu salário em até 20% em algumas áreas.",
  "Soft skills como comunicação e resolução de conflitos são cada vez mais valorizadas.",
  "Atualizar seu portfólio a cada 3 meses mantém você competitivo no mercado.",
  "Definir metas SMART ajuda a transformar sonhos profissionais em planos concretos.",
  "Aprender novas ferramentas tecnológicas em sua área pode ser o diferencial que você precisa.",
];

/**
 * Welcome + daily tip merged into a single solid-blue banner:
 * greeting on the left, tip on the right (stacks on mobile).
 */
export function WelcomeBanner({ name }: WelcomeBannerProps) {
  const greeting = getGreeting(new Date().getHours());
  const firstName = name.trim().split(/\s+/)[0] || name;
  const tip = tips[new Date().getDay() % tips.length];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 px-6 py-8 text-white shadow-sm backdrop-blur-sm sm:px-10 sm:py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
        {/* Welcome (left) */}
        <div className="md:flex-1">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {greeting}, {firstName}!
          </h1>
          <p className="mt-2 text-white/80">
            Aqui está um resumo da sua jornada no Horizonte.
          </p>
        </div>

        {/* Daily tip (right) — icon + title on top, phrase below, no sub-box */}
        <div className="md:max-w-sm">
          <div className="flex items-center gap-2 text-gold">
            <Lightbulb className="h-5 w-5 shrink-0" />
            <p className="text-xs font-semibold uppercase tracking-wide">
              Dica do dia
            </p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/90">{tip}</p>
        </div>
      </div>
    </div>
  );
}
