"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeNewsletter, type NewsletterActionState } from "@/lib/actions/newsletter";
import { LightBeamButton } from "./light-beam-button";

const initialState: NewsletterActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <LightBeamButton type="submit" disabled={pending} className="shrink-0">
      {pending ? "Invio…" : "Iscrivimi"}
    </LightBeamButton>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeNewsletter, initialState);

  if (state.success) {
    return <p className="text-sm text-[#2e9bd6]">Iscrizione confermata, grazie!</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-2 w-full max-w-2xl">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <div className="flex items-center gap-8">
        <input
          type="email"
          name="email"
          required
          placeholder="Inserisci la tua email"
          aria-label="Email per la newsletter"
          className="w-full bg-transparent border-0 border-b border-[#333333] pb-3 text-base text-white placeholder:text-[#666666] focus:outline-none focus:border-[#2e9bd6] transition-colors"
        />
        <SubmitButton />
      </div>
      {state.error && <p className="text-xs text-[#2e9bd6]">{state.error}</p>}
    </form>
  );
}
