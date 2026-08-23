"use client";

import { useState, useTransition } from "react";
import { Check, ChevronDown, Loader2, Send } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/use-media-query";
import type { SegmentKey } from "@/lib/email/segment-labels";
import { sendUpdateEmail } from "./actions";

export interface PostSendRowData {
  id: string;
  title: string;
  publishedAt: string | null;
  newsletterSentAt: string | null;
}

export interface SegmentOptionData {
  key: SegmentKey;
  label: string;
  description: string;
  count: number;
}

function SegmentOptionList({
  segments,
  selectedKey,
  onSelect,
}: {
  segments: SegmentOptionData[];
  selectedKey: SegmentKey;
  onSelect: (key: SegmentKey) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 overflow-y-auto px-4 pb-4">
      {segments.map((s) => (
        <button
          key={s.key}
          type="button"
          onClick={() => onSelect(s.key)}
          className={cn(
            "flex items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors",
            s.key === selectedKey
              ? "border-primary bg-primary/5"
              : "border-border hover:bg-muted",
          )}
        >
          <div className="min-w-0">
            <p className="text-sm font-medium">{s.label}</p>
            <p className="text-xs text-muted-foreground truncate">{s.description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="secondary">
              {s.count} {s.count === 1 ? "iscritto" : "iscritti"}
            </Badge>
            {s.key === selectedKey && <Check className="size-4 text-primary" />}
          </div>
        </button>
      ))}
    </div>
  );
}

export function PostSendRow({
  post,
  subscriberCount,
  segments,
}: {
  post: PostSendRowData;
  subscriberCount: number;
  segments: SegmentOptionData[];
}) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [segment, setSegment] = useState<SegmentKey>("all");
  const [result, setResult] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const selected = segments.find((s) => s.key === segment) ?? segments[0];

  function handleSelect(key: SegmentKey) {
    setSegment(key);
    setPickerOpen(false);
  }

  function handleSend() {
    setConfirming(false);
    startTransition(async () => {
      const res = await sendUpdateEmail(post.id, segment);
      if ("error" in res && res.error) {
        setResult(`Errore: ${res.error}`);
      } else {
        setResult(`Inviata a ${res.sent}/${res.total} iscritti`);
      }
    });
  }

  return (
    <TableRow>
      <TableCell className="font-medium max-w-sm truncate">{post.title}</TableCell>
      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })
          : "—"}
      </TableCell>
      <TableCell>
        {post.newsletterSentAt ? (
          <Badge variant="secondary">
            Inviata il{" "}
            {new Date(post.newsletterSentAt).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })}
          </Badge>
        ) : (
          <Badge variant="outline">Non inviata</Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        {result ? (
          <span className="text-xs text-muted-foreground">{result}</span>
        ) : confirming ? (
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-48 justify-between font-normal sm:w-56"
                onClick={() => setPickerOpen(true)}
              >
                <span className="truncate">{selected?.label ?? "Segmento"}</span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
              </Button>
              <Button size="sm" variant="destructive" disabled={isPending} onClick={handleSend}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : "Conferma invio"}
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">
              Invio a {selected?.count ?? 0} {selected?.count === 1 ? "iscritto" : "iscritti"}
            </span>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            disabled={subscriberCount === 0}
            onClick={() => setConfirming(true)}
            title={subscriberCount === 0 ? "Nessun iscritto alla newsletter" : undefined}
          >
            <Send className="size-4" />
            {post.newsletterSentAt ? "Invia di nuovo" : "Invia agli iscritti"}
          </Button>
        )}
      </TableCell>

      {isDesktop ? (
        <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Scegli il segmento</DialogTitle>
              <DialogDescription className="truncate">A chi inviare &quot;{post.title}&quot;</DialogDescription>
            </DialogHeader>
            <SegmentOptionList segments={segments} selectedKey={segment} onSelect={handleSelect} />
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
          <SheetContent side="bottom" className="max-h-[80vh]">
            <SheetHeader>
              <SheetTitle>Scegli il segmento</SheetTitle>
              <SheetDescription className="truncate">A chi inviare &quot;{post.title}&quot;</SheetDescription>
            </SheetHeader>
            <SegmentOptionList segments={segments} selectedKey={segment} onSelect={handleSelect} />
          </SheetContent>
        </Sheet>
      )}
    </TableRow>
  );
}
