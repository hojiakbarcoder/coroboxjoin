import { api } from "@/convex/_generated/api";
import { clientKey, errorResponse, getServerConfig } from "@/src/lib/leadApi";

/** Returns a one-time Convex storage upload URL. Limited to 40 per IP per hour. */
export async function POST(request: Request) {
  try {
    const { client, secret } = getServerConfig();
    const url = await client.mutation(api.waitlist.generateUploadUrl, {
      secret,
      clientKey: clientKey(request, secret),
    });
    return Response.json({ url });
  } catch (err) {
    return errorResponse(err);
  }
}
