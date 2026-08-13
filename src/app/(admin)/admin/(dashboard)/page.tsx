import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { RealtimeVisitors } from "@/components/admin/realtime-visitors";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const [services, projects, testimonials, faqs, team, posts, messages] = await Promise.all([
    prisma.service.count(),
    prisma.project.count(),
    prisma.testimonial.count(),
    prisma.faq.count(),
    prisma.teamMember.count(),
    prisma.blogPost.count(),
    prisma.contactSubmission.count({ where: { handled: false } }),
  ]);

  const stats = [
    { label: "Servizi", value: services, href: "/admin/servizi" },
    { label: "Progetti", value: projects, href: "/admin/progetti" },
    { label: "Testimonianze", value: testimonials, href: "/admin/testimonianze" },
    { label: "FAQ", value: faqs, href: "/admin/faq" },
    { label: "Team", value: team, href: "/admin/team" },
    { label: "Articoli blog", value: posts, href: "/admin/blog" },
    { label: "Messaggi da leggere", value: messages, href: "/admin/messaggi" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Panoramica dei contenuti del sito Omnia Marketing.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <RealtimeVisitors variant="card" />
      </div>

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
