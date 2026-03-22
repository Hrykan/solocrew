export function FleetHeader() {
  return (
    <header className="mb-10">
      <div className="flex items-end gap-4">
        <div>
          <h1
            className="font-heading text-3xl font-black tracking-[0.15em] text-ember sm:text-4xl"
            style={{ animation: "flicker 12s infinite" }}
          >
            SOLOCREW
          </h1>
          <p className="mt-1 font-mono text-xs tracking-[0.4em] text-muted-foreground">
            COMMAND CENTER
          </p>
        </div>
        <div className="mb-1 ml-auto hidden items-center gap-2 sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-green" />
          </span>
          <span className="font-mono text-xs text-signal-green">CONNECTED</span>
        </div>
      </div>
      <div className="mt-3 h-px w-full bg-gradient-to-r from-ember via-ember/20 to-transparent" />
    </header>
  );
}
