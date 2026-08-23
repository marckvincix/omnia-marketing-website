"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { X } from "lucide-react";
import { submitContact, type ContactActionState } from "@/app/(public)/[locale]/contatti/actions";
import { useVisitorName } from "@/lib/visitor-name-context";
import { useVisitorTracking } from "@/lib/visitor-tracking-context";
import { LightBeamButton } from "./light-beam-button";

const initialState: ContactActionState = {};
const TRIGGER_SENTINEL_ID = "request-info-trigger";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <LightBeamButton type="submit" disabled={pending} className="w-full justify-center py-3.5">
      {pending ? "Invio in corso…" : label}
    </LightBeamButton>
  );
}

export interface RequestInfoPopupProps {
  title: string;
  description: string;
  submitLabel?: string;
  defaultMessage: string;
  serviceOptions: { id: string; title: string }[];
  defaultServiceId?: string;
}

export function RequestInfoPopup({
  title,
  description,
  submitLabel = "Invia richiesta",
  defaultMessage,
  serviceOptions,
  defaultServiceId,
}: RequestInfoPopupProps) {
  const { name, hydrated: nameHydrated } = useVisitorName();
  const { hydrated: trackingHydrated, contacted } = useVisitorTracking();
  const [open, setOpen] = useState(false);
  const shownRef = useRef(false);
  const [state, formAction] = useActionState(submitContact, initialState);

  useEffect(() => {
    if (!nameHydrated || !trackingHydrated || contacted) return;

    // Il trigger non è "fine pagina": ogni pagina espone un segnaposto (es. dopo la
    // testimonianza in un progetto, dopo le FAQ in una pagina servizio) che indica il punto
    // in cui il visitatore ha già visto abbastanza da giustificare la richiesta.
    const sentinel = document.getElementById(TRIGGER_SENTINEL_ID);
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (shownRef.current) return;
        // Scatta quando il segnaposto è stato superato scorrendo verso il basso (uscito dalla
        // viewport dal bordo superiore), non quando semplicemente non è ancora stato raggiunto.
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          shownRef.current = true;
          setOpen(true);
        }
      },
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [nameHydrated, trackingHydrated, contacted]);

  if (!open) return null;

  const displayTitle = name ? `${name}, ${title.charAt(0).toLowerCase()}${title.slice(1)}` : title;

  return (
    <div
      className="fixed inset-0 z-[190] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6 py-10 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-info-popup-title"
    >
      <div className="relative w-full max-w-lg rounded-[2rem] border border-[#1f1f1f] bg-[#0a0a0a] p-8 md:p-10 my-auto">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Chiudi"
          className="absolute top-5 right-5 flex size-9 items-center justify-center rounded-full border border-[#2a2a2a] text-[#888888] transition-colors hover:border-white/40 hover:text-white"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <h2 id="request-info-popup-title" className="font-display text-2xl md:text-3xl text-white pr-10">
          {displayTitle}
        </h2>
        <p className="mt-2 text-sm text-[#999999]">{description}</p>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="popup-name"
                className="block text-xs font-bold uppercase tracking-normal text-[#888888] mb-2"
              >
                Nome
              </label>
              <input
                id="popup-name"
                name="name"
                type="text"
                required
                defaultValue={name ?? ""}
                key={name ?? "empty"}
                className="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-white focus:outline-none focus:border-[#2e9bd6] transition-colors"
              />
              {state.fieldErrors?.name && (
                <p className="mt-1 text-xs text-[#2e9bd6]">{state.fieldErrors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="popup-email"
                className="block text-xs font-bold uppercase tracking-normal text-[#888888] mb-2"
              >
                Email
              </label>
              <input
                id="popup-email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-white focus:outline-none focus:border-[#2e9bd6] transition-colors"
              />
              {state.fieldErrors?.email && (
                <p className="mt-1 text-xs text-[#2e9bd6]">{state.fieldErrors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="popup-phone"
              className="block text-xs font-bold uppercase tracking-normal text-[#888888] mb-2"
            >
              Telefono
            </label>
            <input
              id="popup-phone"
              name="phone"
              type="tel"
              required
              className="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-white focus:outline-none focus:border-[#2e9bd6] transition-colors"
            />
            {state.fieldErrors?.phone && (
              <p className="mt-1 text-xs text-[#2e9bd6]">{state.fieldErrors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="popup-service"
              className="block text-xs font-bold uppercase tracking-normal text-[#888888] mb-2"
            >
              Servizio di interesse
            </label>
            <select
              id="popup-service"
              name="serviceId"
              required
              defaultValue={defaultServiceId ?? ""}
              className="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-white focus:outline-none focus:border-[#2e9bd6] transition-colors"
            >
              <option value="">Seleziona un servizio</option>
              {serviceOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
            {state.fieldErrors?.serviceId && (
              <p className="mt-1 text-xs text-[#2e9bd6]">{state.fieldErrors.serviceId}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="popup-message"
              className="block text-xs font-bold uppercase tracking-normal text-[#888888] mb-2"
            >
              Messaggio
            </label>
            <textarea
              id="popup-message"
              name="message"
              rows={3}
              required
              defaultValue={defaultMessage}
              className="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-white focus:outline-none focus:border-[#2e9bd6] transition-colors resize-none"
            />
            {state.fieldErrors?.message && (
              <p className="mt-1 text-xs text-[#2e9bd6]">{state.fieldErrors.message}</p>
            )}
          </div>

          {state.error && <p className="text-sm text-[#2e9bd6]">{state.error}</p>}

          <SubmitButton label={submitLabel} />
        </form>
      </div>
    </div>
  );
}
