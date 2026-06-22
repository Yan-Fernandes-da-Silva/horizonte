import { PageContainer } from "@/components/shared/PageContainer";

export function AboutSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-sea py-24 text-white">
      {/* Horizon haze where the sky meets the sea (transition from the Hero) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sky-light/40 to-transparent"
      />

      <PageContainer className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex justify-center">
            <Compass />
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Seu copiloto de carreira profissional
            </h2>
            <p className="mt-6 text-justify text-lg leading-relaxed text-sky-lighter">
              Primeiro emprego ou transição de carreira? O Horizonte te guia.
              Combinamos o seu perfil com dados reais do mercado de trabalho
              brasileiro para criar o seu plano de carreira ideal e direcionar
              seu próximo passo profissional com clareza e segurança.
            </p>
          </div>
        </div>
      </PageContainer>

      {/* Gentle sea waves drifting near the bottom */}
      <SeaWaves />
    </section>
  );
}

/** Code-drawn nautical compass rose. */
function Compass() {
  return (
    <div className="relative h-72 w-72 sm:h-80 sm:w-80">
      <div className="absolute inset-0 rounded-full bg-ocean/40 blur-2xl" />
      <svg
        viewBox="0 0 240 240"
        className="relative h-full w-full animate-float"
        aria-hidden
      >
        {/* Outer rings */}
        <circle cx="120" cy="120" r="112" fill="#0a2342" stroke="#90E0EF" strokeWidth="2" />
        <circle cx="120" cy="120" r="96" fill="none" stroke="#90E0EF" strokeWidth="1" opacity="0.5" />
        <circle cx="120" cy="120" r="70" fill="none" stroke="#90E0EF" strokeWidth="1" opacity="0.4" />

        {/* Tick marks around the rim */}
        <g stroke="#CAF0F8" strokeWidth="1.5" opacity="0.7">
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const r1 = 96;
            const r2 = i % 2 === 0 ? 106 : 102;
            return (
              <line
                key={i}
                x1={120 + r1 * Math.cos(angle)}
                y1={120 + r1 * Math.sin(angle)}
                x2={120 + r2 * Math.cos(angle)}
                y2={120 + r2 * Math.sin(angle)}
              />
            );
          })}
        </g>

        {/* Compass star (N/E/S/W points) */}
        <g>
          {/* N (gold) */}
          <polygon points="120,28 132,120 120,108 108,120" fill="#F4A261" />
          <polygon points="120,212 108,120 120,132 132,120" fill="#CAF0F8" opacity="0.85" />
          <polygon points="28,120 120,108 108,120 120,132" fill="#90E0EF" />
          <polygon points="212,120 120,132 132,120 120,108" fill="#90E0EF" />
        </g>
        {/* Diagonal (minor) points */}
        <g fill="#90E0EF" opacity="0.55">
          <polygon points="120,120 64,64 120,108" />
          <polygon points="120,120 176,64 120,108" />
          <polygon points="120,120 64,176 120,132" />
          <polygon points="120,120 176,176 120,132" />
        </g>

        {/* Hub */}
        <circle cx="120" cy="120" r="8" fill="#F4A261" stroke="#0a2342" strokeWidth="2" />

        {/* Cardinal letters */}
        <g fill="#FFFFFF" fontSize="16" fontWeight="700" textAnchor="middle">
          <text x="120" y="20">N</text>
          <text x="120" y="234">S</text>
          <text x="226" y="126">L</text>
          <text x="14" y="126">O</text>
        </g>
      </svg>
    </div>
  );
}

/** Layered translucent waves that sway sideways. */
function SeaWaves() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-16 w-full animate-sway text-white/10 sm:h-24"
        fill="currentColor"
      >
        <path d="M0,40 C240,90 480,10 720,46 C960,82 1200,108 1440,52 L1440,120 L0,120 Z" />
      </svg>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute bottom-0 block h-12 w-full animate-wave text-white/10 sm:h-16"
        fill="currentColor"
      >
        <path d="M0,70 C260,30 520,110 760,72 C1000,36 1220,70 1440,84 L1440,120 L0,120 Z" />
      </svg>
    </div>
  );
}
