import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  waitlist: defineTable({
    companyName: v.string(),
    lineType: v.string(),
    monthlyVolume: v.number(),
    contactName: v.string(),
    phone: v.string(),
    estimatedMonthlyCost: v.number(),
    submittedLang: v.string(), // 'en' | 'uz' | 'ru'
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_lang", ["submittedLang"]),

  // Leads from the Wenzzday Robotics contact form.
  inspectionRequests: defineTable({
    name: v.string(),
    email: v.string(),
    company: v.string(),
    partType: v.string(),
    monthlyVolume: v.number(),
    inspectionMethod: v.string(),
    // Optional photos/videos uploaded with the request (Convex file storage).
    attachments: v.optional(v.array(v.id("_storage"))),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  // One row per rate-limited event; key is "<kind>:<hashed client IP>".
  rateLimitEvents: defineTable({
    key: v.string(),
    at: v.number(),
  })
    .index("by_key_at", ["key", "at"])
    .index("by_at", ["at"]),
});
