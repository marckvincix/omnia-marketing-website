import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PostEditor } from "../post-editor";

export const metadata: Metadata = {
  title: "Nuovo articolo",
  robots: { index: false, follow: false },
};

export default async function NewBlogPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.blogTag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <AdminPageHeader title="Nuovo articolo" />
      <PostEditor categoryOptions={categories} tagOptions={tags} />
    </div>
  );
}
