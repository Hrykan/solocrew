# Changelog

## v1.2.0 — 2026-03-24

New plugin skills and command center dashboard.

### Added
- **Autoresearch skill** — autonomous experiment loops inspired by Karpathy's autoresearch ([#12](https://github.com/Hrykan/solocrew/issues/12))
  - Dev loop: modify → measure → commit/revert → repeat
  - Research loop: search → scrape → score → fill gaps → repeat
  - Presets for tests, bundle size, Lighthouse, TypeScript, lint
- **Checkpoint skill** — session wrap-up & continuation prompts
  - Level-set, commit, CHANGELOG, issues, memory, continuation prompt
  - Saves to `.claude/checkpoints/LATEST.md` for instant resume
  - Global + fleet checkpoint ledgers in JSONL
  - Auto-checkpoint on context limits via PreCompact hook
  - Works in any Claude Code session (terminal, bot, IDE, headless)
- **Command center dashboard** (`dashboard/`) — fleet status UI ([#5](https://github.com/Hrykan/solocrew/issues/5))
  - React + Vite + TypeScript + Convex backend
  - shadcn/ui components (Nova preset)
  - Ocean Depth theme (dark) + Ocean Surface theme (light)
  - Asymmetric grid, bioluminescent accents, responsive design
  - Bot cards with status indicators, role glyphs, progress bars
  - Convex schema: bots, activity_log, tasks tables
- **Elicitation forwarding** — forward Claude prompts to Telegram for remote response ([#13](https://github.com/Hrykan/solocrew/issues/13))
- `/solocrew send` spec — cross-bot messaging via shared file inbox ([#10](https://github.com/Hrykan/solocrew/issues/10))
- `/solocrew deploy` spec — VPS deployment generator ([#11](https://github.com/Hrykan/solocrew/issues/11))

## v1.1.0 — 2026-03-22

Fleet operations and bot identity features.

### Added
- **`/solocrew launch`** — launch all bots (or a subset) in a tmux session with one command ([#1](https://github.com/Hrykan/solocrew/issues/1))
  - Supports `--auto` flag for autonomous mode
  - Supports `--group <name>` to launch only bots in a group
  - Supports launching a single bot by name
  - Skips bots that are already running
  - Uses full alias command (not alias name) since tmux doesn't load shell RC
- **`/solocrew health`** — check fleet health and bot status ([#2](https://github.com/Hrykan/solocrew/issues/2))
  - Detects tmux window, process alive, last activity timestamp
  - Status: healthy / stale / offline
  - Summary line with fleet-wide health count
  - Optional `--json` flag for machine-readable output
- **Bot identity auto-injection** via `SessionStart` hook ([#3](https://github.com/Hrykan/solocrew/issues/3))
  - Reads `instructions.md` from bot's state directory at session start
  - Displays "Telegram bot connected: \<name\>" in terminal
  - Injects bot identity into Claude's context automatically
  - Non-Telegram sessions are unaffected
- **Per-bot model routing** — assign different Claude models per bot for fleet cost optimization ([#4](https://github.com/Hrykan/solocrew/issues/4))
  - New `model` field in registry schema (opus, sonnet, haiku, or full model ID)
  - Aliases include `--model <model>` when set
  - `/solocrew create` prompts for model with cost guidance table
  - `/solocrew list` and `status` show configured model
- Command center vision doc (`docs/command-center-vision.md`)
- Project positioning doc (`docs/project-positioning.md`)

### Changed
- Updated architecture docs — `instructions.md` section now documents auto-injection via hook
- Updated README — roadmap reflects v1.1 features with issue links
- Updated help text with fleet operations section

## v1.0.1 — 2026-03-22

Security hardening and documentation improvements.

### Security
- **Swapped alias defaults** — safe mode is now the default alias, autonomous mode requires `-auto` suffix
- Added input validation guards for bot names (`^[a-z0-9][a-z0-9-]{1,29}$`), aliases, and purpose fields
- Added path validation before `rm -rf` (realpath check against `~/.claude/channels/crew-*`)
- Added `chmod 700` for bot directories and `chmod 600` for registry file
- Added Security section to README with trust model and threat documentation
- Documented inter-bot isolation limitations and lateral movement risks

### Fixes
- Fixed GitHub username in install commands (`Hrykan/solocrew`, not `mukulkulkarni/solocrew`)
- Replaced example token patterns that triggered GitHub secret scanning alerts
- Fixed step numbering in Quick Start (now 6 steps including Bun install)

### Added
- **Bun pre-flight check** — `/solocrew create` now checks for Bun and Claude Code version before starting
- **Claude Code version check** — warns if version < 2.1.80 (required for channels)
- Security section in README with safe vs auto alias guidance
- Strengthened architecture docs with path validation, input validation, and permission requirements
- Edge/mobile agent research document (`docs/edge-mobile-agent-research.md`)

## v1.0.0 — 2026-03-22

Initial release.

- `/solocrew create` — interactive bot creation with BotFather token, alias, group support
- `/solocrew list` — table view of all registered bots
- `/solocrew status <name>` — detailed bot info with masked token
- `/solocrew delete <name>` — safe removal with confirmation
- `/solocrew migrate` — adopt existing default bot into registry
- `/solocrew group create/add/list/delete` — organize bots into groups
- `/solocrew help` — comprehensive usage guide
- Dual aliases per bot: `<alias>` (safe, default) + `<alias>-auto` (autonomous)
- Central registry with versioned schema (`crew-registry.json`)
- Allowlist-based access control
- Telegram channel support (Discord planned for v1.1)
