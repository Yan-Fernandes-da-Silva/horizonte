export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-night-sea p-4 lg:justify-end lg:pr-[8%]">
      {/* Starry glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[12%] top-[10%] h-24 w-24 rounded-full bg-sky-light/20 blur-2xl"
      />

      {/* Lighthouse on the left (desktop only) */}
      <Lighthouse />

      {/* Waves along the entire bottom */}
      <Waves />

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}

/** Flat lighthouse at night, standing on the rocks with a single light beam. */
function Lighthouse() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-0 hidden h-[80vh] w-[40%] items-end justify-center lg:flex"
    >
      <svg
        viewBox="0 0 200 360"
        preserveAspectRatio="xMidYMax meet"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Single light beam */}
        <path d="M100 66 L200 30 L200 110 Z" fill="#F4A261" opacity="0.22" />

        {/* Rocks anchored to the ground (bottom of the viewBox) */}
        <path
          d="M10 360 L10 320 Q55 286 100 312 Q150 284 190 322 L190 360 Z"
          fill="#06182f"
        />
        {/* Tower — base sits into the rocks */}
        <path d="M84 92 L116 92 L124 326 L76 326 Z" fill="#13314f" />
        {/* Red stripes */}
        <path d="M82 132 L118 132 L120 166 L80 166 Z" fill="#E76F51" opacity="0.9" />
        <path d="M78 226 L122 226 L124 260 L76 260 Z" fill="#E76F51" opacity="0.9" />
        {/* Gallery + lantern room */}
        <rect x="76" y="80" width="48" height="12" rx="2" fill="#0a2342" />
        <rect x="88" y="56" width="24" height="26" rx="2" fill="#F4A261" />
        {/* Lantern light dot */}
        <circle cx="100" cy="69" r="6" fill="#FFF6E5" />
      </svg>
    </div>
  );
}

/** Layered waves across the bottom of the page. */
function Waves() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-20 w-full animate-sway text-sky/20 sm:h-28"
        fill="currentColor"
      >
        <path d="M0,50 C240,90 480,20 720,52 C960,84 1200,104 1440,58 L1440,120 L0,120 Z" />
      </svg>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute bottom-0 block h-14 w-full animate-wave text-sky-light/10 sm:h-20"
        fill="currentColor"
      >
        <path d="M0,70 C260,30 520,110 760,72 C1000,36 1220,70 1440,84 L1440,120 L0,120 Z" />
      </svg>
    </div>
  );
}
