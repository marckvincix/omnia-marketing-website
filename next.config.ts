import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Il logo email viene letto via fs.readFileSync a runtime (per incorporarlo come
  // data URI nelle email): il file tracing di Vercel non lo rileva perché il percorso
  // è costruito dinamicamente, quindi va incluso esplicitamente nel bundle serverless.
  outputFileTracingIncludes: {
    "/**": [
      "./public/logo-omnia-email.png",
      "./public/email-icon-instagram.png",
      "./public/email-icon-facebook.png",
      "./public/email-icon-linkedin.png",
    ],
  },
  experimental: {
    serverActions: {
      // Consente il caricamento di immagini (20MB) e video (100MB) dal form progetti.
      bodySizeLimit: "150mb",
    },
    // Il middleware admin intercetta anche le richieste di upload: senza questo, Next.js
    // tronca il body a 10MB prima ancora che la server action lo veda.
    middlewareClientMaxBodySize: "150mb",
    // Senza questo, il router client-side riusa le pagine già visitate dalla cache del
    // browser anche dopo una modifica in admin (revalidatePath), finché non scade il
    // timer interno o l'utente ricarica a mano: qui i contenuti sono gestiti da admin
    // e devono risultare aggiornati ad ogni navigazione, non solo dopo un F5.
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "hub.omniamarketing.it",
        pathname: "/api/aggiornamenti/cover**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
