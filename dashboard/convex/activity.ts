import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listForBot = query({
  args: { botName: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("activity_log")
      .withIndex("by_bot", (q) => q.eq("botName", args.botName))
      .order("desc")
      .take(limit);
  },
});

export const log = mutation({
  args: {
    botName: v.string(),
    action: v.string(),
    detail: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activity_log", {
      ...args,
      timestamp: Date.now(),
    });
  },
});
