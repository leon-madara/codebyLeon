import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 16 * 1024;

/** Bound memory use before parsing and reject cross-site browser submissions. */
export async function readSubmission(request: Request): Promise<
  { body: unknown; error?: never } | { body?: never; error: NextResponse }
> {
  const origin = request.headers.get("origin");
  if (
    request.headers.get("sec-fetch-site") === "cross-site" ||
    (origin !== null && origin !== new URL(request.url).origin)
  ) {
    return { error: NextResponse.json({ error: "Submission origin is not allowed." }, { status: 403 }) };
  }

  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    return { error: NextResponse.json({ error: "Please send JSON." }, { status: 415 }) };
  }

  const reader = request.body?.getReader();
  if (!reader) {
    return { error: NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }) };
  }

  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return { error: NextResponse.json({ error: "Submission is too large." }, { status: 413 }) };
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return { body: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) };
  } catch {
    return { error: NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }) };
  } finally {
    reader.releaseLock();
  }
}
