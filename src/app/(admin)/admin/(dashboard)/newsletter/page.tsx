import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SubscriberRow } from "./subscriber-row";
import { PostSendRow } from "./post-send-row";

export const metadata: Metadata = {
  title: "Newsletter",
  robots: { index: false, follow: false },
};

export default async function AdminNewsletterPage() {
  const [subscribers, posts] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <div>
        <AdminPageHeader
          title="Newsletter"
          description="Invia gli aggiornamenti del blog agli iscritti alla newsletter."
        />

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Articolo</TableHead>
                <TableHead>Pubblicato</TableHead>
                <TableHead>Invio</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <PostSendRow
                  key={post.id}
                  post={{
                    id: post.id,
                    title: post.title,
                    publishedAt: post.publishedAt?.toISOString() ?? null,
                    newsletterSentAt: post.newsletterSentAt?.toISOString() ?? null,
                  }}
                  subscriberCount={subscribers.length}
                />
              ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Nessun articolo pubblicato ancora.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <AdminPageHeader
          title="Iscritti"
          description={`${subscribers.length} ${subscribers.length === 1 ? "iscritto" : "iscritti"} alla newsletter.`}
        />

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Iscritto il</TableHead>
                <TableHead className="w-16 text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber) => (
                <SubscriberRow
                  key={subscriber.id}
                  subscriber={{
                    id: subscriber.id,
                    email: subscriber.email,
                    createdAt: subscriber.createdAt.toISOString(),
                  }}
                />
              ))}
              {subscribers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    Nessun iscritto ancora.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
