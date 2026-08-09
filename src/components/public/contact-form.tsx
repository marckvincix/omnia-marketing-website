"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactActionState } from "@/app/(public)/contatti/actions";
import { useVisitorName } from "@/lib/visitor-name-context";
import { LightBeamButton } from "./light-beam-button";

const initialState: ContactActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <LightBeamButton type="submit" disabled={pending} className="w-full py-4">
      {pending ? "Invio in corso…" : "Invia messaggio"}
    </LightBeamButton>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const { name } = useVisitorName();

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div>
        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-normal text-[#888888] mb-2">
          Nome
        </label>
        <input
          id="name"
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
        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-normal text-[#888888] mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-white focus:outline-none focus:border-[#2e9bd6] transition-colors"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-xs text-[#2e9bd6]">{state.fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-normal text-[#888888] mb-2">
          Telefono <span className="text-[#555555] normal-case">(facoltativo)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-white focus:outline-none focus:border-[#2e9bd6] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-normal text-[#888888] mb-2">
          Messaggio
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-white focus:outline-none focus:border-[#2e9bd6] transition-colors resize-none"
        />
        {state.fieldErrors?.message && (
          <p className="mt-1 text-xs text-[#2e9bd6]">{state.fieldErrors.message}</p>
        )}
      </div>

      {state.error && <p className="text-sm text-[#2e9bd6]">{state.error}</p>}

      <SubmitButton />
    </form>
  );
}
