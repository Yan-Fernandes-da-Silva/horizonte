import { Logo } from "@/components/shared/Logo";
import { PageContainer } from "@/components/shared/PageContainer";
import { Reveal } from "@/components/shared/Reveal";

export function AboutSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <PageContainer>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-sky">
              Nossa missão
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ocean sm:text-4xl">
              Seu copiloto de carreira profissional
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              O Horizonte foi feito para quem está dando os primeiros passos e
              também para quem quer mudar de direção. Reunimos o seu perfil
              pessoal e dados reais do mercado de trabalho brasileiro para te
              ajudar a decidir com clareza.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Nada de achismo: você descobre as suas forças, entende as
              oportunidades e recebe um caminho concreto para chegar aonde quer.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="flex justify-center">
            <AboutGraphic />
          </Reveal>
        </div>
      </PageContainer>
    </section>
  );
}

/** Code-drawn nautical compass — no image asset, keeps the page light. */
function AboutGraphic() {
  return (
    <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
      <div className="absolute inset-0 rounded-full bg-ocean-gradient" />
      <div className="absolute inset-0 rounded-full bg-sky/30 blur-2xl" />
      <svg
        viewBox="0 0 240 240"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        aria-hidden
        className="absolute inset-0 h-full w-full text-white/30"
      >
        <circle cx="120" cy="120" r="110" />
        <circle cx="120" cy="120" r="84" strokeDasharray="4 6" />
        <circle cx="120" cy="120" r="58" />
      </svg>
      <Logo className="relative h-28 w-28 animate-float text-gold sm:h-32 sm:w-32" />
    </div>
  );
}
