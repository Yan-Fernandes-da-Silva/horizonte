"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export interface TaskData {
  id: string;
  title: string;
  description: string | null;
  status: string;
}

export function TaskItem({ planId, task }: { planId: string; task: TaskData }) {
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [title, setTitle] = React.useState(task.title);
  const [description, setDescription] = React.useState(task.description ?? "");
  const [busy, setBusy] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const done = task.status === "completed";
  const base = `/api/career-plan/${planId}/task/${task.id}`;

  const patch = async (body: object) => {
    setBusy(true);
    try {
      const res = await fetch(base, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      toast.error("Não foi possível salvar a alteração.");
    } finally {
      setBusy(false);
    }
  };

  const toggle = () => patch({ status: done ? "pending" : "completed" });

  const saveEdit = async () => {
    if (!title.trim()) return;
    await patch({ title, description });
    setEditing(false);
  };

  const remove = async () => {
    setBusy(true);
    try {
      const res = await fetch(base, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setConfirmOpen(false);
      router.refresh();
      toast.success("Tarefa excluída.");
    } catch {
      toast.error("Não foi possível excluir a tarefa.");
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <div className="rounded-xl border border-sky/40 bg-white p-4">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da tarefa" className="mb-2" />
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição (opcional)" rows={2} />
        <div className="mt-2 flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="border-ocean/30 text-ocean">
            <X className="h-4 w-4" /> Cancelar
          </Button>
          <Button size="sm" onClick={saveEdit} disabled={busy} className="bg-gold text-ocean hover:bg-gold-dark hover:text-white">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Salvar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-3 rounded-xl border border-border bg-white p-4">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-label={done ? "Marcar como pendente" : "Marcar como concluída"}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
          done ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground/40 hover:border-sky"
        )}
      >
        {done && <Check className="h-3.5 w-3.5" />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium text-ocean", done && "text-muted-foreground line-through")}>{task.title}</p>
        {task.description && <p className="mt-0.5 text-xs text-muted-foreground">{task.description}</p>}
      </div>

      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button type="button" onClick={() => setEditing(true)} aria-label="Editar" className="rounded p-1 text-muted-foreground hover:bg-sky/10 hover:text-sky">
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => setConfirmOpen(true)} aria-label="Excluir" className="rounded p-1 text-muted-foreground hover:bg-sun/10 hover:text-sun">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir tarefa?</DialogTitle>
            <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} className="border-ocean/30 text-ocean">Cancelar</Button>
            <Button onClick={remove} disabled={busy} className="bg-sun text-white hover:bg-sun/90">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
