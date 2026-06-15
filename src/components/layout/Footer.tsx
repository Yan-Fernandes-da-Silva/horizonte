import Link from "next/link";

// Repo URL — update once the GitHub remote is confirmed.
const GITHUB_URL = "https://github.com";

// Inline GitHub mark (lucide-react dropped brand icons in recent versions).
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A11.53 11.53 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-ocean text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
        <Link
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-sky-light"
        >
          <GithubIcon className="h-5 w-5" />
          Código no GitHub
        </Link>
        <div className="sm:text-right">
          <p className="text-lg font-bold">Horizonte</p>
          <p className="text-sm text-white/70">
            Acompanhamento inteligente da sua carreira profissional
          </p>
        </div>
      </div>
    </footer>
  );
}
