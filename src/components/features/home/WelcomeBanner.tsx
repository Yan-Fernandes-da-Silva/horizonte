interface WelcomeBannerProps {
  name: string;
}

// Time-based greeting using the server's clock.
function getGreeting(hour: number): string {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
  const greeting = getGreeting(new Date().getHours());
  const firstName = name.trim().split(/\s+/)[0] || name;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-ocean-gradient px-6 py-8 text-white shadow-md sm:px-10 sm:py-10">
      {/* Soft decorative glow — nautical horizon mood */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-sky/10 blur-2xl"
      />

      <h1 className="relative text-2xl font-bold sm:text-3xl">
        {greeting}, {firstName}! 👋
      </h1>
      <p className="relative mt-2 text-white/80">
        Aqui está um resumo da sua jornada no Horizonte.
      </p>
    </div>
  );
}
