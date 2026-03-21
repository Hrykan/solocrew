---
name: solocrew
description: Use when the user wants to create, manage, list, delete, or organize multiple Telegram bots for Claude Code sessions. Handles bot creation with BotFather tokens, shell aliases, access control, per-bot instructions, groups, and migration of existing bots. Invoke for "create a telegram bot", "list my bots", "add a new bot channel", "telegram fleet", "bot groups", "solocrew", or any multi-bot Telegram management task.
---

# solocrew — AI Agent Fleet Manager

Manage multiple Telegram bot channels for Claude Code. Each bot is a "virtual employee" — an agent identity with its own name, role, project binding, and Claude Code session.

## Core Concepts

- **One bot = one terminal session.** Each bot runs via a shell alias that sets `TELEGRAM_STATE_DIR` to its own directory.
- **Registry** at `~/.claude/channels/crew-registry.json` tracks all bots and groups centrally.
- **Per-bot directory** at `~/.claude/channels/crew-<name>/` contains `.env`, `access.json`, `instructions.md`.
- **Aliases** in the user's shell RC file launch Claude Code wired to a specific bot.

## Arguments

Parse the arguments (space-separated) to dispatch:

| Pattern | Operation |
|---------|-----------|
| (none) | Show status overview (same as `list`) |
| `create <name>` | Create a new bot channel |
| `list` | List all registered bots |
| `status <name>` | Detailed status of one bot |
| `delete <name>` | Remove a bot channel |
| `migrate` | Adopt existing default bot into registry |
| `group create <name>` | Create a bot group |
| `group add <group> <bot>` | Add bot to group |
| `group list` | List all groups |
| `group delete <name>` | Delete a group |
| `help` | Comprehensive usage guide |

---

## Registry

**File:** `~/.claude/channels/crew-registry.json`

If missing, create with:
```json
{
  "version": 1,
  "bots": {},
  "groups": {},
  "defaults": {
    "dmPolicy": "allowlist",
    "allowFrom": []
  }
}
```

When creating the first bot, detect the user's Telegram ID from existing `~/.claude/channels/telegram/access.json` if available and populate `defaults.allowFrom`.

### Bot entry schema:
```json
{
  "channel": "telegram",
  "dir": "~/.claude/channels/crew-<name>",
  "purpose": "Role description",
  "project": "/absolute/path/to/project",
  "alias": "claude<name>",
  "group": "<group-name-or-null>",
  "botUsername": "@BotUsernameBot",
  "created": "YYYY-MM-DD"
}
```

---

## Operations

### `create <name>`

**Interactive flow — ask one question at a time using AskUserQuestion where appropriate:**

1. **Pre-flight checks:**
   - Run `which bun` — if Bun is not installed, warn and offer to install:
     ```
     Bun runtime is required for Telegram channel plugins.
     Without it, the bot session will silently fail to connect.

     Install now with:
       curl -fsSL https://bun.sh/install | bash

     Then restart your terminal and run /solocrew create <name> again.
     ```
     Ask the user if they want to install Bun now. If yes, run the install command. If no, STOP.
   - Run `claude --version` and check the version is >= 2.1.80. If not, warn:
     ```
     Claude Code v2.1.80+ is required for channels support.
     Run: claude update
     ```

2. **Validate name:**
   - Must be lowercase alphanumeric + hyphens, 2-30 chars
   - Check registry for duplicates — if exists, refuse and suggest `<name>-2`
   - Check if directory `~/.claude/channels/crew-<name>/` already exists — if so, suggest `migrate` instead

3. **Ask for BotFather token:**
   - If user doesn't have one, print this guide and STOP:
     ```
     CREATE A BOT WITH @BOTFATHER:
     1. Open Telegram and message @BotFather
     2. Send /newbot
     3. Choose a display name (e.g., "My Dev Assistant")
     4. Choose a username ending in "bot" (e.g., "DevAssistBot")
     5. BotFather replies with a token like: &lt;token-from-botfather&gt;
     6. Copy the full token and run: /solocrew create <name> again
     ```
   - Validate token format: must match pattern `^\d+:[\w-]+$`
   - Check all existing bot `.env` files for duplicate tokens — warn if found

