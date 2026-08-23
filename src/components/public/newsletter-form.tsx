"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { subscribeNewsletter, type NewsletterActionState } from "@/lib/actions/newsletter";
import { useVisitorName } from "@/lib/visitor-name-context";
import { useVisitorTracking } from "@/lib/visitor-tracking-context";
import { LightBeamButton } from "./light-beam-button";

const initialState: NewsletterActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("newsletter");
  return (
    <LightBeamButton type="submit" disabled={pending} className="shrink-0">
      {pending ? t("invio") : t("iscrivimi")}
    </LightBeamButton>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeNewsletter, initialState);
  const { name } = useVisitorName();
  const { visitorId } = useVisitorTracking();
  const locale = useLocale();
  const t = useTranslations("newsletter");

  if (state.success) {
    return (
      <p className="text-sm text-[#2e9bd6]">
        {name ? t("successoConNome", { name }) : t("successo")}
      </p>
    );
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
      {visitorId && <input type="hidden" name="visitorId" value={visitorId} />}
      <input type="hidden" name="locale" value={locale} />
      <div className="flex items-center gap-8">
        <input
          type="email"
          name="email"
          required
          placeholder={name ? t("placeholderConNome", { name }) : t("placeholder")}
          aria-label={t("ariaLabel")}
          className="w-full bg-transparent border-0 border-b border-[#333333] pb-3 text-base text-white placeholder:text-[#666666] focus:outline-none focus:border-[#2e9bd6] transition-colors"
        />
        <SubmitButton />
      </div>
      {state.error && <p className="text-xs text-[#2e9bd6]">{state.error}</p>}
    </form>
  );
}
