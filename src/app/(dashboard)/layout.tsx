import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Phase 02 will enable the real authentication gate:
//   import { getServerSession } from "next-auth";
//   import { redirect } from "next/navigation";
//   import { authOptions } from "@/lib/auth";
//   const session = await getServerSession(authOptions);
//   if (!session) redirect("/login");

// Temporary mock user so the post-login layout can be reviewed before
// authentication is wired up in Phase 02.
const mockUser = { name: "Yan", email: "yan@horizonte.dev", avatar: null };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-sand/40">
      <Header variant="dashboard" user={mockUser} />
      <main className="flex-1 py-8">{children}</main>
      <Footer />
    </div>
  );
}