4. **Ask for bot username** (the @username from BotFather, e.g., `@DevAssistBot`)

5. **Ask for purpose/role description** (one line, e.g., "App development")

6. **Ask for project directory** (optional):
   - Suggest current working directory as default
   - If provided, validate path exists (warn if not, but allow)

7. **Suggest alias:**
   - Default: `claude<name>` (e.g., `claudedev`)
   - Detect shell from `$SHELL` env var → determine RC file (`~/.zshrc` or `~/.bashrc`)
   - Read RC file and check for existing alias with same name — if conflict, suggest alternatives
   - Ask user to confirm or customize

8. **Ask for group** (optional):
   - List existing groups from registry
   - Allow creating a new group inline (ask for group name + description)
   - Allow skipping (no group)

9. **Create everything:**

   a. Create directory:
   ```bash
   mkdir -p ~/.claude/channels/crew-<name>
   ```

   b. Write `.env`:
   ```
   TELEGRAM_BOT_TOKEN=<token>
   ```
   Then `chmod 600` the file.

   c. Write `access.json` using registry defaults:
   ```json
   {
     "dmPolicy": "<defaults.dmPolicy>",
     "allowFrom": <defaults.allowFrom>,
     "groups": {},
     "pending": {}
   }
   ```

   d. Write `instructions.md`:
   ```markdown
   # Bot: <name>

   ## Role
   <purpose>

   ## Project
   <project path or "Not bound to a specific project">

   ## Behavior
   - You are the <name> agent, focused on: <purpose>
   - Work primarily in: <project path>
   - Prioritize tasks related to your role
   ```

   e. Add aliases to shell RC file. Create TWO aliases per bot:
   ```bash
   # solocrew: <name> — <purpose>
   alias <alias>='TELEGRAM_STATE_DIR=<expanded-dir> claude --channels plugin:telegram@claude-plugins-official --dangerously-skip-permissions'
   alias <alias>-safe='TELEGRAM_STATE_DIR=<expanded-dir> claude --channels plugin:telegram@claude-plugins-official'
   ```

   Where `<expanded-dir>` is the full path, e.g., `~/.claude/channels/crew-<name>`.

   f. Update registry: add bot entry, add to group if specified.

10. **Output summary:**
   ```
   Bot "<name>" created successfully!

   Directory:    ~/.claude/channels/crew-<name>/
   Alias:        <alias>       (autonomous, skips permissions)
   Safe alias:   <alias>-safe  (interactive, asks for approval)
   Bot:          <botUsername>
   Purpose:      <purpose>
   Project:      <project>
   Group:        <group or "none">

   NEXT STEPS:
   1. Run: source ~/.zshrc
   2. Open a new terminal and type: <alias>  (or <alias>-safe for interactive mode)
   3. DM <botUsername> on Telegram — you'll get a pairing code
   4. In that session, run: /telegram:access pair <code>
   5. Your bot is ready!
   ```

### `list`

1. Read `~/.claude/channels/crew-registry.json`
2. If no bots registered, say so and suggest `/solocrew create <name>` or `/solocrew migrate`
3. Display table:

```
YOUR CREW
==================

NAME        ALIAS       GROUP    PURPOSE                         BOT
primary     claudetg    —        General assistant                @PrimaryBot
devbot      claudedev   dev      App development                  @DevAssistBot
ops         claudeops   infra    Deployments & servers            @OpsBot

3 bots registered. Use '/solocrew status <name>' for details.
```

### `status <name>`

1. Look up bot in registry — if not found, list available bots
2. Read the bot's `.env` (mask token: show first 10 chars + `...`)
3. Read the bot's `access.json`
4. Read first 3 lines of `instructions.md` (after the `# Bot:` header)
5. Display:

