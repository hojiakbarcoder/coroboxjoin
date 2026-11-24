import { ConvexError, v } from "convex/values"
import { internal } from "./_generated/api"
import { Id } from "./_generated/dataModel"
import { action, internalAction, internalMutation, mutation } from "./_generated/server"

/**
 * Internal mutation: persists a validated waitlist entry.
 * Only callable from other Convex functions (e.g. the `join` action below),
 * never directly from the client.
 */
export const insertWaitlist = internalMutation({
  args: {
    companyName: v.string(),
    lineType: v.string(),
    monthlyVolume: v.number(),
    contactName: v.string(),
    phone: v.string(),
    estimatedMonthlyCost: v.number(),
    submittedLang: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("waitlist", {
      ...args,
      createdAt: Date.now(),
    });
    return id;
  },
});

/**
 * Legacy Corobox waitlist entry point. Internal only: the current site no
 * longer uses it, and leaving it public would let anyone write leads unchecked.
 * Validates input, stores the record, then fires a Telegram notification.
 * Returns immediately after the DB write succeeds; Telegram failure does not
 * block the lead from being recorded.
 */
export const join = internalAction({
  args: {
    companyName: v.string(),
    lineType: v.string(),
    monthlyVolume: v.number(),
    contactName: v.string(),
    phone: v.string(),
    estimatedMonthlyCost: v.number(),
    submittedLang: v.string(),
  },
  handler:async (ctx, args): Promise<{ success: boolean; waitlistId: Id<"waitlist">}> => {
    // Basic server-side validation — never trust the client.
    if (args.companyName.trim().length < 2) {
      throw new Error("companyName_too_short");
    }
    if (args.contactName.trim().length < 2) {
      throw new Error("contactName_too_short");
    }
    if (args.phone.trim().length < 6) {
      throw new Error("phone_invalid");
    }
    if (!Number.isFinite(args.monthlyVolume) || args.monthlyVolume < 0) {
      throw new Error("monthlyVolume_invalid");
    }
    if (!["en", "uz", "ru"].includes(args.submittedLang)) {
      throw new Error("submittedLang_invalid");
    }

    const waitlistId = await ctx.runMutation(internal.waitlist.insertWaitlist, args);

    try {
      await ctx.runAction(internal.telegram.sendTelegramNotification, args);
    } catch (err) {
      // Lead is already saved; log and swallow notification failures.
      console.error("Telegram notification failed:", err);
    }

    return { success: true, waitlistId };
  },
});

// Upload rules for the contact form. Keep in sync with src/components/WenzzdayLanding.tsx.
export const MAX_FILE_BYTES = 50 * 1024 * 1024;
export const MAX_FILES = 30;
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];
// Note: contentType is the Content-Type sent with the upload. Browsers set it
// from the file, but a scripted client can send any value.
const isAllowedType = (type: string | undefined) =>
  !!type && (type.startsWith("image/") || ALLOWED_VIDEO_TYPES.includes(type));

/* ---------------------------- Rate limiting ---------------------------- */

const HOUR = 60 * 60 * 1000;
const LIMITS = {
  lead: { max: 3, windowMs: HOUR },
  upload: { max: 40, windowMs: HOUR },
} as const;
type LimitKind = keyof typeof LIMITS;

/**
 * Public functions below are only meant to be called by the site's own
 * Next.js API routes, which add the client IP (hashed). They prove that with
 * a shared secret set as LEAD_API_SECRET in both Convex and Vercel.
 */
function assertServerSecret(secret: string) {
  const expected = process.env.LEAD_API_SECRET;
  if (!expected) {
    console.error("LEAD_API_SECRET is not set in the Convex deployment.");
    throw new ConvexError("server_misconfigured");
  }
  if (secret !== expected) throw new ConvexError("forbidden");
}

/** Counts one event for this client; throws once the hourly limit is reached. */
async function consumeLimit(
  ctx: { db: import("./_generated/server").DatabaseWriter },
  kind: LimitKind,
  clientKey: string
) {
  const { max, windowMs } = LIMITS[kind];
  const key = `${kind}:${clientKey}`;
  const now = Date.now();
  const recent = await ctx.db
    .query("rateLimitEvents")
    .withIndex("by_key_at", (q) => q.eq("key", key).gt("at", now - windowMs))
    .take(max);
  if (recent.length >= max) throw new ConvexError("rate_limited");
  await ctx.db.insert("rateLimitEvents", { key, at: now });
}

export const consumeRateLimit = internalMutation({
  args: { kind: v.union(v.literal("lead"), v.literal("upload")), clientKey: v.string() },
  handler: async (ctx, { kind, clientKey }) => {
    await consumeLimit(ctx, kind, clientKey);
  },
});

/* ------------------------------- Uploads ------------------------------- */

/** Returns a short-lived URL the browser can POST one file to. Max 40 per IP per hour. */
export const generateUploadUrl = mutation({
  args: { secret: v.string(), clientKey: v.string() },
  handler: async (ctx, { secret, clientKey }) => {
    assertServerSecret(secret);
    await consumeLimit(ctx, "upload", clientKey);
    return await ctx.storage.generateUploadUrl();
  },
});

