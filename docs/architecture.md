# solocrew Architecture

This document explains how solocrew wires Claude Code sessions to Telegram bots using shell aliases, a central registry, and per-bot state directories.

---

## 1. TELEGRAM_STATE_DIR Mechanism

Claude Code's Telegram channel plugin reads its runtime state from a directory on disk. The location of that directory is controlled by the `TELEGRAM_STATE_DIR` environment variable.

When a Claude Code session starts with `--channels plugin:telegram@claude-plugins-official`, the Telegram plugin looks at `TELEGRAM_STATE_DIR` to find:

- The bot token (in `.env`)
- The access control policy (in `access.json`)

Each bot gets its own directory under `~/.claude/channels/`, so setting `TELEGRAM_STATE_DIR` to a specific path routes the session to a specific bot. This is the core mechanism that allows multiple independent bots to run simultaneously — each in its own terminal, each pointed at its own state directory.

```
TELEGRAM_STATE_DIR=/home/user/.claude/channels/crew-devbot
                    ^
                    Routes this session to devbot's token and access config
```

No daemon or central coordinator is needed. Each bot is simply a Claude Code process with its own environment variable pointing to its own state.

## 2. Shell Aliases

Each bot gets **two** shell aliases, written to the user's shell RC file during `/solocrew create`. The aliases are identified by a comment line for later management (edit, delete).

```bash
# solocrew: devbot — App development
alias claudedev='TELEGRAM_STATE_DIR=/home/user/.claude/channels/crew-devbot claude --channels plugin:telegram@claude-plugins-official --model opus'
alias claudedev-auto='TELEGRAM_STATE_DIR=/home/user/.claude/channels/crew-devbot claude --channels plugin:telegram@claude-plugins-official --model opus --dangerously-skip-permissions'
```

The `--model` flag is optional — omitted when the bot uses the account default model.

### The two variants

| Alias | Flag | Behavior | Use when... |
|-------|------|----------|-------------|
| `claudedev` | *(none)* | Interactive — Claude asks before risky actions | Default for all work, new/untested bots |
| `claudedev-auto` | `--dangerously-skip-permissions` | Full autonomy — no permission prompts | Running unattended, trusted tasks only |

### Shell detection

The skill detects the user's shell and writes aliases to the correct RC file:

- **zsh** → `~/.zshrc`
- **bash** → `~/.bashrc`

### Comment format

Each alias block is prefixed with a comment for identification:

```bash
# solocrew: <name> — <purpose>
```

This comment allows `/solocrew delete` and `/solocrew edit` to locate and modify the correct alias block.

## 3. Registry Schema

The central registry lives at `~/.claude/channels/crew-registry.json`. It tracks all bots, their configuration, and organizational groups.

```json
{
  "version": 1,
  "bots": {
    "devbot": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-devbot",
      "purpose": "App development",
      "project": "/home/user/projects/my-app",
      "alias": "claudedev",
      "group": "dev",
      "model": "opus",
      "botUsername": "@DevAssistBot",
      "created": "2026-03-22"
    }
  },
  "groups": {
    "dev": {
      "description": "Development team bots",
      "members": ["devbot"]
    }
  },
  "defaults": {
    "dmPolicy": "allowlist",
    "allowFrom": ["123456789"]
  }
}
```

### Field reference

| Field | Type | Description |
|-------|------|-------------|
| `version` | integer | Schema version for future migration support |
| `bots.<name>.channel` | string | Channel type. Always `"telegram"` in v1. Exists for future multi-channel support (Discord in v1.1). |
| `bots.<name>.dir` | string | Absolute path to the bot's state directory |
| `bots.<name>.purpose` | string | Human-readable role description |
| `bots.<name>.project` | string | Absolute path to the project this bot works on |
| `bots.<name>.alias` | string | The base alias name (autonomous variant is `<alias>-auto`) |
| `bots.<name>.group` | string or null | Group this bot belongs to |
| `bots.<name>.model` | string or null | Claude model to use (`"opus"`, `"sonnet"`, `"haiku"`, or full model ID). Null = account default. |
| `bots.<name>.botUsername` | string | Telegram bot username (from BotFather) |
| `bots.<name>.created` | string | Creation date in YYYY-MM-DD format |
| `groups.<name>.description` | string | What this group of bots does |
| `groups.<name>.members` | array | List of bot names in this group |
| `defaults.dmPolicy` | string | Default DM policy for new bots |
| `defaults.allowFrom` | array | Default allowed Telegram sender IDs |

### Path convention

All paths in the registry are **expanded absolute paths**. No `~` or `$HOME` — this avoids ambiguity when the registry is read by different processes or users.

## 4. Per-Bot Directory Layout

Each bot's state lives in its own directory under `~/.claude/channels/`:

```
~/.claude/channels/crew-devbot/
  .env              # Bot token
  access.json       # Access control policy
  instructions.md   # Role and behavioral notes
```

### .env

Contains the Telegram bot token. This file is `chmod 600` (owner read/write only).

```
TELEGRAM_BOT_TOKEN=<your-token-from-botfather>
```

### access.json

Defines who can message the bot via DM.

```json
{
  "dmPolicy": "allowlist",
  "allowFrom": ["123456789"]
}
```

### instructions.md

A reference document describing the bot's role, project context, and behavioral guidelines. See [Section 7](#7-instructionsmd) for details on how to make it active.

## 5. Security Model

### Allowlist-only DM policy

Every bot uses an allowlist by default. Only Telegram user IDs explicitly listed in `access.json` (and `defaults.allowFrom`) can message the bot. Unknown senders are ignored.

