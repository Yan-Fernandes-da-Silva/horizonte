import Link from "next/link";

import { Logo } from "@/components/shared/Logo";

/**
 * Brand lockup shown inside the auth cards (login / register / forgot).
 * Brown ship's-wheel logo + dark "Horizonte" wordmark, linking back to the
 * landing page.
 */
export function AuthBrand() {
  return (
    <Link
      href="/"
      className="mb-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
    >
      <Logo className="h-8 w-8 text-helm" />
      <span className="text-2xl font-bold text-ocean">Horizonte</span>
    </Link>
  );
}
