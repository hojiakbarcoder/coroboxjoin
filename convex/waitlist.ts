import { v } from "convex/values"
import { internal } from "./_generated/api"
import { action, internalMutation } from "./_generated/server"

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
 * Public action: entry point called from the client form.
 * Validates input, stores the record, then fires a Telegram notification.
 * Returns immediately after the DB write succeeds; Telegram failure does not
 * block the lead from being recorded.
 */
export const join = action({
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
