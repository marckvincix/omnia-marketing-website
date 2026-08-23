import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { RealtimeVisitors } from "@/components/admin/realtime-visitors";
import { Ga4OverviewCards } from "@/components/admin/ga4-overview-cards";
import { DeeplUsageCard } from "@/components/admin/deepl-usage-card";
import { getGa4Report, isGa4Configured } from "@/lib/analytics/ga4";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const [services, projects, testimonials, faqs, team, posts, messages, visitorNames, ga4Report] =
    await Promise.all([
      prisma.service.count(),
      prisma.project.count(),
      prisma.testimonial.count(),
      prisma.faq.count(),
      prisma.teamMember.count(),
      prisma.blogPost.count(),
      prisma.contactSubmission.count({ where: { handled: false } }),
      prisma.visitorName.count(),
      isGa4Configured() ? getGa4Report("30d") : Promise.resolve(null),
    ]);

  const stats = [
    { label: "Servizi", value: services, href: "/admin/servizi" },
    { label: "Progetti", value: projects, href: "/admin/progetti" },
    { label: "Testimonianze", value: testimonials, href: "/admin/testimonianze" },
    { label: "FAQ", value: faqs, href: "/admin/faq" },
    { label: "Team", value: team, href: "/admin/team" },
    { label: "Articoli blog", value: posts, href: "/admin/blog" },
    { label: "Messaggi da leggere", value: messages, href: "/admin/messaggi" },
    { label: "Visitatori registrati", value: visitorNames, href: "/admin/visitatori" },
  ];

  const ga4Data = ga4Report && !("error" in ga4Report) ? ga4Report : null;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Panoramica dei contenuti del sito Omnia Marketing.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <RealtimeVisitors variant="card" />
      </div>

      <DeeplUsageCard />

      {ga4Data && (
        <div className="mb-8">
          <Ga4OverviewCards overview={ga4Data.overview} comparisonLabel={ga4Data.comparisonLabel} />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition-colors"
          >
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold mb-4">Sezioni</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ADMIN_NAV.filter((i) => i.href !== "/admin").map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm hover:bg-accent transition-colors"
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
