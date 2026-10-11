import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(160),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue?.message ?? "Invalid email." },
        { status: 422 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    const existing = await db.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: true, already: true });
    }

    await db.subscriber.create({ data: { email } });
    return NextResponse.json({ ok: true, already: false }, { status: 201 });
  } catch (error) {
    console.error("[api/newsletter] POST failed:", error);
    return NextResponse.json(
      { error: "Something went wrong on our side. Please try again." },
      { status: 500 }
    );
  }
}
