import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { clientKey, errorResponse, getServerConfig } from "@/src/lib/leadApi";

/** Submits the contact form. Limited to 3 per IP per hour. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const attachments = Array.isArray(body.attachments)
    ? body.attachments.filter((a): a is string => typeof a === "string")
    : [];

  try {
    const { client, secret } = getServerConfig();
    const result = await client.action(api.waitlist.requestInspection, {
      name: String(body.name ?? ""),
      email: String(body.email ?? ""),
      company: String(body.company ?? ""),
      partType: String(body.partType ?? ""),
      monthlyVolume: Number(body.monthlyVolume),
      inspectionMethod: String(body.inspectionMethod ?? ""),
      attachments: attachments as Id<"_storage">[],
      secret,
      clientKey: clientKey(request, secret),
    });
    return Response.json({ success: result.success });
  } catch (err) {
    return errorResponse(err);
  }
}
