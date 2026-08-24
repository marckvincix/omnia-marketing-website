"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { VideoUploadField } from "@/components/admin/video-upload-field";
import { SeoAnalysisPanel } from "@/components/admin/seo-analysis-panel";
import type { ProjectInput } from "@/lib/validation/admin";
import { saveProject, createProjectMediaUploadSlot } from "./actions";

const emptyProject: ProjectInput = {
  title: "",
  slug: "",
  client: "",
  category: [],
  description: "",
  processText: "",
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
  focusKeyword: "",
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
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // L'analizzatore SEO lavora su un unico testo: il progetto non ha un campo "contenuto"
  // come il blog, quindi uniamo i testi che compaiono davvero nella pagina pubblica.
  const seoContent = useMemo(
    () => [form.description, form.processText, form.resultsText, form.testimonialQuote].filter(Boolean).join("\n\n"),
    [form.description, form.processText, form.resultsText, form.testimonialQuote],
  );

  function addCategory(name: string) {
    const trimmed = name.trim();
    if (!trimmed || form.category.includes(trimmed)) return;
    setForm((f) => ({ ...f, category: [...f.category, trimmed] }));
  }

  function toggleCategory(name: string) {
    setForm((f) => ({
      ...f,
      category: f.category.includes(name)
        ? f.category.filter((c) => c !== name)
        : [...f.category, name],
    }));
  }

  function handleGenerateGeo() {
    const client = form.client.trim() || "il cliente";
    const category = form.category.length > 0 ? form.category.join(", ") : "un progetto digitale";
    const results = form.resultsText
      ? form.resultsText.split("·").map((r) => r.trim()).filter(Boolean)
      : [];

    const title = `Omnia Marketing per ${client}: ${category}`;

    const descParts = [
      `Omnia Marketing ha realizzato per ${client} un progetto di ${category.toLowerCase()}.`,
    ];
    if (form.description.trim()) descParts.push(form.description.trim());
    if (results.length > 0) descParts.push(`Risultati ottenuti: ${results.join(", ")}.`);

    setForm({ ...form, geoTitle: title, geoDescription: descParts.join(" ") });
  }

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
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="p-title">Titolo</Label>
          <Input id="p-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="p-slug">Slug (URL)</Label>
          <Input id="p-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="p-client">Cliente</Label>
          <Input id="p-client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Categorie</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {categoryOptions.map((c) => {
            const checked = form.category.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCategory(c)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  checked
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                {c}
              </button>
            );
          })}
          {form.category
            .filter((c) => !categoryOptions.includes(c))
            .map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCategory(c)}
                className="rounded-full border px-3 py-1.5 text-sm bg-primary text-primary-foreground border-primary"
              >
                {c}
              </button>
            ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Nuova categoria"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCategory(newCategory);
                setNewCategory("");
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              addCategory(newCategory);
              setNewCategory("");
            }}
          >
            <Plus className="size-4" /> Aggiungi
          </Button>
        </div>
      </div>

      <ImageUploadField
        label="Immagine di copertina"
        value={form.coverImage ?? ""}
        onChange={(url) => setForm({ ...form, coverImage: url })}
        uploadAction={createProjectMediaUploadSlot}
        helperText="Sarà lo sfondo di questo progetto in ogni scheda del sito. JPG, PNG o WEBP, fino a 20MB."
      />
      <div className="mt-2 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Dimensioni consigliate</p>
        <p className="mb-2">
          Viene usata in due punti con proporzioni diverse: banner panoramico (21:9) in cima alla pagina
          del progetto, e sfondo delle schede in Portfolio/Home (formato più verticale, varia con l&apos;altezza
          dello schermo).
        </p>
        <ul className="space-y-0.5">
          <li><span className="font-medium text-foreground">Mobile</span> — banner 342×147px · scheda 340×589px</li>
          <li><span className="font-medium text-foreground">Tablet</span> — banner 724×310px · scheda 722×883px</li>
          <li><span className="font-medium text-foreground">Desktop</span> — banner 1344×576px (fino a ~1824×782px su schermi molto larghi) · scheda 1182×673px</li>
        </ul>
        <p className="mt-2">Carica un file più grande di questi valori (es. 2400×1050px) per restare nitida anche su schermi retina.</p>
      </div>

      <div>
        <Label htmlFor="p-description">Descrizione</Label>
        <Textarea id="p-description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>

      <div>
        <Label htmlFor="p-processText">Come lo abbiamo realizzato</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Testo esteso per la pagina progetto: spiega l&apos;approccio tecnico, le scelte fatte e come
          si è svolto il lavoro. Compare in una sezione dedicata dopo servizi e risultati.
        </p>
        <Textarea
          id="p-processText"
          rows={6}
          value={form.processText}
          onChange={(e) => setForm({ ...form, processText: e.target.value })}
        />
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
          <Label>Galleria (foto e video)</Label>
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
        <div className="mb-3 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Dimensioni consigliate</p>
          <p className="mb-2">
            <span className="font-medium text-foreground">Foto</span> — formato verticale 4:5, almeno
            1200×1500px. Mobile 342×428px (una colonna) · Tablet 346×433px · Desktop 576×720px
            (due colonne).
          </p>
          <p>
            <span className="font-medium text-foreground">Video</span> — orizzontali o verticali, vengono
            mostrati tutti alla stessa altezza nel carosello a scorrimento della pagina progetto.
            MP4 o WEBM, fino a 100MB.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {form.media.map((m, i) => (
            <div key={m.id ?? i} className="flex gap-2 items-start rounded-lg border border-border p-3">
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...form.media];
                      next[i] = { ...next[i], type: "IMAGE", url: "" };
                      setForm({ ...form, media: next });
                    }}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      m.type === "IMAGE"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    Immagine
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...form.media];
                      next[i] = { ...next[i], type: "VIDEO", url: "" };
                      setForm({ ...form, media: next });
                    }}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      m.type === "VIDEO"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    Video
                  </button>
                </div>

                {m.type === "VIDEO" ? (
                  <VideoUploadField
                    value={m.url}
                    onChange={(url) => {
                      const next = [...form.media];
                      next[i] = { ...next[i], url };
                      setForm({ ...form, media: next });
                    }}
                    uploadAction={createProjectMediaUploadSlot}
                    helperText=""
                    compact
                  />
                ) : (
                  <ImageUploadField
                    value={m.url}
                    onChange={(url) => {
                      const next = [...form.media];
                      next[i] = { ...next[i], url };
                      setForm({ ...form, media: next });
                    }}
                    uploadAction={createProjectMediaUploadSlot}
                    helperText=""
                    compact
                  />
                )}
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
            <p className="text-sm text-muted-foreground">Nessuna immagine o video ancora.</p>
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

        <SeoAnalysisPanel
          focusKeyword={form.focusKeyword ?? ""}
          onFocusKeywordChange={(v) => setForm({ ...form, focusKeyword: v })}
          seoTitle={form.seoTitle ?? ""}
          fallbackTitle={form.title}
          seoDescription={form.seoDescription ?? ""}
          slug={form.slug}
          content={seoContent}
        />
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-1">
          <Label className="block">GEO — per i motori generativi/AI</Label>
          <Button type="button" variant="outline" size="sm" onClick={handleGenerateGeo}>
            Compila automaticamente
          </Button>
        </div>
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
