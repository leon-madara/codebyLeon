import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

type Statement = {
  bind(...values: (string | number | null)[]): Statement;
  run(): Promise<{ success: boolean }>;
};
type SubmissionEnv = {
  DB: { prepare(sql: string): Statement };
  SUBMISSION_LIMITER: { limit(options: { key: string }): Promise<{ success: boolean }> };
};

export async function submissionStorage(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const bindings = env as unknown as SubmissionEnv;
  const { success } = await bindings.SUBMISSION_LIMITER.limit({
    key: `${new URL(request.url).pathname}:${request.headers.get("cf-connecting-ip") ?? "local"}`,
  });
  if (!success) {
    return { error: NextResponse.json({ error: "Please wait a minute before trying again." }, { status: 429, headers: { "Retry-After": "60" } }) };
  }
  return { db: bindings.DB };
}
