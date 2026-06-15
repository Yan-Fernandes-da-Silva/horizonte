import Link from "next/link";

import { Logo } from "@/components/shared/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ocean-gradient-animated p-4">
      <Link href="/" className="flex items-center gap-2 text-white">
        <Logo className="h-8 w-8" />
        <span className="text-2xl font-bold">Horizonte</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
