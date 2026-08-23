import { getLocale } from "next-intl/server";
import { getProjectsByServiceSlug } from "@/lib/data/projects";
import { StackedProjects } from "./stacked-projects";

export async function RelatedProjects({ serviceSlug }: { serviceSlug: string }) {
  const locale = await getLocale();
  const projects = await getProjectsByServiceSlug(serviceSlug, locale);
  return <StackedProjects projects={projects} />;
}
