import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  bots: defineTable({
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
  }).index("by_name", ["name"]),

  activity_log: defineTable({
    botName: v.string(),
    action: v.string(),
    detail: v.string(),
    timestamp: v.number(),
  }).index("by_bot", ["botName", "timestamp"]),

  tasks: defineTable({
    botName: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed")
    ),
    assignedAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_bot", ["botName", "assignedAt"]),
});
