"use server";

import { auth } from "@/lib/auth";
import { getGa4Realtime, isGa4Configured } from "./ga4";

export async function fetchRealtimeVisitors() {
  const session = await auth();
  if (!session) return { error: "not_authorized" };
  if (!isGa4Configured()) return { error: "not_configured" };
  return getGa4Realtime();
}
