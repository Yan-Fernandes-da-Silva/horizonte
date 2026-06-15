"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
}

/** Starts a fresh session (drops any unfinished one) then opens the first section. */
export function StartTestButton({ children, variant = "primary", className }: Props) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const start = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vocational-test/start", { method: "POST" });
      if (!res.ok) throw new Error();
      router.push("/vocational-test/riasec");
      router.refresh();
    } catch {
      setLoading(false);
      toast.error("Não foi possível iniciar o teste. Tente novamente.");
    }
  };

  return (
    <Button
      onClick={start}
      disabled={loading}
      variant={variant === "outline" ? "outline" : "default"}
      className={cn(
        variant === "primary"
          ? "bg-gold text-ocean hover:bg-gold-dark hover:text-white"
          : "border-ocean/30 text-ocean hover:bg-ocean/5",
        className
      )}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
