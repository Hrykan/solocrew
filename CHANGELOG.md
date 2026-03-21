# Changelog

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
