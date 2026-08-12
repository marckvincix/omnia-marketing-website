import { getProjectsByServiceSlug } from "@/lib/data/projects";
import { StackedProjects } from "./stacked-projects";

export async function RelatedProjects({ serviceSlug }: { serviceSlug: string }) {
  const projects = await getProjectsByServiceSlug(serviceSlug);
  return <StackedProjects projects={projects} />;
}