```
BOT: devbot
=============
Token:       ********** (set)
Directory:   ~/.claude/channels/crew-devbot/
Bot:         @DevAssistBot
Alias:       claudedev
Purpose:     App development
Project:     ~/projects/my-app
Group:       dev
Policy:      allowlist
Senders:     1 (123456789)
Created:     2026-03-22
Instructions:
  Role: App development
  Project: ~/projects/my-app
  Behavior: You are the devbot agent...
```

### `delete <name>`

1. Look up bot in registry — if not found, list available bots
2. **Show what will be removed:**
   ```
   This will permanently delete:
   - Directory: ~/.claude/channels/crew-devbot/
   - Alias "claudedev" from ~/.zshrc
   - Alias "claudedev-safe" from ~/.zshrc
   - Registry entry for "devbot"
   - Group membership in "dev"
   ```
3. **Ask for confirmation** using AskUserQuestion — require explicit "yes"
4. If confirmed:
   - Remove directory: `rm -rf ~/.claude/channels/crew-<name>/`
   - Remove both alias lines (the dangerous and safe variants) AND their comment from shell RC file
   - Remove bot from registry
   - Remove bot from any group member lists
   - Confirm: `Bot "devbot" deleted. Run 'source ~/.zshrc' to update your shell.`

### `migrate`

Adopt existing `~/.claude/channels/telegram/` into the registry.

1. Check `~/.claude/channels/telegram/.env` exists — if not, nothing to migrate
2. Read existing `.env` and `access.json`
3. Show current state (token masked, policy, allowed senders)
4. Ask for a name (suggest "primary") using AskUserQuestion
5. Ask for purpose (suggest "General assistant")
6. Ask for project directory (optional)
7. Ask for group (optional)
8. **Do NOT move files** — the directory stays at `~/.claude/channels/telegram/`
9. Add registry entry with `"dir": "~/.claude/channels/telegram"` (no `-<name>` suffix)
10. Create `instructions.md` in the existing directory
11. Update existing alias in shell RC file to include `TELEGRAM_STATE_DIR` explicitly:
    ```bash
    # solocrew: <name> — <purpose>
    alias claudetg='TELEGRAM_STATE_DIR=~/.claude/channels/telegram claude --channels plugin:telegram@claude-plugins-official --dangerously-skip-permissions'
    alias claudetg-safe='TELEGRAM_STATE_DIR=~/.claude/channels/telegram claude --channels plugin:telegram@claude-plugins-official'
    ```
12. Confirm: `Existing bot migrated as "<name>". Registry updated.`

### `group create <name>`

1. Validate name (lowercase alphanumeric + hyphens)
2. Check registry for duplicate group name
3. Ask for description
4. Add to registry `groups`
5. Confirm

### `group add <group> <bot>`

1. Validate group exists in registry — if not, offer to create
2. Validate bot exists in registry — if not, list available bots
3. Add bot to group's `members` array (dedupe)
4. Update bot's `group` field
5. Confirm

### `group list`

```
BOT GROUPS
==========

GROUP    DESCRIPTION                    MEMBERS
dev      App development agents         devbot, uibot
infra    Infrastructure and ops         ops

2 groups. Use '/solocrew group add <group> <bot>' to add members.
```

If no groups, say so and suggest `/solocrew group create <name>`.

### `group delete <name>`

1. Look up group in registry
2. Clear `group` field from all member bots
3. Remove group from registry
4. Confirm

### `help`

Display this comprehensive guide:

