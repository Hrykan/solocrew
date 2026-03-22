import type { Doc } from "../../convex/_generated/dataModel";

const STATUS_COLORS: Record<string, string> = {
  healthy: "#22c55e",
  stale: "#eab308",
  offline: "#ef4444",
};

interface BotCardProps {
  bot: Doc<"bots">;
}

export function BotCard({ bot }: BotCardProps) {
  const statusColor = STATUS_COLORS[bot.status] ?? "#6b7280";
  const lastActive = bot.lastActive
    ? formatTimeAgo(bot.lastActive)
    : "unknown";

  return (
    <div className="bot-card">
      <div className="bot-card-header">
        <div
          className="status-dot"
          style={{ backgroundColor: statusColor }}
          title={bot.status}
        />
        <h3 className="bot-name">{bot.name}</h3>
        {bot.model && <span className="bot-model">{bot.model}</span>}
      </div>

      <p className="bot-purpose">{bot.purpose}</p>

      <div className="bot-meta">
        <span className="bot-username">{bot.botUsername}</span>
        {bot.group && <span className="bot-group">{bot.group}</span>}
      </div>

      <div className="bot-footer">
        <span className="bot-status">{bot.status}</span>
        <span className="bot-last-active">Active {lastActive}</span>
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
