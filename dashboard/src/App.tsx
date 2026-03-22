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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FleetHeader />

        {/* Status bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 font-mono text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-signal-green" />
              <span className="text-signal-green">{healthyCount} ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-signal-amber" />
              <span className="text-signal-amber">{staleCount} STALE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-signal-red" />
              <span className="text-signal-red">{offlineCount} OFFLINE</span>
            </div>
            <div className="text-muted-foreground">
              {totalCount} TOTAL
            </div>
          </div>

          {/* Group filter */}
          {groups.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                FILTER:
              </span>
              <Badge
                variant={groupFilter === null ? "default" : "outline"}
                className="cursor-pointer font-mono text-xs"
                onClick={() => setGroupFilter(null)}
              >
                ALL
              </Badge>
              {groups.map((group) => (
                <Badge
                  key={group}
                  variant={groupFilter === group ? "default" : "outline"}
                  className="cursor-pointer font-mono text-xs"
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

        {/* Separator line */}
        <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-ember/40 to-transparent" />

        {/* Bot grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bots === undefined ? (
            <div className="col-span-full py-20 text-center">
              <p className="animate-pulse font-heading text-sm tracking-[0.3em] text-ember">
                ESTABLISHING UPLINK...
              </p>
            </div>
          ) : filteredBots!.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="font-heading text-sm tracking-[0.3em] text-muted-foreground">
                NO AGENTS DETECTED
              </p>
              <p className="mt-2 font-mono text-xs text-muted-foreground/60">
                Run the sync service to populate the command center
              </p>
            </div>
          ) : (
            filteredBots!.map((bot, i) => (
              <BotCard key={bot._id} bot={bot} index={i} />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs">
          <span className="font-mono text-muted-foreground/40">
            SOLOCREW COMMAND CENTER v1.1.0
          </span>
          <span className="text-ember/30">|</span>
          <span
            className="font-mono text-muted-foreground/40"
            style={{ animation: "flicker 8s infinite" }}
          >
            SYSTEM NOMINAL
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
