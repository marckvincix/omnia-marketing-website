"use client";

import { useState, useTransition } from "react";
import { Plus, X, Loader2 } from "lucide-react";
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
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { ProjectInput } from "@/lib/validation/admin";
import { saveProject, uploadProjectImage } from "./actions";

const NEW_CATEGORY = "__new__";

const emptyProject: ProjectInput = {
  title: "",
  slug: "",
  client: "",
  category: "",
  description: "",
  coverImage: "",
  year: null,
  externalUrl: "",
  resultsText: "",
  testimonialAuthor: "",
  testimonialRole: "",
  testimonialQuote: "",
  published: true,
  seoTitle: "",
  seoDescription: "",
  geoTitle: "",
  geoDescription: "",
  serviceIds: [],
  media: [],
};

export function ProjectEditor({
  initial,
  serviceOptions,
  categoryOptions,
}: {
  initial?: ProjectInput;
  serviceOptions: { id: string; title: string }[];
  categoryOptions: string[];
}) {
  const [form, setForm] = useState<ProjectInput>(initial ?? emptyProject);
  const [customCategory, setCustomCategory] = useState(
    !!form.category && !categoryOptions.includes(form.category),
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        await saveProject(form);
      } catch (e) {
        if (e instanceof Error && e.message !== "NEXT_REDIRECT") {
          setError(e.message);
        }
      }
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
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
          <Label>Categoria</Label>
          <Select
            value={customCategory ? NEW_CATEGORY : form.category || ""}
            onValueChange={(v) => {
              if (v === NEW_CATEGORY) {
                setCustomCategory(true);
                setForm({ ...form, category: "" });
              } else {
                setCustomCategory(false);
                setForm({ ...form, category: v ?? "" });
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleziona categoria" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
              <SelectItem value={NEW_CATEGORY}>+ Nuova categoria…</SelectItem>
            </SelectContent>
          </Select>
          {customCategory && (
            <Input
              className="mt-2"
              placeholder="Nome nuova categoria"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          )}
        </div>
      </div>

      <ImageUploadField
        label="Immagine di copertina"
        value={form.coverImage ?? ""}
        onChange={(url) => setForm({ ...form, coverImage: url })}
        uploadAction={uploadProjectImage}
        helperText="Sarà lo sfondo di questo progetto in ogni scheda del sito. JPG, PNG o WEBP, fino a 20MB."
      />

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
        <Label className="mb-3 block">Testimonianza</Label>
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
          <Label>Galleria immagini</Label>
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
        <p className="text-xs text-muted-foreground mb-3">
          Verrà usata nella galleria fotografica della pagina progetto (design in arrivo).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {form.media.map((m, i) => (
            <div key={m.id ?? i} className="flex gap-2 items-start rounded-lg border border-border p-3">
              <div className="flex-1 flex flex-col gap-2">
                <ImageUploadField
                  value={m.url}
                  onChange={(url) => {
                    const next = [...form.media];
                    next[i] = { ...next[i], url };
                    setForm({ ...form, media: next });
                  }}
                  uploadAction={uploadProjectImage}
                  helperText=""
                  compact
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
            <p className="text-sm text-muted-foreground">Nessuna immagine ancora.</p>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <Label className="mb-3 block">SEO — per i motori di ricerca</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="p-seoTitle">Meta title</Label>
            <Input id="p-seoTitle" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="p-seoDescription">Meta description</Label>
            <Input id="p-seoDescription" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <Label className="mb-1 block">GEO — per i motori generativi/AI</Label>
        <p className="text-xs text-muted-foreground mb-3">
          Testo chiaro e fattuale pensato per essere citato da ChatGPT, Perplexity, Google AI Overview e simili.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="p-geoTitle">Titolo GEO</Label>
            <Input id="p-geoTitle" value={form.geoTitle} onChange={(e) => setForm({ ...form, geoTitle: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="p-geoDescription">Descrizione GEO</Label>
            <Textarea
              id="p-geoDescription"
              rows={2}
              value={form.geoDescription}
              onChange={(e) => setForm({ ...form, geoDescription: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="p-published" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
        <Label htmlFor="p-published">Pubblicato</Label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Salva progetto
        </Button>
      </div>
    </div>
  );
}
