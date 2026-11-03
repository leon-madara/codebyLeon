import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submissionStorage } from "../_lib/storage";
import { readSubmission } from "../_lib/submission";

const TIERS = ["custom-website", "redesign-modernization", "portals-workflows"];
const STAGES = ["startup", "sme", "corporate"];
const OBJECTIVES = ["flagship", "rebrand", "intake", "retainer"];
const INTENTS = ["configurator", "discovery-call"];

const inquirySchema = z.object({
  intent: z.enum(INTENTS).default("configurator"),
  tier: z.enum(TIERS).nullable().optional(),
  stage: z.enum(STAGES).nullable().optional(),
  objective: z.enum(OBJECTIVES).nullable().optional(),
  timeline: z.string().trim().max(80).nullable().optional(),
  budget: z.string().trim().max(80).nullable().optional(),
  name: z.string().trim().min(2, "Please share your name.").max(80),
  email: z.string().trim().email("Please share a valid email address.").max(160),
  company: z.string().trim().max(120).nullable().optional(),
  projectDetails: z.string().trim().max(2000).nullable().optional(),
});

function makeReference(): string {
  // CBL- + 6 chars from a lookalike-safe alphabet
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[crypto.getRandomValues(new Uint32Array(1))[0] % alphabet.length];
  }
  return `CBL-${code}`;
}

export async function POST(request: NextRequest) {
  try {
    const submission = await readSubmission(request);
    if (submission.error) return submission.error;
    const body = submission.body;

    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue?.message ?? "Invalid submission." },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const storage = await submissionStorage(request);
    if (storage.error) return storage.error;

    // Persist with a collision-safe human reference
    let reference = makeReference();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        await storage.db.prepare(`INSERT INTO Inquiry
          (id, reference, intent, tier, stage, objective, timeline, budget, name, email, company, projectDetails)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .bind(crypto.randomUUID(), reference, data.intent, data.tier ?? null, data.stage ?? null,
            data.objective ?? null, data.timeline ?? null, data.budget ?? null, data.name,
            data.email.toLowerCase(), data.company ?? null, data.projectDetails ?? null).run();
        return NextResponse.json(
          { ok: true, reference },
          { status: 201 }
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes("UNIQUE constraint failed: Inquiry.reference")) {
          reference = makeReference();
          continue;
        }
        throw err;
      }
    }
    return NextResponse.json(
      { error: "Could not allocate a reference. Please retry." },
      { status: 500 }
    );
  } catch (error) {
    console.error("[api/inquiries] POST failed:", error);
    return NextResponse.json(
      { error: "Something went wrong on our side. Please try again." },
      { status: 500 }
    );
  }
}
