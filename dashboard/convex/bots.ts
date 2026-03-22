import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bots").collect();
  },
});

export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bots")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
  },
});

export const upsert = mutation({
  args: {
    name: v.string(),
    channel: v.string(),
    purpose: v.string(),
    project: v.optional(v.string()),
    alias: v.string(),
    group: v.optional(v.string()),
    model: v.optional(v.string()),
    botUsername: v.string(),
    status: v.union(
      v.literal("healthy"),
      v.literal("stale"),
      v.literal("offline")
    ),
    lastActive: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("bots")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      return await ctx.db.insert("bots", args);
    }
  },
});

export const updateStatus = mutation({
  args: {
    name: v.string(),
    status: v.union(
      v.literal("healthy"),
      v.literal("stale"),
      v.literal("offline")
    ),
    lastActive: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const bot = await ctx.db
      .query("bots")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (bot) {
      await ctx.db.patch(bot._id, {
        status: args.status,
        lastActive: args.lastActive,
      });
    }
  },
});

export const remove = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const bot = await ctx.db
      .query("bots")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (bot) {
      await ctx.db.delete(bot._id);
    }
  },
});
