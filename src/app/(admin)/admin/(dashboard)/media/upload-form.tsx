"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getBrowserStorageClient, MEDIA_BUCKET } from "@/lib/supabase-browser";
import { createMediaUploadSlot, finalizeMediaUpload } from "./actions";

export function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";
    if (!file || file.size === 0) {
      setError("Nessun file selezionato");
      return;
    }

    startTransition(async () => {
      try {
        const { path, token, publicUrl } = await createMediaUploadSlot(file.name);
        const { error: uploadError } = await getBrowserStorageClient()
          .storage.from(MEDIA_BUCKET)
          .uploadToSignedUrl(path, token, file);
        if (uploadError) throw new Error(uploadError.message);

        await finalizeMediaUpload({
          url: publicUrl,
          contentType: file.type,
          sizeBytes: file.size,
          altText,
        });
        formRef.current?.reset();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Errore durante il caricamento");
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="rounded-xl border border-border bg-card p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <Label htmlFor="file">File (immagine o video)</Label>
          <Input id="file" name="file" type="file" accept="image/*,video/*" required />
        </div>
        <div className="flex-1 w-full">
          <Label htmlFor="altText">Testo alternativo (ALT)</Label>
          <Input id="altText" name="altText" type="text" placeholder="Descrizione dell'immagine" required />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Carica
        </Button>
      </div>
      {error && <p className="text-sm text-destructive mt-3">{error}</p>}
    </form>
  );
}
