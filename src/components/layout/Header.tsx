"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, User, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderUser {
  name: string;
  email?: string;
  avatar?: string | null;
}

interface HeaderProps {
  variant: "public" | "dashboard";
  user?: HeaderUser;
}

const navLinks = [
  { href: "/vocational-test", label: "Teste Vocacional" },
  { href: "/labor-market", label: "Mercado de Trabalho" },
  { href: "/career-plan", label: "Plano de Carreira" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Header({ variant, user }: HeaderProps) {
  if (variant === "public") {
    return <PublicHeader />;
  }
  return <DashboardHeader user={user} />;
}

function PublicHeader() {
  // Hidden over the Hero; slides in once the user scrolls into the AboutSection,
  // and hides again when they scroll back to the top.
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ocean text-white shadow-md transition-transform duration-300",
        show ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7 text-helm" />
          <span className="text-xl font-bold text-white">Horizonte</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            asChild
            variant="outline"
            className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/login">Entrar</Link>
          </Button>
          <Button
            asChild
            className="bg-gold text-ocean hover:bg-gold-dark hover:text-white"
          >
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function DashboardHeader({ user }: { user?: HeaderUser }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const displayUser = user ?? { name: "Usuário", avatar: null };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Close the mobile drawer on Escape.
  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ocean text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/home" className="flex items-center gap-2 text-white">
          <Logo className="h-7 w-7 text-helm" />
          <span className="text-xl font-bold">Horizonte</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative py-1 text-sm font-medium text-white transition-colors"
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-gold" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop user menu */}
        <div className="hidden md:block">
          <UserMenu user={displayUser} />
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Abrir menu"
          className="rounded-md p-2 text-white md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <MobileDrawer
            user={displayUser}
            isActive={isActive}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

function UserMenu({ user }: { user: HeaderUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sky">
        <Avatar className="h-9 w-9 border border-white/20">
          {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
          <AvatarFallback className="bg-sky text-sm font-semibold text-ocean">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-[8rem] truncate text-sm font-medium">{user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            Meu perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileDrawer({
  user,
  isActive,
  onClose,
}: {
  user: HeaderUser;
  isActive: (href: string) => boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* Sliding panel */}
      <motion.aside
        className="absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col bg-ocean p-6 text-white shadow-xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white/20">
              {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
              <AvatarFallback className="bg-sky text-sm font-semibold text-ocean">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.name}</span>
          </div>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onClose}
            className="rounded-md p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-white/10 text-gold"
                  : "text-white/80 hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-4">
          <Link
            href="/profile"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5"
          >
            Meu perfil
          </Link>
          <button
            type="button"
            onClick={() => {
              onClose();
              signOut({ callbackUrl: "/" });
            }}
            className="rounded-lg px-3 py-2 text-left text-sm text-white/80 hover:bg-white/5"
          >
            Sair
          </button>
        </div>
      </motion.aside>
    </div>
  );
}
