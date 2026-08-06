"use client";

import { useState, useTransition } from "react";
import { Copy, Check, Video } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { updateMediaAlt, deleteMedia } from "./actions";

export interface MediaItem {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  altText: string;
}

function MediaCard({ item }: { item: MediaItem }) {
  const [alt, setAlt] = useState(item.altText);
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
        {item.type === "IMAGE" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt={item.altText} className="w-full h-full object-cover" />
        ) : (
          <Video className="size-8 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
      <div className="p-3 flex flex-col gap-2">
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={() => startTransition(() => updateMediaAlt(item.id, alt))}
          placeholder="Testo alternativo"
          className="text-xs rounded border border-border px-2 py-1 bg-background"
        />
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(item.url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copied ? "Copiato" : "Copia URL"}
          </button>
          <DeleteButton action={() => deleteMedia(item.id, item.url)} />
        </div>
      </div>
    </div>
  );
}

export function MediaGrid({ items }: { items: MediaItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-16 rounded-xl border border-dashed border-border">
        Nessun file caricato ancora.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}
