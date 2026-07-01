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
});
