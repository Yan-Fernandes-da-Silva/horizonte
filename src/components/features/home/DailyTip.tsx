import { Lightbulb } from "lucide-react";

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

export function DailyTip() {
  const tip = tips[new Date().getDay() % tips.length];

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gold/30 bg-gold/10 px-6 py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold-dark">
        <Lightbulb className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-dark">
          Dica do dia
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ocean">{tip}</p>
      </div>
    </div>
  );
}
