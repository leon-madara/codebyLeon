import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submissionStorage } from "../_lib/storage";
import { readSubmission } from "../_lib/submission";

const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(160),
});

export async function POST(request: NextRequest) {
  try {
    const submission = await readSubmission(request);
    if (submission.error) return submission.error;
    const body = submission.body;

    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue?.message ?? "Invalid email." },
        { status: 422 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    const storage = await submissionStorage(request);
    if (storage.error) return storage.error;
    await storage.db.prepare("INSERT INTO Subscriber (id, email) VALUES (?, ?) ON CONFLICT(email) DO NOTHING")
      .bind(crypto.randomUUID(), email).run();
    // Existing and new addresses get the same status and payload.
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/newsletter] POST failed:", error);
    return NextResponse.json(
      { error: "Something went wrong on our side. Please try again." },
      { status: 500 }
    );
  }
}
