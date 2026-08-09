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
import type { ProjectInput } from "@/lib/validation/admin";
import { saveProject } from "./actions";

const emptyProject: ProjectInput = {
  title: "",
  slug: "",
  client: "",
  category: "",
  description: "",
  year: null,
  externalUrl: "",
  resultsText: "",
  testimonialAuthor: "",
  testimonialRole: "",
  testimonialQuote: "",
  published: true,
  seoTitle: "",
  seoDescription: "",
  serviceIds: [],
  media: [],
};

export function ProjectForm({
  trigger,
  initial,
  serviceOptions,
}: {
  trigger: React.ReactNode;
  initial?: ProjectInput;
  serviceOptions: { id: string; title: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProjectInput>(initial ?? emptyProject);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setForm(initial ?? emptyProject);
    setError(null);
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        await saveProject(form);
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
          <DialogTitle>{initial ? "Modifica progetto" : "Nuovo progetto"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="p-title">Titolo</Label>
              <Input id="p-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="p-slug">Slug (URL)</Label>
              <Input id="p-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="p-client">Cliente</Label>
              <Input id="p-client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="p-category">Categoria</Label>
              <Input
                id="p-category"
                value={form.category}
                placeholder="Sito Web · Branding"
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="p-description">Descrizione</Label>
            <Textarea id="p-description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="p-year">Anno</Label>
              <Input
                id="p-year"
                type="number"
                value={form.year ?? ""}
                onChange={(e) => setForm({ ...form, year: e.target.value ? Number(e.target.value) : null })}
              />
            </div>
            <div>
              <Label htmlFor="p-url">URL esterno cliente</Label>
              <Input id="p-url" value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} />
            </div>
          </div>

          <div>
            <Label htmlFor="p-results">Risultati</Label>
            <Textarea
              id="p-results"
              rows={2}
              value={form.resultsText}
              placeholder="Separati da ' · '"
              onChange={(e) => setForm({ ...form, resultsText: e.target.value })}
            />
          </div>

          <div className="border-t border-border pt-4">
            <Label className="mb-2 block">Servizi svolti</Label>
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map((s) => {
                const checked = form.serviceIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        serviceIds: checked
                          ? form.serviceIds.filter((id) => id !== s.id)
                          : [...form.serviceIds, s.id],
                      })
                    }
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      checked
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {s.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Testimonianza</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Input
                placeholder="Autore"
                value={form.testimonialAuthor}
                onChange={(e) => setForm({ ...form, testimonialAuthor: e.target.value })}
              />
              <Input
                placeholder="Ruolo (facoltativo)"
                value={form.testimonialRole}
                onChange={(e) => setForm({ ...form, testimonialRole: e.target.value })}
              />
            </div>
            <Textarea
              placeholder="Testo della testimonianza"
              rows={2}
              value={form.testimonialQuote}
              onChange={(e) => setForm({ ...form, testimonialQuote: e.target.value })}
            />
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Gallery immagini/video</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setForm({ ...form, media: [...form.media, { url: "", alt: "", type: "IMAGE" }] })
                }
              >
                <Plus className="size-4" /> Aggiungi
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              {form.media.map((m, i) => (
                <div key={m.id ?? i} className="flex gap-2 items-start rounded-lg border border-border p-3">
                  <div className="flex-1 flex flex-col gap-2">
                    <Input
                      placeholder="URL immagine/video"
                      value={m.url}
                      onChange={(e) => {
                        const next = [...form.media];
                        next[i] = { ...next[i], url: e.target.value };
                        setForm({ ...form, media: next });
                      }}
                    />
                    <Input
                      placeholder="Testo alternativo (ALT)"
                      value={m.alt}
                      onChange={(e) => {
                        const next = [...form.media];
                        next[i] = { ...next[i], alt: e.target.value };
                        setForm({ ...form, media: next });
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, media: form.media.filter((_, j) => j !== i) })}
                    className="text-muted-foreground hover:text-destructive mt-1"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
              {form.media.length === 0 && (
                <p className="text-sm text-muted-foreground">Nessun media ancora.</p>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="p-seoTitle">Meta title</Label>
              <Input id="p-seoTitle" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="p-seoDescription">Meta description</Label>
              <Input id="p-seoDescription" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="p-published" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
            <Label htmlFor="p-published">Pubblicato</Label>
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