/* -------------------------------- Leads -------------------------------- */

const inspectionRequestArgs = {
  name: v.string(),
  email: v.string(),
  company: v.string(),
  partType: v.string(),
  monthlyVolume: v.number(),
  inspectionMethod: v.string(),
  attachments: v.optional(v.array(v.id("_storage"))),
};

export const insertInspectionRequest = internalMutation({
  args: inspectionRequestArgs,
  handler: async (ctx, args) => {
    const attachments = args.attachments ?? [];
    if (attachments.length > MAX_FILES) throw new ConvexError("too_many_files");

    for (const id of attachments) {
      const meta = await ctx.db.system.get("_storage", id);
      if (!meta || meta.size > MAX_FILE_BYTES || !isAllowedType(meta.contentType)) {
        for (const other of attachments) {
          if (await ctx.db.system.get("_storage", other)) await ctx.storage.delete(other);
        }
        throw new ConvexError("attachment_invalid");
      }
    }

    return await ctx.db.insert("inspectionRequests", {
      ...args,
      attachments,
      createdAt: Date.now(),
    });
  },
});

/**
 * Contact form submission. Max 3 per IP per hour.
 * Stores the lead, then sends a Telegram notification (failure is logged, not thrown).
 */
export const requestInspection = action({
  args: { ...inspectionRequestArgs, secret: v.string(), clientKey: v.string() },
  handler: async (
    ctx,
    { secret, clientKey, ...args }
  ): Promise<{ success: boolean; requestId: Id<"inspectionRequests"> }> => {
    assertServerSecret(secret);

    const clean = {
      name: args.name.trim(),
      email: args.email.trim().toLowerCase(),
      company: args.company.trim(),
      partType: args.partType.trim(),
      monthlyVolume: args.monthlyVolume,
      inspectionMethod: args.inspectionMethod.trim(),
      attachments: args.attachments ?? [],
    };
    if (clean.name.length < 2) throw new ConvexError("name_too_short");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) throw new ConvexError("email_invalid");
    if (clean.company.length < 2) throw new ConvexError("company_too_short");
    if (clean.partType.length < 2) throw new ConvexError("partType_too_short");
    if (clean.inspectionMethod.length < 2) throw new ConvexError("inspectionMethod_invalid");
    if (!Number.isFinite(clean.monthlyVolume) || clean.monthlyVolume < 0) {
      throw new ConvexError("monthlyVolume_invalid");
    }

    await ctx.runMutation(internal.waitlist.consumeRateLimit, { kind: "lead", clientKey });

    const requestId = await ctx.runMutation(
      internal.waitlist.insertInspectionRequest,
      clean
    );

    try {
      const attachmentUrls: string[] = [];
      for (const id of clean.attachments) {
        const url = await ctx.storage.getUrl(id);
        if (url) attachmentUrls.push(url);
      }
      const { attachments: _ids, ...fields } = clean;
      void _ids;
      await ctx.runAction(internal.telegram.sendInspectionRequestNotification, {
        ...fields,
        attachmentUrls,
      });
    } catch (err) {
      console.error("Telegram notification failed:", err);
    }

    return { success: true, requestId };
  },
});

/* ------------------------------- Cleanup ------------------------------- */

const ORPHAN_AGE_MS = 24 * HOUR;
const CLEANUP_BATCH = 100;

/**
 * Deletes stored files older than 24 hours that no lead references, plus
 * expired rate-limit records. Runs daily from convex/crons.ts and reschedules
 * itself until it has gone through every file old enough to delete.
 */
export const cleanupOrphanFiles = internalMutation({
  args: { cursor: v.optional(v.union(v.string(), v.null())) },
  handler: async (ctx, { cursor }): Promise<{ deleted: number }> => {
    const cutoff = Date.now() - ORPHAN_AGE_MS;

    const attached = new Set<string>();
    for await (const lead of ctx.db.query("inspectionRequests")) {
      for (const id of lead.attachments ?? []) attached.add(id);
    }

    // _storage is ordered by creation time, oldest first.
    const page = await ctx.db.system
      .query("_storage")
      .paginate({ numItems: CLEANUP_BATCH, cursor: cursor ?? null });

    let deleted = 0;
    let reachedRecent = false;
    for (const file of page.page) {
      if (file._creationTime >= cutoff) {
        reachedRecent = true;
        break;
      }
      if (!attached.has(file._id)) {
        await ctx.storage.delete(file._id);
        deleted++;
      }
    }

    if (!reachedRecent && !page.isDone) {
      await ctx.scheduler.runAfter(0, internal.waitlist.cleanupOrphanFiles, {
        cursor: page.continueCursor,
      });
    } else {
      // Last batch: also clear rate-limit records past every window.
      const expired = await ctx.db
        .query("rateLimitEvents")
        .withIndex("by_at", (q) => q.lt("at", Date.now() - HOUR))
        .take(1000);
      for (const e of expired) await ctx.db.delete(e._id);
    }

    if (deleted) console.log(`cleanupOrphanFiles: deleted ${deleted} orphaned file(s)`);
    return { deleted };
  },
});
