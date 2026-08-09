import { NextResponse } from "next/server";
import { syncHubBlogPosts } from "@/lib/sync/hub-content";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncHubBlogPosts();
  return NextResponse.json(result);
}
