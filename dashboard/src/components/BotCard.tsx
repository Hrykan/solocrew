import type { Doc } from "../../convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  healthy: {
    color: "text-signal-green",
    bg: "bg-signal-green",
    pulse: "pulse-healthy",
    label: "ONLINE",
  },
  stale: {
    color: "text-signal-amber",
    bg: "bg-signal-amber",
    pulse: "pulse-stale",
    label: "STALE",
  },
  offline: {
    color: "text-signal-red",
    bg: "bg-signal-red",
    pulse: "pulse-offline",
    label: "OFFLINE",
  },
} as const;

const ROLE_ICONS: Record<string, string> = {
  dev: "{}",
  coding: "{}",
  app: "{}",
  writer: "Aa",
  content: "Aa",
  research: "??",
  data: "DB",
  ops: ">>",
  deploy: ">>",
  general: "//",
  manage: "##",
  project: "##",
};

function getRoleIcon(purpose: string): string {
  const lower = purpose.toLowerCase();
  for (const [key, icon] of Object.entries(ROLE_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "::";
}

interface BotCardProps {
  bot: Doc<"bots">;
  index: number;
}

export function BotCard({ bot, index }: BotCardProps) {
  const status = STATUS_CONFIG[bot.status] ?? STATUS_CONFIG.offline;
  const lastActive = bot.lastActive ? formatTimeAgo(bot.lastActive) : "—";
  const roleIcon = getRoleIcon(bot.purpose);

  return (
    <Card
      className="group relative overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-ember/50 hover:shadow-[0_0_20px_-5px_rgba(220,50,50,0.15)]"
      style={{
        animation: `slide-up-fade 0.4s ease-out ${index * 0.08}s both`,
      }}
    >
      {/* Top accent line */}
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-all duration-300 group-hover:from-transparent group-hover:to-transparent ${
          bot.status === "healthy"
            ? "via-signal-green/40 group-hover:via-signal-green"
            : bot.status === "stale"
              ? "via-signal-amber/40 group-hover:via-signal-amber"
              : "via-signal-red/20 group-hover:via-signal-red/60"
        }`}
      />

      <CardHeader className="flex flex-row items-start gap-3 pb-2">
        {/* Role icon */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-border/80 bg-muted/50 font-mono text-sm font-bold text-ember/70 transition-colors group-hover:border-ember/30 group-hover:text-ember">
          {roleIcon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-heading text-sm font-bold tracking-wider text-foreground">
              {bot.name.toUpperCase()}
            </h3>

            {/* Status indicator */}
            <span
              className={`inline-block h-2 w-2 flex-shrink-0 rounded-full ${status.bg}`}
              style={{ animation: `${status.pulse} 2s ease-in-out infinite` }}
            />
          </div>

          <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
            {bot.botUsername}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="mb-3 text-sm text-muted-foreground/80">{bot.purpose}</p>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="outline"
            className={`font-mono text-[10px] tracking-wider ${status.color} border-current/20`}
          >
            {status.label}
          </Badge>

          {bot.model && (
            <Badge
              variant="secondary"
              className="font-mono text-[10px] tracking-wider"
            >
              {bot.model.toUpperCase()}
            </Badge>
          )}

          {bot.group && (
            <Badge
              variant="outline"
              className="font-mono text-[10px] tracking-wider text-ember/60 border-ember/20"
            >
              {bot.group.toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Footer data */}
        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2">
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground/50">
            LAST: {lastActive}
          </span>
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground/50">
            {bot.alias}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "NOW";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}M AGO`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}H AGO`;
  return `${Math.floor(seconds / 86400)}D AGO`;
}
