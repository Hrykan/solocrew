export function FleetHeader() {
  return (
    <header className="relative mb-8 sm:mb-12">
      {/* Glow bloom — bigger on desktop */}
      <div
        className="pointer-events-none absolute -left-6 -top-4 h-24 w-48 rounded-full opacity-25 sm:-left-10 sm:-top-8 sm:h-36 sm:w-72"
        style={{
          background: "radial-gradient(circle, oklch(0.78 0.14 192 / 0.35), transparent 70%)",
          animation: "breathe 6s ease-in-out infinite",
        }}
      />

      <div className="relative">
        {/* Top line + label */}
        <div className="mb-2 flex items-center gap-2 sm:mb-3">
          <div className="h-px w-5 bg-biolum/30 sm:w-8" />
          <span className="font-mono text-[7px] tracking-[0.5em] text-biolum-dim/60 sm:text-[9px]">
            FLEET OPERATIONS
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <h1
              className="font-heading text-2xl font-black tracking-[0.15em] text-biolum sm:text-4xl lg:text-5xl"
              style={{ animation: "breathe 6s ease-in-out infinite" }}
            >
              SOLOCREW
            </h1>
            <div className="mt-1 flex items-center gap-2 sm:mt-2 sm:gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-biolum/40 to-transparent sm:w-12" />
              <p className="font-mono text-[8px] tracking-[0.4em] text-muted-foreground/40 sm:text-[10px]">
                COMMAND CENTER
              </p>
            </div>
          </div>

          {/* Connection — hidden on smallest screens */}
          <div className="mb-1 hidden items-center gap-2.5 sm:flex">
            <div className="relative">
              <span
                className="absolute inline-flex h-2 w-2 rounded-full bg-signal-green"
                style={{ animation: "sonar 3s ease-out infinite" }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-green shadow-[0_0_6px_2px_oklch(0.78_0.16_160_/_0.25)]" />
            </div>
            <div className="flex flex-col items-end">
              <span className="font-mono text-[9px] tracking-widest text-signal-green/60">
                UPLINK
              </span>
            </div>
          </div>
        </div>

        {/* Double edge lines */}
        <div className="mt-3 sm:mt-4">
          <div className="h-px w-full bg-gradient-to-r from-biolum/35 via-jellyfish/15 to-transparent" />
          <div className="mt-px h-px w-2/3 bg-gradient-to-r from-biolum/12 to-transparent" />
        </div>
      </div>
    </header>
  );
}
