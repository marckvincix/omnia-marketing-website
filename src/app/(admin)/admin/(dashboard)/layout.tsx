import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "./sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar userEmail={session.user?.email} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
