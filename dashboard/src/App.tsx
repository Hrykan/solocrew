import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { BotCard } from "@/components/BotCard";
import { FleetHeader } from "@/components/FleetHeader";
import { Badge } from "@/components/ui/badge";
import "./App.css";

function App() {
  const bots = useQuery(api.bots.list);
  const [groupFilter, setGroupFilter] = useState<string | null>(null);

  const filteredBots = bots?.filter(
    (b) => !groupFilter || b.group === groupFilter
  );
  const groups = [...new Set(bots?.map((b) => b.group).filter(Boolean) ?? [])];

  const healthyCount =
    filteredBots?.filter((b) => b.status === "healthy").length ?? 0;
  const staleCount =
    filteredBots?.filter((b) => b.status === "stale").length ?? 0;
  const offlineCount =
    filteredBots?.filter((b) => b.status === "offline").length ?? 0;
  const totalCount = filteredBots?.length ?? 0;

  return (
    <div className="relative z-10 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <FleetHeader />

        {/* Telemetry + Filters — stacked on mobile, inline on desktop */}
        <div className="mb-6 space-y-3 sm:mb-8 sm:flex sm:items-center sm:justify-between sm:space-y-0">
          {/* Telemetry strip */}
          <div className="inline-flex items-center gap-3 rounded-full border border-border/30 bg-abyss/40 px-4 py-2 backdrop-blur-sm sm:gap-4 sm:px-5">
            <StatusPip color="bg-signal-green" count={healthyCount} />
            <StatusPip color="bg-signal-amber" count={staleCount} />
            <StatusPip color="bg-signal-red" count={offlineCount} />
            <span className="hidden font-mono text-[9px] tracking-[0.2em] text-muted-foreground/30 sm:inline">
              {totalCount} DEPLOYED
            </span>
          </div>

          {/* Sector filter */}
          {groups.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant={groupFilter === null ? "default" : "outline"}
                className="cursor-pointer rounded-full px-3 py-1 font-mono text-[10px] tracking-wider transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={() => setGroupFilter(null)}
              >
                ALL
              </Badge>
              {groups.map((group) => (
                <Badge
                  key={group}
                  variant={groupFilter === group ? "default" : "outline"}
                  className="cursor-pointer rounded-full px-3 py-1 font-mono text-[10px] tracking-wider transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() =>
                    setGroupFilter(groupFilter === group ? null : group!)
                  }
                >
                  {group!.toUpperCase()}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Bot grid — asymmetric: first card spans wide on lg */}
        {bots === undefined ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div
              className="mb-6 h-20 w-20 rounded-full border border-biolum/10"
              style={{
                background: "radial-gradient(circle, oklch(0.78 0.14 192 / 0.12), transparent 70%)",
                animation: "breathe 3s ease-in-out infinite",
              }}
            />
            <p className="font-heading text-xs tracking-[0.4em] text-biolum/40">
              SCANNING DEPTHS
            </p>
            <div className="mt-3 flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1 w-6 rounded-full bg-biolum/20"
                  style={{
                    animation: `pulse-healthy 1.5s ease-in-out ${i * 0.3}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : filteredBots!.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="font-heading text-xs tracking-[0.4em] text-muted-foreground/40">
              NO AGENTS IN SECTOR
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12 lg:gap-5">
            {filteredBots!.map((bot, i) => (
              <div
                key={bot._id}
                className={
                  i === 0
                    ? "sm:col-span-2 lg:col-span-5"
                    : i === 1
                      ? "lg:col-span-4"
                      : i === 2
                        ? "lg:col-span-3"
                        : i % 3 === 0
                          ? "lg:col-span-4"
                          : "lg:col-span-4"
                }
              >
                <BotCard bot={bot} index={i} featured={i === 0} />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 flex flex-col items-center gap-2 sm:mt-20">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-gradient-to-r from-transparent to-biolum/15 sm:w-8" />
            <span className="font-mono text-[7px] tracking-[0.4em] text-muted-foreground/20 sm:text-[8px]">
              SOLOCREW v1.1.0
            </span>
            <div className="h-px w-6 bg-gradient-to-l from-transparent to-biolum/15 sm:w-8" />
          </div>
        </footer>
      </div>
    </div>
  );
}

function StatusPip({ color, count }: { color: string; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} />
      <span className="font-mono text-[12px] font-semibold tabular-nums text-foreground/70">
        {count}
      </span>
    </div>
  );
}

export default App;
