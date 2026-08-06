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
import type { TestimonialInput } from "@/lib/validation/admin";
import { saveTestimonial } from "./actions";

const empty: TestimonialInput = {
  authorName: "",
  authorRole: "",
  company: "",
  quote: "",
  projectId: "",
  published: true,
};

export function TestimonialForm({
  trigger,
  initial,
  projectOptions,
}: {
  trigger: React.ReactNode;
  initial?: TestimonialInput;
  projectOptions: { id: string; client: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<TestimonialInput>(initial ?? empty);
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
        await saveTestimonial(form);
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
          <DialogTitle>{initial ? "Modifica testimonianza" : "Nuova testimonianza"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="t-author">Nome</Label>
              <Input id="t-author" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="t-role">Ruolo (facoltativo)</Label>
              <Input id="t-role" value={form.authorRole} onChange={(e) => setForm({ ...form, authorRole: e.target.value })} />
            </div>
          </div>

          <div>
            <Label htmlFor="t-company">Azienda (facoltativo)</Label>
            <Input id="t-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>

          <div>
            <Label htmlFor="t-quote">Testimonianza</Label>
            <Textarea id="t-quote" rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
          </div>

          <div>
            <Label>Progetto collegato (facoltativo)</Label>
            <Select
              value={form.projectId || "none"}
              onValueChange={(v) => setForm({ ...form, projectId: !v || v === "none" ? "" : v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Nessuno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nessuno</SelectItem>
                {projectOptions.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.client}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="t-published" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
            <Label htmlFor="t-published">Pubblicata</Label>
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
