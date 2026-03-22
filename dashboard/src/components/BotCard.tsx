import type { Doc } from "../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  healthy: {
    color: "text-signal-green",
    bg: "bg-signal-green",
    pulse: "pulse-healthy",
    label: "ONLINE",
    borderHover: "hover:border-signal-green/25",
    glowHover: "hover:shadow-[0_8px_40px_-12px_oklch(0.78_0.16_160_/_0.2)]",
    lineVia: "via-signal-green/25 group-hover:via-signal-green/60",
    barWidth: "100%",
    barColor: "bg-signal-green/50",
  },
  stale: {
    color: "text-signal-amber",
    bg: "bg-signal-amber",
    pulse: "pulse-stale",
    label: "STALE",
    borderHover: "hover:border-signal-amber/20",
    glowHover: "hover:shadow-[0_8px_40px_-12px_oklch(0.84_0.13_80_/_0.15)]",
    lineVia: "via-signal-amber/20 group-hover:via-signal-amber/50",
    barWidth: "55%",
    barColor: "bg-signal-amber/40",
  },
  offline: {
    color: "text-signal-red",
    bg: "bg-signal-red",
    pulse: "pulse-offline",
    label: "OFFLINE",
    borderHover: "hover:border-signal-red/15",
    glowHover: "hover:shadow-[0_8px_40px_-12px_oklch(0.62_0.20_25_/_0.08)]",
    lineVia: "via-signal-red/15 group-hover:via-signal-red/30",
    barWidth: "12%",
    barColor: "bg-signal-red/30",
  },
} as const;

const ROLE_GLYPHS: Record<string, { icon: string; label: string }> = {
  dev: { icon: "⟨/⟩", label: "DEV" },
  coding: { icon: "⟨/⟩", label: "DEV" },
  app: { icon: "⟨/⟩", label: "APP" },
  writer: { icon: "¶", label: "WRITE" },
  content: { icon: "¶", label: "CONTENT" },
  research: { icon: "◎", label: "RESEARCH" },
  data: { icon: "⬡", label: "DATA" },
  pipeline: { icon: "⬡", label: "DATA" },
  ops: { icon: "⏣", label: "OPS" },
  deploy: { icon: "⏣", label: "DEPLOY" },
  general: { icon: "◇", label: "GENERAL" },
  manage: { icon: "△", label: "MGMT" },
  project: { icon: "△", label: "PROJECT" },
  video: { icon: "▷", label: "MEDIA" },
  clip: { icon: "▷", label: "MEDIA" },
};

function getRoleGlyph(purpose: string): { icon: string; label: string } {
  const lower = purpose.toLowerCase();
  for (const [key, glyph] of Object.entries(ROLE_GLYPHS)) {
    if (lower.includes(key)) return glyph;
  }
  return { icon: "◈", label: "AGENT" };
}

interface BotCardProps {
  bot: Doc<"bots">;
  index: number;
  featured?: boolean;
}

export function BotCard({ bot, index, featured }: BotCardProps) {
  const status = STATUS_CONFIG[bot.status] ?? STATUS_CONFIG.offline;
  const lastActive = bot.lastActive ? formatTimeAgo(bot.lastActive) : "—";
  const glyph = getRoleGlyph(bot.purpose);

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-500 ${status.borderHover} ${status.glowHover} ${featured ? "sm:flex sm:items-stretch" : ""}`}
      style={{
        animation: `rise-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both`,
      }}
    >
      {/* Top luminous edge */}
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-all duration-500 ${status.lineVia}`}
      />

      {/* Scan line on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent, oklch(0.78 0.14 192 / 0.03), transparent)",
            animation: "scan-line 2.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Featured card: glyph sidebar on desktop */}
      {featured && (
        <div className="hidden border-r border-border/30 bg-gradient-to-b from-biolum/5 to-jellyfish/3 sm:flex sm:w-28 sm:flex-col sm:items-center sm:justify-center sm:gap-2 lg:w-36">
          <span className="text-3xl text-biolum/30 transition-colors duration-500 group-hover:text-biolum/60 lg:text-4xl">
            {glyph.icon}
          </span>
          <span className="font-mono text-[8px] tracking-[0.3em] text-biolum-dim/50">
            {glyph.label}
          </span>
        </div>
      )}

      <div className={`relative flex-1 p-4 sm:p-5 ${featured ? "sm:p-6" : ""}`}>
        {/* Header */}
        <div className="mb-3 flex items-start gap-3">
          {/* Small glyph — hidden on featured desktop (shown in sidebar) */}
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-biolum/8 bg-gradient-to-br from-biolum/6 to-jellyfish/4 text-base text-biolum/35 transition-all duration-500 group-hover:border-biolum/20 group-hover:text-biolum/65 ${featured ? "sm:hidden" : ""}`}
          >
            {glyph.icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3
                className={`truncate font-heading font-bold tracking-[0.12em] text-foreground transition-colors duration-300 group-hover:text-biolum/90 ${featured ? "text-sm sm:text-base" : "text-[13px]"}`}
              >
                {bot.name.toUpperCase()}
              </h3>
              <span
                className={`inline-block h-2 w-2 flex-shrink-0 rounded-full ${status.bg}`}
                style={{ animation: `${status.pulse} 3s ease-in-out infinite` }}
              />
            </div>
            <p className="mt-0.5 truncate font-mono text-[11px] text-biolum-dim/60">
              {bot.botUsername}
            </p>
          </div>

          <span className="hidden flex-shrink-0 font-mono text-[7px] tracking-[0.3em] text-muted-foreground/25 sm:inline">
            {!featured && glyph.label}
          </span>
        </div>

        {/* Purpose */}
        <p
          className={`mb-3 leading-relaxed text-muted-foreground/65 ${featured ? "text-[13px] sm:text-sm sm:max-w-md" : "text-[13px]"}`}
        >
          {bot.purpose}
        </p>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <Badge
            variant="outline"
            className={`rounded-full px-2.5 py-0 font-mono text-[9px] tracking-[0.12em] ${status.color} border-current/12`}
          >
            {status.label}
          </Badge>
          {bot.model && (
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0 font-mono text-[9px] tracking-[0.12em] text-biolum/50"
            >
              {bot.model.toUpperCase()}
            </Badge>
          )}
          {bot.group && (
            <Badge
              variant="outline"
              className="rounded-full border-jellyfish/10 px-2.5 py-0 font-mono text-[9px] tracking-[0.12em] text-jellyfish/35"
            >
              {bot.group.toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Status bar + meta */}
        <div>
          <div className="mb-2 h-[2px] w-full overflow-hidden rounded-full bg-border/20">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${status.barColor}`}
              style={{ width: status.barWidth }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground/30">
              {lastActive}
            </span>
            <span className="font-mono text-[9px] tracking-[0.08em] text-muted-foreground/20">
              {bot.alias}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "ACTIVE NOW";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}M AGO`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}H AGO`;
  return `${Math.floor(seconds / 86400)}D AGO`;
}
