"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { submitContact, type ContactActionState } from "@/app/(public)/[locale]/contatti/actions";
import { useVisitorName } from "@/lib/visitor-name-context";
import { LightBeamButton } from "./light-beam-button";

const initialState: ContactActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("pages.contatti.form");
  return (
    <LightBeamButton type="submit" disabled={pending} className="w-full py-4">
      {pending ? t("invioInCorso") : t("inviaMessaggio")}
    </LightBeamButton>
  );
}

export function ContactForm({
  serviceOptions = [],
  defaultServiceId,
}: {
  serviceOptions?: { id: string; title: string }[];
  defaultServiceId?: string;
}) {
  const [state, formAction] = useActionState(submitContact, initialState);
  const { name } = useVisitorName();
  const t = useTranslations("pages.contatti.form");

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
          {t("nome")}
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
          {t("email")}
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
          {t("telefono")}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-white focus:outline-none focus:border-[#2e9bd6] transition-colors"
        />
        {state.fieldErrors?.phone && (
          <p className="mt-1 text-xs text-[#2e9bd6]">{state.fieldErrors.phone}</p>
        )}
      </div>

      {serviceOptions.length > 0 && (
        <div>
          <label htmlFor="serviceId" className="block text-xs font-bold uppercase tracking-normal text-[#888888] mb-2">
            {t("servizioDiInteresse")}
          </label>
          <select
            id="serviceId"
            name="serviceId"
            required
            defaultValue={defaultServiceId ?? ""}
            className="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-white focus:outline-none focus:border-[#2e9bd6] transition-colors"
          >
            <option value="">{t("selezionaUnServizio")}</option>
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
      )}

      <div>
        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-normal text-[#888888] mb-2">
          {t("messaggio")}
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
