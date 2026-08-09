"use client";

import { useState, useTransition } from "react";
import { Plus, X, Loader2 } from "lucide-react";
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
import type { ServiceInput } from "@/lib/validation/admin";
import { saveService } from "./actions";

type ServiceWithBenefits = ServiceInput;

const emptyService: ServiceInput = {
  title: "",
  slug: "",
  excerpt: "",
  description: "",
  ctaLabel: "Contattaci",
  ctaUrl: "/contatti",
  published: true,
  seoTitle: "",
  seoDescription: "",
  benefits: [],
};

export function ServiceForm({
  trigger,
  initial,
}: {
  trigger: React.ReactNode;
  initial?: ServiceWithBenefits;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ServiceInput>(initial ?? emptyService);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setForm(initial ?? emptyService);
    setError(null);
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        await saveService(form);
        setOpen(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Errore durante il salvataggio");
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Modifica servizio" : "Nuovo servizio"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titolo</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="web"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">Sottotitolo</Label>
            <Input
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ctaLabel">Testo CTA</Label>
              <Input
                id="ctaLabel"
                value={form.ctaLabel}
                onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="ctaUrl">Link CTA</Label>
              <Input
                id="ctaUrl"
                value={form.ctaUrl}
                onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Sotto-servizi</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setForm({
                    ...form,
                    benefits: [...form.benefits, { title: "", description: "" }],
                  })
                }
              >
                <Plus className="size-4" /> Aggiungi
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              {form.benefits.map((benefit, i) => (
                <div key={benefit.id ?? i} className="flex gap-2 items-start rounded-lg border border-border p-3">
                  <div className="flex-1 flex flex-col gap-2">
                    <Input
                      placeholder="Titolo"
                      value={benefit.title}
                      onChange={(e) => {
                        const next = [...form.benefits];
                        next[i] = { ...next[i], title: e.target.value };
                        setForm({ ...form, benefits: next });
                      }}
                    />
                    <Textarea
                      placeholder="Descrizione"
                      rows={2}
                      value={benefit.description}
                      onChange={(e) => {
                        const next = [...form.benefits];
                        next[i] = { ...next[i], description: e.target.value };
                        setForm({ ...form, benefits: next });
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({ ...form, benefits: form.benefits.filter((_, j) => j !== i) })
                    }
                    className="text-muted-foreground hover:text-destructive mt-1"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
              {form.benefits.length === 0 && (
                <p className="text-sm text-muted-foreground">Nessun sotto-servizio.</p>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seoTitle">Meta title</Label>
              <Input
                id="seoTitle"
                value={form.seoTitle}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="seoDescription">Meta description</Label>
              <Input
                id="seoDescription"
                value={form.seoDescription}
                onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={form.published}
              onCheckedChange={(v) => setForm({ ...form, published: v })}
            />
            <Label htmlFor="published">Pubblicato</Label>
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
