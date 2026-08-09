"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeNewsletter, type NewsletterActionState } from "@/lib/actions/newsletter";

const initialState: NewsletterActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-full bg-[#2e9bd6] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1c7fb8] disabled:opacity-60"
    >
      {pending ? "Invio…" : "Iscriviti"}
    </button>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeNewsletter, initialState);

  if (state.success) {
    return <p className="text-sm text-[#2e9bd6]">Iscrizione confermata, grazie!</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-2 w-full max-w-sm">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="La tua email"
          aria-label="Email per la newsletter"
          className="w-full rounded-full bg-[#111111] border border-[#2a2a2a] px-5 py-3 text-sm text-white placeholder:text-[#666666] focus:outline-none focus:border-[#2e9bd6] transition-colors"
        />
        <SubmitButton />
      </div>
      {state.error && <p className="text-xs text-[#2e9bd6]">{state.error}</p>}
    </form>
  );
}