```
SOLOCREW — HELP
==========================

WHAT IS THIS?
  Manage multiple Telegram bots, each connected to its own Claude Code session.
  Each bot is a "virtual employee" with a name, role, and project binding.

CONCEPTS
  Bot         A Telegram bot (created via @BotFather) with its own token
  Channel     A bot's config directory (~/.claude/channels/crew-<name>/)
  Alias       A shell command that starts Claude Code wired to a specific bot
  Group       A logical grouping of bots (e.g., by project or team)
  Registry    Central index of all bots (~/.claude/channels/crew-registry.json)

HOW IT WORKS
  Each bot gets its own directory with:
    .env              — Bot token (from @BotFather)
    access.json       — Who can message this bot
    instructions.md   — Role and behavior notes for this bot

  Each bot gets a pair of shell aliases like:
    alias claudedev='TELEGRAM_STATE_DIR=~/.claude/channels/crew-dev claude --channels ...'
    alias claudedev-safe='TELEGRAM_STATE_DIR=~/.claude/channels/crew-dev claude --channels ...'

  One terminal = one bot. Run different aliases in different terminals
  for parallel agents.

SETUP WORKFLOW
  1. Message @BotFather on Telegram → /newbot → get token
  2. /solocrew create <name>         → interactive setup
  3. source ~/.zshrc                 → load new alias
  4. Open new terminal → type alias  → bot session starts
  5. DM the bot on Telegram          → get pairing code
  6. /telegram:access pair <code>    → you're connected

DAILY USE
  Terminal 1:  claudedev      → devbot, app development (autonomous)
  Terminal 2:  claudedev-safe → devbot, app development (interactive)
  Terminal 3:  claudeops      → opsbot, deployments
  Terminal 4:  claude         → Regular Claude Code, no bot

COMMANDS
  /solocrew create <name>           Create a new bot channel
  /solocrew list                    List all registered bots
  /solocrew status <name>           Detailed status of one bot
  /solocrew delete <name>           Remove a bot and its config
  /solocrew migrate                 Adopt existing default bot into registry
  /solocrew group create <name>     Create a bot group
  /solocrew group add <grp> <bot>   Add a bot to a group
  /solocrew group list              List all groups with members
  /solocrew group delete <name>     Delete a group
  /solocrew help                    This guide

INSTRUCTIONS.MD
  Each bot has an instructions.md file in its directory. This defines:
  - The bot's role and purpose
  - Which project it works in
  - Behavioral guidelines

  Edit directly: ~/.claude/channels/crew-<name>/instructions.md
  Or reference it in your project's CLAUDE.md for auto-loading.

GROUPS
  Groups are organizational labels — they help you remember which bots
  serve which purpose. No automation or cross-bot communication.

  Example:
    Group "dev":     devbot, uibot, qabot
    Group "infra":   ops, monitor

LIMITATIONS
  - One bot per terminal (plugin constraint)
  - No cross-session messaging (bots can't talk to each other)
  - Bot only sees messages as they arrive (no history or search)
  - You must pair with each new bot separately (DM → code → approve)
  - instructions.md is a reference doc, not auto-injected into sessions

TROUBLESHOOTING
  Bot not responding?
    → Is the session running? Check the terminal with that alias.
    → Run '/solocrew status <name>' to verify token is set.

  "alias not found"?
    → Run 'source ~/.zshrc' (or ~/.bashrc) to reload aliases.

  Pairing code not working?
    → Codes expire in 5 minutes. DM the bot again for a new one.
    → Make sure you're running /telegram:access pair <code> in the
      session started with that bot's alias.

  Wrong bot responding?
    → Each terminal is wired to one bot. Check which alias you used.
```

---

## Implementation Notes

- **Always Read before Write** on registry and access.json — another process may have updated them.
- **Pretty-print JSON** with 2-space indent for hand-editability.
- **Shell detection:** Read `$SHELL` — if contains "zsh" use `~/.zshrc`, if "bash" use `~/.bashrc`, otherwise default to `~/.zshrc` and warn.
- **Token is a credential:** Always `chmod 600` the `.env` file after writing.
- **Alias comment:** Prefix each alias pair with `# solocrew: <name> — <purpose>` for identification and cleanup.
- **Registry creation:** On any operation, if registry doesn't exist, create it with empty defaults. Try to populate `defaults.allowFrom` from existing `~/.claude/channels/telegram/access.json`.
- **Directory paths in registry:** Store as absolute paths with `~` expanded.