### Token protection

Bot tokens are stored only in per-bot `.env` files, which are set to `chmod 600` on creation. Tokens are **never** stored in the registry JSON — the registry only holds the directory path, and the directory holds the token.

### Dual aliases

Every bot gets both a safe and an autonomous alias. The default alias (no suffix) omits `--dangerously-skip-permissions`, so Claude will prompt before executing risky operations (file writes, shell commands, network requests). The autonomous variant (`<alias>-auto`) adds `--dangerously-skip-permissions` for unattended operation. This gives users a trust gradient — safe by default, autonomous only when explicitly chosen.

### Directory and file permissions

Bot directories should be set to `chmod 700` (owner only) on creation. The registry file (`crew-registry.json`) should be `chmod 600`. This prevents other system users from reading bot tokens or modifying bot configuration.

### Inter-bot isolation limitations

In v1, all bots run under the same OS user and share the same filesystem namespace. A bot with `--dangerously-skip-permissions` can read or modify another bot's state directory. True inter-bot isolation requires running bots under separate OS users or in containers — this is not enforced in v1.

### Path validation

Any operation that performs destructive filesystem actions (e.g., `rm -rf` during `/solocrew delete`) must validate that the target path is inside the expected `~/.claude/channels/` directory. Paths containing `..`, symlink escapes, or values outside the channels directory must be rejected to prevent accidental or malicious deletion of unrelated files.

### Input validation

Bot names, alias names, and purpose fields must be validated on creation and edit. Bot names should be restricted to alphanumeric characters, hyphens, and underscores. Alias names must be valid shell identifiers. Purpose fields should be sanitized to prevent shell injection when written into RC file comments.

### No tokens in version control

The `.env` files inside `~/.claude/channels/` should be excluded from version control. The solocrew registry and state directories live outside project repos by default, but if a user symlinks or copies them, `.env` files must be in `.gitignore`.

## 6. Groups

Groups are **organizational labels** for categorizing bots. They carry no automation or cross-bot communication in v1.

### Properties

- Each bot can belong to **one** group (or none)
- Groups have a `name`, `description`, and `members` list
- The members list is maintained by the skill during create/edit/delete operations

### Use cases

- Organize bots by project: `"dev"`, `"content"`, `"ops"`
- Organize by team function: `"engineering"`, `"marketing"`, `"research"`
- Filter bots in `/solocrew list` output

### Example

```json
"groups": {
  "dev": {
    "description": "Development team bots",
    "members": ["frontend", "backend", "devops"]
  },
  "content": {
    "description": "Content creation bots",
    "members": ["writer", "researcher"]
  }
}
```

Groups are a foundation for future features (cross-bot messaging, group-level commands) but in v1 they are purely organizational.

## 7. instructions.md

Each bot's directory contains an `instructions.md` file that describes the bot's role, project context, and behavioral guidelines.

### What it is

A reference document that defines the bot's identity. It captures what this bot is for, what project it works on, and any behavioral notes (tone, constraints, preferred tools).

### Auto-injection via SessionStart hook

`instructions.md` is automatically injected into the Claude Code session at startup via a global `SessionStart` hook in `~/.claude/settings.json`. When a bot session starts:

1. The hook checks if `TELEGRAM_STATE_DIR` is set (it is for all solocrew bot aliases)
2. Reads `instructions.md` from that bot's state directory
3. Displays "Telegram bot connected: \<name\>" in the terminal
4. Injects the instructions into Claude's context via `additionalContext`

This means Claude knows which bot it is and follows the bot's role guidelines automatically. Non-Telegram sessions are unaffected — the hook exits silently when `TELEGRAM_STATE_DIR` is unset.

#### The hook

Add this to `~/.claude/settings.json` under `hooks.SessionStart`:

```json
{
  "hooks": [
    {
      "type": "command",
      "command": "if [ -n \"$TELEGRAM_STATE_DIR\" ] && [ -f \"$TELEGRAM_STATE_DIR/instructions.md\" ]; then BOT_NAME=$(head -1 \"$TELEGRAM_STATE_DIR/instructions.md\" | sed 's/^# Bot: //'); INSTRUCTIONS=$(cat \"$TELEGRAM_STATE_DIR/instructions.md\"); python3 -c \"import json,sys; print(json.dumps({'systemMessage':'Telegram bot connected: '+sys.argv[1],'hookSpecificOutput':{'hookEventName':'SessionStart','additionalContext':'TELEGRAM BOT IDENTITY — you ARE this bot, use this identity when responding on Telegram:\\n'+sys.argv[2]}}))\" \"$BOT_NAME\" \"$INSTRUCTIONS\"; fi",
      "statusMessage": "Checking Telegram bot identity..."
    }
  ]
}
```

#### instructions.md format

The file must start with `# Bot: <name>` on line 1 — the hook parses this to extract the bot name.

```markdown
# Bot: devbot

## Role
App development

## Project
/home/user/projects/my-app

## Behavior
- You are the devbot agent, focused on: App development
- Work primarily in: /home/user/projects/my-app
- Prioritize tasks related to your role
```

### Manual alternatives

If the SessionStart hook is not configured, there are two manual approaches:

**1. Copy into CLAUDE.md**

```bash
cat ~/.claude/channels/crew-devbot/instructions.md >> ~/projects/my-app/CLAUDE.md
```

**2. Symlink into the project**

```bash
ln -s ~/.claude/channels/crew-devbot/instructions.md ~/projects/my-app/.claude/instructions.md
```
