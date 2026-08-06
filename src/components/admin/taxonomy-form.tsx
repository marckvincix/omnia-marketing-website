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
import { Button } from "@/components/ui/button";
import type { BlogTaxonomyInput } from "@/lib/validation/admin";

export function TaxonomyForm({
  trigger,
  initial,
  title,
  onSave,
}: {
  trigger: React.ReactNode;
  initial?: BlogTaxonomyInput;
  title: string;
  onSave: (input: BlogTaxonomyInput) => Promise<void>;
}) {
  const empty: BlogTaxonomyInput = { name: "", slug: "" };
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<BlogTaxonomyInput>(initial ?? empty);
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
        await onSave(form);
        setOpen(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Errore durante il salvataggio");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="tx-name">Nome</Label>
            <Input id="tx-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="tx-slug">Slug</Label>
            <Input id="tx-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
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
