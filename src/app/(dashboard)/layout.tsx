import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Belt-and-suspenders: middleware already guards these routes.
  if (!session?.user) {
    redirect("/login");
  }

  const user = {
    name: session.user.name ?? "Usuário",
    email: session.user.email ?? undefined,
    avatar: session.user.image ?? null,
  };

  return (
    <div className="flex min-h-screen flex-col bg-sand/40">
      <Header variant="dashboard" user={user} />
      <main className="flex-1 py-8">{children}</main>
      <Footer />
    </div>
  );
}
