"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/label";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export function ImageUploadField({
  label,
  value,
  onChange,
  uploadAction,
  helperText = "JPG, PNG o WEBP, fino a 20MB.",
  compact = false,
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  uploadAction: (formData: FormData) => Promise<{ url: string }>;
  helperText?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Il file supera i 20MB consentiti.");
      return;
    }
    setPending(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const { url } = await uploadAction(formData);
      onChange(url);
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
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {value ? (
        <div className={`relative overflow-hidden rounded-lg border border-border ${compact ? "h-24" : "h-40"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- anteprima in admin, non serve l'ottimizzazione next/image */}
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black transition-colors"
            title="Rimuovi immagine"
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
          {pending ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
          <span className="text-xs">{pending ? "Caricamento…" : "Carica immagine dal computer"}</span>
        </button>
      )}

      {helperText && !error && <p className="mt-1 text-xs text-muted-foreground">{helperText}</p>}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
