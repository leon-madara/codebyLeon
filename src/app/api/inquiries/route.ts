import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

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
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `CBL-${code}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue?.message ?? "Invalid submission." },
        { status: 422 }
      );
    }

    const data = parsed.data;

    // Persist with a collision-safe human reference
    let reference = makeReference();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        const created = await db.inquiry.create({
          data: {
            reference,
            intent: data.intent,
            tier: data.tier ?? null,
            stage: data.stage ?? null,
            objective: data.objective ?? null,
            timeline: data.timeline ?? null,
            budget: data.budget ?? null,
            name: data.name,
            email: data.email.toLowerCase(),
            company: data.company ?? null,
            projectDetails: data.projectDetails ?? null,
          },
        });
        return NextResponse.json(
          { ok: true, reference: created.reference },
          { status: 201 }
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes("Unique constraint")) {
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

export async function GET() {
  try {
    const total = await db.inquiry.count();
    return NextResponse.json({ ok: true, total });
  } catch (error) {
    console.error("[api/inquiries] GET failed:", error);
    return NextResponse.json({ ok: false, total: 0 }, { status: 500 });
  }
}
