"use client";

import { useState, useTransition } from "react";
import { Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { SiteSettingsInput } from "@/lib/validation/admin";
import { saveSiteSettings } from "./actions";

export function SettingsForm({ initial }: { initial: SiteSettingsInput }) {
  const [form, setForm] = useState<SiteSettingsInput>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await saveSiteSettings(form);
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Errore durante il salvataggio");
      }
    });
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold mb-4">Homepage</h2>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="s-heroTitle">Titolo hero</Label>
            <Textarea
              id="s-heroTitle"
              rows={2}
              value={form.heroTitle}
              onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
            />
            <p className="mt-1 text-xs text-muted-foreground">Vai a capo per controllare dove si spezza il titolo.</p>
          </div>
          <div>
            <Label htmlFor="s-heroSubtitle">Sottotitolo hero</Label>
            <Textarea id="s-heroSubtitle" rows={2} value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="s-heroCtaLabel">Testo CTA</Label>
              <Input id="s-heroCtaLabel" value={form.heroCtaLabel} onChange={(e) => setForm({ ...form, heroCtaLabel: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="s-heroCtaUrl">Link CTA</Label>
              <Input id="s-heroCtaUrl" value={form.heroCtaUrl} onChange={(e) => setForm({ ...form, heroCtaUrl: e.target.value })} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold mb-4">Dati aziendali</h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="s-companyName">Ragione sociale</Label>
              <Input id="s-companyName" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="s-piva">P.IVA</Label>
              <Input id="s-piva" value={form.piva} onChange={(e) => setForm({ ...form, piva: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="s-legalAddress">Sede legale</Label>
            <Input id="s-legalAddress" value={form.legalAddress} onChange={(e) => setForm({ ...form, legalAddress: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="s-operationalAddress">Sede operativa</Label>
            <Input id="s-operationalAddress" value={form.operationalAddress} onChange={(e) => setForm({ ...form, operationalAddress: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="s-contactEmail">Email di contatto</Label>
              <Input id="s-contactEmail" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="s-contactPhone">Telefono (facoltativo)</Label>
              <Input id="s-contactPhone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold mb-4">Footer</h2>
        <Textarea rows={2} value={form.footerText} onChange={(e) => setForm({ ...form, footerText: e.target.value })} />
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Salva impostazioni
        </Button>
        {saved && !isPending && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Check className="size-4" /> Salvato
          </span>
        )}
      </div>
    </div>
  );
}
