# Changelog

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
