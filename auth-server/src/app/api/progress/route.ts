import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user, userProgress, session } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { sendCertificateEmail } from "@/lib/email";

const FRONTEND_ORIGIN = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";

// Verify Bearer token against DB sessions table → returns userId or null
async function getUserIdFromToken(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  if (!token) return null;

  const [row] = await db
    .select({ userId: session.userId, expiresAt: session.expiresAt })
    .from(session)
    .where(eq(session.token, token));

  if (!row) return null;
  if (new Date(row.expiresAt) < new Date()) return null; // expired

  return row.userId;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin":      FRONTEND_ORIGIN,
    "Access-Control-Allow-Methods":     "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":     "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

// Total lessons across all 4 modules
// Module 1: 4, Module 2: 4, Module 3: 4, Module 4: 5 = 17 total
const TOTAL_LESSONS = 17;

// ── POST /api/progress ─────────────────────────────────────────────────────────
// Called from frontend when student clicks "Mark as Complete" on a lesson
// Body: { lessonId: "module-1/lesson-1" }
export async function POST(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders() });
  }

  const body = await req.json().catch(() => ({}));
  const { lessonId } = body as { lessonId?: string };

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId is required" }, { status: 400, headers: corsHeaders() });
  }

  // Insert progress record (ignore duplicates — unique constraint handles it)
  try {
    await db.insert(userProgress).values({
      id:       `${userId}-${lessonId}`,
      userId,
      lessonId,
    }).onConflictDoNothing();
  } catch {
    // Already recorded — that's fine
  }

  // Count how many unique lessons this user has completed
  const [{ value: completedCount }] = await db
    .select({ value: count() })
    .from(userProgress)
    .where(eq(userProgress.userId, userId));

  const courseComplete = completedCount >= TOTAL_LESSONS;

  // If course just completed and no certificate issued yet, issue one now
  if (courseComplete) {
    const [currentUser] = await db
      .select({ certificateId: user.certificateId, name: user.name, email: user.email })
      .from(user)
      .where(eq(user.id, userId));

    if (!currentUser.certificateId) {
      // Generate unique certificate ID: AAC-2025-XXXXXX
      const year = new Date().getFullYear();
      const suffix = userId.slice(0, 6).toUpperCase();
      const certId = `AAC-${year}-${suffix}`;

      await db.update(user)
        .set({ completedAt: new Date(), certificateId: certId })
        .where(eq(user.id, userId));

      // Send certificate email
      const authServerUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";
      const certLink = `${authServerUrl}/certificate/${certId}`;

      await sendCertificateEmail({
        toEmail:     currentUser.email,
        studentName: currentUser.name,
        certId,
        certLink,
      });

      return NextResponse.json({
        completed:    true,
        certId,
        certLink,
        totalLessons: TOTAL_LESSONS,
        completedCount,
      }, { headers: corsHeaders() });
    }
  }

  return NextResponse.json({
    completed:    courseComplete,
    totalLessons: TOTAL_LESSONS,
    completedCount,
  }, { headers: corsHeaders() });
}

// ── GET /api/progress ──────────────────────────────────────────────────────────
// Returns user's completed lesson IDs + overall progress
export async function GET(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders() });
  }

  const lessons = await db
    .select({ lessonId: userProgress.lessonId })
    .from(userProgress)
    .where(eq(userProgress.userId, userId));

  const completedLessonIds = lessons.map((l) => l.lessonId);

  const [currentUser] = await db
    .select({ certificateId: user.certificateId, completedAt: user.completedAt })
    .from(user)
    .where(eq(user.id, userId));

  return NextResponse.json({
    completedLessonIds,
    totalLessons:   TOTAL_LESSONS,
    completedCount: completedLessonIds.length,
    courseComplete: completedLessonIds.length >= TOTAL_LESSONS,
    certificateId:  currentUser?.certificateId ?? null,
    completedAt:    currentUser?.completedAt ?? null,
  }, { headers: corsHeaders() });
}
