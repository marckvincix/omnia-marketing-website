"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FaqInput } from "@/lib/validation/admin";
import { saveFaq } from "./actions";

const empty: FaqInput = { question: "", answer: "", serviceId: "", published: true };

export function FaqForm({
  trigger,
  initial,
  serviceOptions,
}: {
  trigger: React.ReactNode;
  initial?: FaqInput;
  serviceOptions: { id: string; title: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FaqInput>(initial ?? empty);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setForm(initial ?? empty);
    setError(null);
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        await saveFaq(form);
        setOpen(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Errore durante il salvataggio");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Modifica FAQ" : "Nuova FAQ"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="f-question">Domanda</Label>
            <Input id="f-question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          </div>

          <div>
            <Label htmlFor="f-answer">Risposta</Label>
            <Textarea id="f-answer" rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
          </div>

          <div>
            <Label>Servizio collegato (facoltativo)</Label>
            <Select
              value={form.serviceId || "none"}
              onValueChange={(v) => setForm({ ...form, serviceId: !v || v === "none" ? "" : v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Generale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Generale</SelectItem>
                {serviceOptions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="f-published" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
            <Label htmlFor="f-published">Pubblicata</Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Salva
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
