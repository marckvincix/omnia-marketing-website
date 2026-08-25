-- Row Level Security era già abilitata su tutte le tabelle presenti alla creazione del
-- progetto Supabase, ma nessuna migrazione aggiunta dopo (traduzioni i18n, tracciamento
-- email/visitatori) l'ha mai attivata sulle tabelle nuove: Postgres la lascia disattivata
-- di default su ogni tabella creata, quindi restavano raggiungibili in lettura/scrittura
-- dall'API REST pubblica di Supabase (PostgREST) a chiunque conoscesse URL del progetto e
-- chiave anon — segnalato da un alert di sicurezza Supabase ("Table publicly accessible").
--
-- Nessuna policy da aggiungere: l'app usa solo la connessione diretta Postgres di Prisma
-- (che come proprietaria delle tabelle bypassa comunque RLS, esattamente come già succede
-- per le altre 22 tabelle che hanno RLS abilitata senza policy) — attivare RLS qui blocca
-- solo l'accesso pubblico via PostgREST, che questo progetto non usa e non deve esporre.
ALTER TABLE "public"."EmailEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."NewsletterSubscriber" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."EmailCampaign" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."VisitorName" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."SubscriberInterest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."SiteSettingsTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ServiceTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ServiceBenefitTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ProjectTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."TestimonialTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."FaqTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."TeamMemberTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."BlogPostTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."EmailSendLog" ENABLE ROW LEVEL SECURITY;
