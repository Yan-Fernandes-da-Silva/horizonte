import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { User } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageContainer } from "@/components/shared/PageContainer";
import { ProfileForm } from "@/components/features/profile/ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!session?.user || !userId) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, avatar: true },
  });
  if (!user) {
    redirect("/");
  }

  return (
    <div className="-my-8 flex-1 bg-sea-top py-8">
      <PageContainer className="max-w-2xl space-y-6">
        <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-6 text-white shadow-sm backdrop-blur-sm sm:px-10">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 shrink-0 text-gold" />
            <h1 className="text-2xl font-bold sm:text-3xl">Meu perfil</h1>
          </div>
        </div>
        <ProfileForm
          initialName={user.name}
          initialEmail={user.email}
          initialAvatar={user.avatar}
        />
      </PageContainer>
    </div>
  );
}
