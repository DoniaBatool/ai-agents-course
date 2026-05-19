import { NextRequest, NextResponse } from "next/server";
import { Paddle, EventName } from "@paddle/paddle-node-sdk";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendCancellationEmail } from "@/lib/email";

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

    // Subscription cancelled → remove course access + send goodbye email
    if (event.eventType === EventName.SubscriptionCanceled) {
      const sub = event.data as any;
      if (sub.id) {
        // Fetch user details before updating
        const [cancelledUser] = await db
          .select({ email: user.email, name: user.name })
          .from(user)
          .where(eq(user.paddleSubscriptionId, sub.id));

        await db
          .update(user)
          .set({ isPaid: false })
          .where(eq(user.paddleSubscriptionId, sub.id));

        // Send cancellation email if we found the user
        if (cancelledUser) {
          await sendCancellationEmail({
            toEmail:     cancelledUser.email,
            studentName: cancelledUser.name,
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Paddle webhook error:", err);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
