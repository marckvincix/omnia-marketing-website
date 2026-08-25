-- Le policy "Anon insert/update/delete media" permettevano al ruolo public (chiunque
-- avesse la chiave anon del progetto — pubblica per design, spedita anche al browser per
-- l'upload diretto) di caricare, sovrascrivere o cancellare QUALSIASI file nel bucket
-- "media" chiamando l'API Storage direttamente, bypassando del tutto il sito e il suo
-- controllo requireAdmin(): la protezione esisteva solo a livello di codice, non di
-- database. Trovato mentre si indagava un warning del Security Advisor Supabase su una
-- policy correlata (listing pubblico del bucket, rimossa in una migrazione precedente).
--
-- Il codice server (src/lib/supabase-storage.ts) ora usa la chiave service_role — che
-- bypassa RLS di sua natura, come proprietaria — per firmare gli URL di upload e per
-- cancellare i file, quindi queste policy pubbliche non servono più a nulla di legittimo:
-- il caricamento vero e proprio dal browser usa un URL firmato con token generato da
-- quella chiamata server (già autorizzata a monte), non dipende da una policy INSERT
-- pubblica su storage.objects.
--
-- Verificato prima di applicarla: il flusso reale (server firma con service_role, browser
-- carica con la chiave pubblica sull'URL firmato) continua a funzionare; un insert diretto
-- con la sola chiave pubblica, senza passare da un URL firmato, non è più permesso.
DROP POLICY IF EXISTS "Anon insert media" ON storage.objects;
DROP POLICY IF EXISTS "Anon update media" ON storage.objects;
DROP POLICY IF EXISTS "Anon delete media" ON storage.objects;
