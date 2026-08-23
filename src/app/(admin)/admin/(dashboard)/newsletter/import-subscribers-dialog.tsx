"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { importSubscribersFromFile } from "./actions";
import type { ImportResult } from "@/lib/email/import-subscribers";

export function ImportSubscribersDialog() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ImportResult | null>(null);

  function handleSubmit(formData: FormData) {
    setResult(null);
    startTransition(async () => {
      const res = await importSubscribersFromFile(formData);
      setResult(res);
      if (!res.error) formRef.current?.reset();
    });
  }

  return (
    <Dialog onOpenChange={(open) => !open && setResult(null)}>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            <Upload className="size-4" />
            Importa contatti
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importa contatti da file</DialogTitle>
          <DialogDescription>
            Carica un CSV, XLS o XLSX: le colonne di nome ed email vengono riconosciute
            automaticamente, con o senza intestazione. Chi si era già disiscritto non viene
            ri-iscritto — restano contattabili solo i nuovi indirizzi e chi è già attivo.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="import-file">File</Label>
            <Input id="import-file" name="file" type="file" accept=".csv,.xls,.xlsx" required />
          </div>

          {result && (
            <div
              className={`rounded-lg border p-3 text-sm ${
                result.error
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : "border-border bg-muted/50 text-muted-foreground"
              }`}
            >
              {result.error ? (
                <p>{result.error}</p>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  <li className="text-foreground font-medium">{result.imported} nuovi iscritti aggiunti</li>
                  {result.updated > 0 && <li>{result.updated} nomi aggiornati su iscritti già presenti</li>}
                  {result.skipped > 0 && <li>{result.skipped} già presenti, invariati</li>}
                  {result.invalid > 0 && <li>{result.invalid} righe scartate (email non valida)</li>}
                </ul>
              )}
            </div>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            Importa
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
