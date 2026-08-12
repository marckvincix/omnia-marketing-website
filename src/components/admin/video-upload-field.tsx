"use client";

import { useRef, useState } from "react";
import { VideoIcon, Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getBrowserStorageClient, MEDIA_BUCKET } from "@/lib/supabase-browser";
import type { UploadSlot } from "@/lib/supabase-storage";

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

export function VideoUploadField({
  label,
  value,
  onChange,
  uploadAction,
  helperText = "MP4 o WEBM, orizzontale o verticale, fino a 100MB.",
  compact = false,
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  uploadAction: (fileName: string) => Promise<UploadSlot>;
  helperText?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Il file supera i 100MB consentiti.");
      return;
    }
    setPending(true);
    try {
      const { path, token, publicUrl } = await uploadAction(file.name);
      const { error: uploadError } = await getBrowserStorageClient()
        .storage.from(MEDIA_BUCKET)
        .uploadToSignedUrl(path, token, file);
      if (uploadError) throw new Error(uploadError.message);
      onChange(publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore durante il caricamento");
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {label && <Label className="mb-2 block">{label}</Label>}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {value ? (
        <div className={`relative overflow-hidden rounded-lg border border-border bg-black ${compact ? "h-24" : "h-40"}`}>
          <video src={value} controls className="h-full w-full object-contain" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black transition-colors"
            title="Rimuovi video"
          >
            <X className="size-4" />
          </button>
          {pending && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="size-5 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-muted-foreground hover:bg-accent transition-colors disabled:opacity-60 ${compact ? "h-24" : "h-40"}`}
        >
          {pending ? <Loader2 className="size-5 animate-spin" /> : <VideoIcon className="size-5" />}
          <span className="text-xs">{pending ? "Caricamento…" : "Carica video dal computer"}</span>
        </button>
      )}

      {helperText && !error && <p className="mt-1 text-xs text-muted-foreground">{helperText}</p>}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
