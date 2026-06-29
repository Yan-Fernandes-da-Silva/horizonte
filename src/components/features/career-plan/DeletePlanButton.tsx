"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

/** Footer action on the roadmap page: delete the current plan to start a new one. */
export function DeletePlanButton({ planId }: { planId: string }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const remove = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/career-plan/${planId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Plano excluído. Você já pode criar um novo.");
      // Back to the entry page — with no plan, it shows the "Criar plano" panel.
      router.push("/career-plan");
      router.refresh();
    } catch {
      toast.error("Não foi possível excluir o plano.");
      setBusy(false);
    }
  };

  return (
    <div className="mt-4 border-t border-white/15 pt-6 text-center">
      <p className="text-sm text-white/70">
        Quer recomeçar? Exclua este plano para criar um novo.
      </p>
      <Button
        onClick={() => setConfirmOpen(true)}
        className="mt-3 bg-red-600 text-white hover:bg-red-700"
      >
        <Trash2 className="h-4 w-4" /> Excluir plano
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir plano de carreira?</DialogTitle>
            <DialogDescription>
              O plano e todas as suas tarefas serão removidos. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} className="border-ocean/30 text-ocean">
              Cancelar
            </Button>
            <Button onClick={remove} disabled={busy} className="bg-red-600 text-white hover:bg-red-700">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Excluir plano
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
