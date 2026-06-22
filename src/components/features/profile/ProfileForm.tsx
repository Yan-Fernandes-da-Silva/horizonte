"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { AVATARS } from "@/lib/avatars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileFormProps {
  initialName: string;
  initialEmail: string;
  initialAvatar: string | null;
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

export function ProfileForm({
  initialName,
  initialEmail,
  initialAvatar,
}: ProfileFormProps) {
  const router = useRouter();

  // Account section
  const [name, setName] = React.useState(initialName);
  const [email, setEmail] = React.useState(initialEmail);
  const [avatar, setAvatar] = React.useState<string | null>(initialAvatar);
  const [savingAccount, setSavingAccount] = React.useState(false);

  // Password section
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [savingPassword, setSavingPassword] = React.useState(false);

  // Danger zone
  const [confirmingDelete, setConfirmingDelete] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  async function saveAccount(e: React.FormEvent) {
    e.preventDefault();
    setSavingAccount(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, avatar }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Não foi possível salvar.");
        return;
      }
      toast.success("Perfil atualizado!");
      router.refresh();
    } catch {
      toast.error("Não foi possível salvar. Tente novamente.");
    } finally {
      setSavingAccount(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setSavingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Não foi possível trocar a senha.");
        return;
      }
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      toast.error("Não foi possível trocar a senha. Tente novamente.");
    } finally {
      setSavingPassword(false);
    }
  }

  async function deleteAccount() {
    setDeleting(true);
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Não foi possível excluir a conta.");
        setDeleting(false);
        return;
      }
      await signOut({ callbackUrl: "/" });
    } catch {
      toast.error("Não foi possível excluir a conta. Tente novamente.");
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Account data + avatar */}
      <Card className="border-white/15 bg-white/10 text-white shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Dados da conta</CardTitle>
          <CardDescription className="text-white/70">
            Atualize seu avatar, nome e e-mail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveAccount} className="space-y-6" noValidate>
            {/* Avatar picker */}
            <div className="space-y-3">
              <Label className="text-white">Avatar</Label>
              <div className="flex flex-wrap items-center gap-3">
                {AVATARS.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setAvatar(src)}
                    aria-label="Selecionar avatar"
                    aria-pressed={avatar === src}
                    className={cn(
                      "overflow-hidden rounded-full ring-2 transition",
                      avatar === src
                        ? "ring-sky ring-offset-2"
                        : "ring-transparent hover:ring-border"
                    )}
                  >
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={src} alt="" />
                      <AvatarFallback>{getInitials(name)}</AvatarFallback>
                    </Avatar>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-white">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="João da Silva"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="joao@dominio.com"
              />
            </div>

            <Button
              type="submit"
              disabled={savingAccount}
              className="bg-gold text-ocean hover:bg-gold-dark hover:text-white"
            >
              {savingAccount ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando…
                </>
              ) : (
                "Salvar alterações"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="border-white/15 bg-white/10 text-white shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Trocar senha</CardTitle>
          <CardDescription className="text-white/70">
            Informe a senha atual e a nova senha (mín. 8 caracteres, 1 maiúscula
            e 1 número).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={savePassword} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword" className="text-white">Senha atual</Label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite a senha atual"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-white">Nova senha</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
              />
            </div>
            <Button
              type="submit"
              disabled={savingPassword}
              className="bg-gold text-ocean hover:bg-gold-dark hover:text-white"
            >
              {savingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando…
                </>
              ) : (
                "Trocar senha"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-400/40 bg-white/10 text-white shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-red-300">Excluir conta</CardTitle>
          <CardDescription className="text-white/70">
            Esta ação é permanente e apaga todos os seus dados (testes,
            favoritos e planos). Não dá para desfazer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {confirmingDelete ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="destructive"
                disabled={deleting}
                onClick={deleteAccount}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Excluindo…
                  </>
                ) : (
                  "Sim, excluir minha conta"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={deleting}
                onClick={() => setConfirmingDelete(false)}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setConfirmingDelete(true)}
            >
              Excluir minha conta
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
