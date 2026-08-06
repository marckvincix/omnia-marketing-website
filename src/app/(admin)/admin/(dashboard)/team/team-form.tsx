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
import type { TeamMemberInput } from "@/lib/validation/admin";
import { saveTeamMember } from "./actions";

const empty: TeamMemberInput = { name: "", role: "", bio: "", photoUrl: "", linkedinUrl: "", published: true };

export function TeamForm({ trigger, initial }: { trigger: React.ReactNode; initial?: TeamMemberInput }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<TeamMemberInput>(initial ?? empty);
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
        await saveTeamMember(form);
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
          <DialogTitle>{initial ? "Modifica membro team" : "Nuovo membro team"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tm-name">Nome</Label>
              <Input id="tm-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="tm-role">Ruolo</Label>
              <Input id="tm-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
          </div>

          <div>
            <Label htmlFor="tm-bio">Bio (facoltativa)</Label>
            <Textarea id="tm-bio" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tm-photo">URL foto</Label>
              <Input id="tm-photo" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="tm-linkedin">LinkedIn (facoltativo)</Label>
              <Input id="tm-linkedin" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="tm-published" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
            <Label htmlFor="tm-published">Visibile sul sito</Label>
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
