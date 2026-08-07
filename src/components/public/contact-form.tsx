"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactActionState } from "@/app/(public)/contatti/actions";

const initialState: ContactActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-[#ff6b50] hover:bg-[#e55a40] disabled:opacity-60 text-black font-bold py-4 transition-colors"
    >
      {pending ? "Invio in corso…" : "Invia messaggio"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);

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
        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-[#888888] mb-2">
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-white focus:outline-none focus:border-[#ff6b50] transition-colors"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-xs text-[#ff6b50]">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-[#888888] mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-white focus:outline-none focus:border-[#ff6b50] transition-colors"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-xs text-[#ff6b50]">{state.fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-[#888888] mb-2">
          Telefono <span className="text-[#555555] normal-case">(facoltativo)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-white focus:outline-none focus:border-[#ff6b50] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-[#888888] mb-2">
          Messaggio
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-white focus:outline-none focus:border-[#ff6b50] transition-colors resize-none"
        />
        {state.fieldErrors?.message && (
          <p className="mt-1 text-xs text-[#ff6b50]">{state.fieldErrors.message}</p>
        )}
      </div>

      {state.error && <p className="text-sm text-[#ff6b50]">{state.error}</p>}

      <SubmitButton />
    </form>
  );
}
