import { readFileSync } from "node:fs";
import path from "node:path";

// Incorporato come data URI: i client email non caricano affidabilmente
// immagini remote (né SVG), quindi il logo deve viaggiare dentro l'HTML
// dell'email stessa, senza dipendere da un URL pubblico raggiungibile.
const logoBuffer = readFileSync(path.join(process.cwd(), "public", "logo-omnia-email.png"));

export const LOGO_DATA_URI = `data:image/png;base64,${logoBuffer.toString("base64")}`;
