"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
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
import type { BlogPostInput } from "@/lib/validation/admin";
import { computeReadingTime } from "@/lib/reading-time";
import { saveBlogPost } from "./actions";

const empty: BlogPostInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  categoryId: "",
  tagIds: [],
  published: false,
  seoTitle: "",
  seoDescription: "",
};

export function PostEditor({
  initial,
  categoryOptions,
  tagOptions,
}: {
  initial?: BlogPostInput;
  categoryOptions: { id: string; name: string }[];
  tagOptions: { id: string; name: string }[];
}) {
  const [form, setForm] = useState<BlogPostInput>(initial ?? empty);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        await saveBlogPost(form);
      } catch (e) {
        if (e instanceof Error && e.message !== "NEXT_REDIRECT") {
          setError(e.message);
        }
      }
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="b-title">Titolo</Label>
          <Input id="b-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="b-slug">Slug (URL)</Label>
          <Input id="b-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>
      </div>

      <div>
        <Label htmlFor="b-excerpt">Estratto</Label>
        <Textarea id="b-excerpt" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="b-content">Contenuto</Label>
          <span className="text-xs text-muted-foreground">
            ~{computeReadingTime(form.content)} min di lettura
          </span>
        </div>
        <Textarea id="b-content" rows={14} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
      </div>

      <div>
        <Label htmlFor="b-cover">URL immagine di copertina</Label>
        <Input id="b-cover" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Categoria</Label>
          <Select
            value={form.categoryId || "none"}
            onValueChange={(v) => setForm({ ...form, categoryId: !v || v === "none" ? "" : v })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Nessuna" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nessuna</SelectItem>
              {categoryOptions.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end pb-2">
          <div className="flex items-center gap-2">
            <Switch id="b-published" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
            <Label htmlFor="b-published">Pubblicato</Label>
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Tag</Label>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => {
            const checked = form.tagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    tagIds: checked ? form.tagIds.filter((id) => id !== tag.id) : [...form.tagIds, tag.id],
                  })
                }
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  checked
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                {tag.name}
              </button>
            );
          })}
          {tagOptions.length === 0 && (
            <p className="text-sm text-muted-foreground">Nessun tag creato ancora.</p>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="b-seoTitle">Meta title</Label>
          <Input id="b-seoTitle" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="b-seoDescription">Meta description</Label>
          <Input id="b-seoDescription" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Salva articolo
        </Button>
      </div>
    </div>
  );
}
