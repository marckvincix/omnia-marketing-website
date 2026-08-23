import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";
import { EmailEventStatus } from "@/generated/prisma/client";
import { recordClickInterest } from "@/lib/email/record-click-interest";

interface ResendWebhookPayload {
  type: string;
  data: {
    email_id?: string;
  };
}

const EVENT_MAP: Record<string, { status: EmailEventStatus; field: string | null }> = {
  "email.sent": { status: EmailEventStatus.SENT, field: "sentAt" },
  "email.delivered": { status: EmailEventStatus.DELIVERED, field: "deliveredAt" },
  "email.delivery_delayed": { status: EmailEventStatus.DELIVERY_DELAYED, field: null },
  "email.opened": { status: EmailEventStatus.OPENED, field: "openedAt" },
  "email.clicked": { status: EmailEventStatus.CLICKED, field: "clickedAt" },
  "email.bounced": { status: EmailEventStatus.BOUNCED, field: "bouncedAt" },
  "email.complained": { status: EmailEventStatus.COMPLAINED, field: "complainedAt" },
};

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook non configurato" }, { status: 500 });
  }

  const payload = await request.text();
  const svixHeaders = {
    "svix-id": request.headers.get("svix-id") ?? "",
    "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
    "svix-signature": request.headers.get("svix-signature") ?? "",
  };

  let event: ResendWebhookPayload;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(payload, svixHeaders) as ResendWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Firma non valida" }, { status: 401 });
  }

  const mapping = EVENT_MAP[event.type];
  const emailId = event.data?.email_id;
  if (!mapping || !emailId) {
    return NextResponse.json({ ok: true });
  }

  const data: Record<string, unknown> = { status: mapping.status };
  if (mapping.field) data[mapping.field] = new Date();

  await prisma.emailEvent.updateMany({
    where: { resendEmailId: emailId },
    data,
  });

  if (mapping.status === EmailEventStatus.CLICKED) {
    const clickedEvent = await prisma.emailEvent.findUnique({
      where: { resendEmailId: emailId },
      select: { subscriberId: true, campaignId: true },
    });
    if (clickedEvent) {
      await recordClickInterest(clickedEvent.subscriberId, clickedEvent.campaignId);
    }
  }

  return NextResponse.json({ ok: true });
}
