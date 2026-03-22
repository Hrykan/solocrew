import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listForBot = query({
  args: { botName: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("tasks")
      .withIndex("by_bot", (q) => q.eq("botName", args.botName))
      .order("desc")
      .take(limit);
  },
});

export const create = mutation({
  args: {
    botName: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      botName: args.botName,
      description: args.description,
      status: "pending",
      assignedAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    const update: Record<string, unknown> = { status: args.status };
    if (args.status === "completed" || args.status === "failed") {
      update.completedAt = Date.now();
    }
    await ctx.db.patch(args.taskId, update);
  },
});
