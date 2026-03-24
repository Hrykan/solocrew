---
name: checkpoint
description: This skill should be used when the user asks to "checkpoint", "wrap up session", "level-set", "save progress", "prepare to close", "generate continuation prompt", "session summary", "what did we do", or wants to cleanly close a session with documented changes, committed work, and a ready-to-paste continuation prompt for the next session.
---

# Checkpoint — Session Wrap-Up & Continuation

Cleanly close a session by documenting changes, committing work, updating issues, and generating a continuation prompt. Run this before closing any bot session or terminal to preserve context.

## The Checkpoint Sequence

Execute these steps in order. Skip any step that doesn't apply.

### Step 1: Level-Set — What Happened

Summarize the current session:

1. **Read git log** for commits made in this session — `git log --oneline --since="$(ps -p $$ -o lstart= | xargs -I{} date -j -f '%a %b %d %T %Y' '{}' '+%Y-%m-%dT%H:%M:%S' 2>/dev/null || echo '12 hours ago')" 2>/dev/null || git log --oneline -20`
2. **Read git diff** for uncommitted changes — `git diff --stat` and `git status --short`
3. **Check task list** if any tasks were tracked
4. **Compile summary** — list what was accomplished, what changed, what's pending

Output format:
```
SESSION SUMMARY
===============
Project: <project name>
Bot: <bot name if telegram session>
Duration: <approximate>

Accomplished:
- <what was done, with commit refs>

Files changed (uncommitted):
- <list if any>

Pending / unfinished:
- <what was started but not completed>
```

### Step 2: Commit Pending Work

If there are uncommitted changes:

1. Stage relevant files — `git add` specific files (not `-A`)
2. Commit with descriptive message following the project's convention
3. Push if the branch has a remote tracking branch

If changes are incomplete/broken, stash instead: `git stash push -m "checkpoint: <description>"`

### Step 3: Update CHANGELOG

If the project has a `CHANGELOG.md` and meaningful work was done:

1. Read the current CHANGELOG format
2. Add entries under the current version section (or create an unreleased section)
3. Keep entries concise — one line per feature/fix
4. Commit the CHANGELOG update

### Step 4: GitHub Issues

Check for issue-worthy items:

1. **Close completed issues** — if commits reference issue numbers, close them with a comment
2. **Update in-progress issues** — add comments on progress made
3. **Create new issues** — for bugs found, TODOs discovered, or next steps identified

Use `gh` CLI for all operations. Only create issues for non-trivial items.

### Step 5: Update Memory

If working in a project with auto-memory:

1. Save any non-obvious decisions or context to memory
2. Update stale memory entries discovered during the session
3. Keep memories factual and useful for future sessions

### Step 6: Generate Continuation Prompt

This is the most critical step. Generate a complete continuation prompt that another session (or the same bot after restart) can use to pick up exactly where this session left off.

Format:

```markdown
## Continuation Prompt

> Paste this at the start of your next session to restore context.

---

**Project:** <project name and path>
**Branch:** <current git branch>
**Last commit:** <hash and message>

**Context:**
<2-3 sentences on what this project is and what we're working on>

**What was just completed:**
<bullet list of what this session accomplished>

**What's next (priority order):**
1. <most important next task — be specific>
2. <second task>
3. <third task>

**Key decisions made:**
- <any non-obvious decisions that affect future work>

**Open issues to work on:**
- #<number> — <title> (status)

**Files to look at first:**
- <file path> — <why>

**Commands to run:**
- <any setup commands needed, e.g., npm run dev, git stash pop>

---
```

### Step 7: Save & Log the Continuation Prompt

The continuation prompt must be persisted — not just displayed. Save it to disk so it can be reused automatically.

1. **Save to project checkpoint log:**
   ```
   .claude/checkpoints/<YYYY-MM-DD>-<HH-MM>-<short-tag>.md
   ```
   Where `<short-tag>` is a 2-3 word slug of what the session did (e.g., `dashboard-ui`, `autoresearch-skill`).

2. **Save latest as a quick-resume file:**
   ```
   .claude/checkpoints/LATEST.md
   ```
   Always overwrite this file — it's the "last known good state" for instant resume.

3. **Create `.claude/checkpoints/` directory** if it doesn't exist. Add `.claude/checkpoints/` to `.gitignore` if not already there — these are local working state, not repo content.

4. **Log to fleet-wide checkpoint log** (if `TELEGRAM_STATE_DIR` is set):
   ```
   ~/.claude/channels/checkpoint-log.jsonl
   ```
   Append one JSON line:
   ```json
   {"bot":"<name>","project":"<path>","timestamp":"<ISO>","commit":"<hash>","summary":"<one-line>","file":"<checkpoint-file-path>"}
   ```
   This creates a fleet-wide audit trail of all bot session checkpoints.

### Output

Display the full continuation prompt in the chat/terminal AND:
- If running via Telegram — send it via the reply tool so the user has it on their phone
- Always save to disk per Step 7 — even if not on Telegram

### Auto-Resume Pattern

To resume from the latest checkpoint in a new session:

```
Read .claude/checkpoints/LATEST.md and continue from where we left off.
```

Or to resume a specific checkpoint:

```
Read .claude/checkpoints/2026-03-24-11-30-dashboard-ui.md and continue.
```

The fleet checkpoint log at `~/.claude/channels/checkpoint-log.jsonl` enables future features:
- `/solocrew status` can show last checkpoint per bot
- Command center dashboard can display checkpoint history
- A PreCompact hook could auto-checkpoint before context compression
- A scheduled trigger could auto-resume stale checkpoints in new sessions

## Rules

- **Always generate the continuation prompt** — even if nothing else applies. This is the core value of the skill.
- **Be specific in next steps** — "work on the dashboard" is useless. "Implement the BotCard click-to-expand interaction per issue #7" is useful.
- **Include file paths** — the next session starts cold. Specific paths save discovery time.
- **Include commands** — if the project needs a dev server or build step, list it.
- **Don't bloat the CHANGELOG** — only add entries for user-visible changes, not internal refactors unless significant.
- **Commit before generating** — the continuation prompt should reference the latest committed state, not uncommitted drift.
- **Always save to disk** — the continuation prompt is useless if it only exists in a context window that's about to be cleared.

## Auto-Checkpoint on Context Limits

For autonomous operation, add a PreCompact hook that auto-saves a checkpoint before context gets compressed. This ensures no context is ever truly lost:

```json
{
  "hooks": {
    "PreCompact": [{
      "hooks": [{
        "type": "prompt",
        "prompt": "Context is about to be compacted. Before it happens, save a checkpoint: summarize the current task state, pending work, and key decisions to .claude/checkpoints/LATEST.md. Keep it concise — this will be read back after compaction."
      }]
    }]
  }
}
```

This turns every context compression into a checkpoint opportunity — the bot auto-saves state, compacts, then can read LATEST.md to restore context.
