"use node";

import { v } from "convex/values"
import { internalAction } from "./_generated/server"

/**
 * Sends a Markdown-formatted lead notification to a Telegram chat via the
 * Bot API. Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to be set in the
 * Convex deployment environment variables.
 */
export const sendTelegramNotification = internalAction({
  args: {
    companyName: v.string(),
    contactName: v.string(),
    phone: v.string(),
    lineType: v.string(),
    monthlyVolume: v.number(),
    estimatedMonthlyCost: v.number(),
    submittedLang: v.string(),
  },
  handler: async (_ctx, args) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error(
        "Telegram credentials missing: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set."
      );
      return { ok: false, error: "missing_credentials" };
    }

    const langLabel: Record<string, string> = {
      en: "English",
      uz: "Uzbek",
      ru: "Russian",
    };

    const text = [
      "*New Corobox Waitlist Lead*",
      "",
      `*Company:* ${escapeMarkdown(args.companyName)}`,
      `*Contact:* ${escapeMarkdown(args.contactName)}`,
      `*Phone:* ${escapeMarkdown(args.phone)}`,
      `*Line Type:* ${escapeMarkdown(args.lineType)}`,
      `*Monthly Volume:* ${args.monthlyVolume.toLocaleString("en-US")} units`,
      `*Est. Monthly Cost:* $${args.estimatedMonthlyCost.toFixed(2)}`,
      `*Submitted Language:* ${langLabel[args.submittedLang] ?? args.submittedLang}`,
    ].join("\n");

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Telegram API error:", res.status, body);
      return { ok: false, error: body };
    }

    return { ok: true };
  },
});

function escapeMarkdown(input: string): string {
  // Escapes Telegram legacy-Markdown special characters to avoid broken formatting.
  return input.replace(/([_*`\[])/g, "\\$1");
}