import { NextRequest, NextResponse } from "next/server";
import { Paddle, EventName } from "@paddle/paddle-node-sdk";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const paddle = new Paddle(process.env.PADDLE_API_KEY!);

export async function POST(req: NextRequest) {
  const body      = await req.text();
  const signature = req.headers.get("paddle-signature") ?? "";

  try {
    const event = await paddle.webhooks.unmarshal(
      body,
      process.env.PADDLE_WEBHOOK_SECRET!,
      signature,
    );

    // Subscription created → unlock course access
    if (event.eventType === EventName.SubscriptionCreated) {
      const sub        = event.data as any;
      const customData = sub.customData as { userId?: string } | null;
      const userId_    = customData?.userId;

      if (userId_) {
        await db
          .update(user)
          .set({
            isPaid:               true,
            paddleSubscriptionId: sub.id,
            paddleCustomerId:     sub.customerId,
          })
          .where(eq(user.id, userId_));
      }
    }

    // Subscription cancelled → remove course access
    if (event.eventType === EventName.SubscriptionCanceled) {
      const sub = event.data as any;
      if (sub.id) {
        await db
          .update(user)
          .set({ isPaid: false })
          .where(eq(user.paddleSubscriptionId, sub.id));
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Paddle webhook error:", err);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
