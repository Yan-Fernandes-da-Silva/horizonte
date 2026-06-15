"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddTaskForm({ planId, category }: { planId: string; category: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const add = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/career-plan/${planId}/task`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ category, title }),
      });
      if (!res.ok) throw new Error();
      setTitle("");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Não foi possível adicionar a tarefa.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-sky/50 hover:text-sky"
      >
        <Plus className="h-4 w-4" /> Adicionar tarefa
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && add()}
        placeholder="Nova tarefa…"
      />
      <Button size="sm" onClick={add} disabled={busy} className="bg-gold text-ocean hover:bg-gold-dark hover:text-white">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      </Button>
      <Button size="sm" variant="outline" onClick={() => setOpen(false)} className="border-ocean/30 text-ocean">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
