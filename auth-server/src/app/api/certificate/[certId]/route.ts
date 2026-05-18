import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Public endpoint — no auth needed (certificate is public to share)
export async function GET(
  _req: NextRequest,
  { params }: { params: { certId: string } }
) {
  const { certId } = params;

  const [found] = await db
    .select({ name: user.name, certificateId: user.certificateId, completedAt: user.completedAt })
    .from(user)
    .where(eq(user.certificateId, certId));

  if (!found) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found:       true,
    studentName: found.name,
    certId:      found.certificateId,
    completedAt: found.completedAt,
  });
}
