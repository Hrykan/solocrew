---
name: checkpoint
description: This skill should be used when the user asks to "checkpoint", "wrap up session", "level-set", "save progress", "prepare to close", "generate continuation prompt", "session summary", "what did we do", or wants to cleanly close a session with documented changes, committed work, and a ready-to-paste continuation prompt for the next session. Works in any Claude Code session — terminal, Telegram bot, IDE, or headless.
---

# Checkpoint — Session Wrap-Up & Continuation

Cleanly close any Claude Code session by documenting changes, committing work, updating issues, and generating a continuation prompt that can be used to resume in a new session.

Works in every context:
- **Terminal sessions** — display prompt, save to disk
- **Telegram bot sessions** — display + send to Telegram + save to disk
- **Autonomous agents** — save to disk for auto-resume in a new window
- **IDE sessions** — display prompt, save to disk

## The Checkpoint Sequence

Execute these steps in order. Skip any step that doesn't apply to the current session.

### Step 1: Level-Set — What Happened

Summarize the current session:

1. **Detect environment:**
   - Project path: current working directory
   - Git branch: `git branch --show-current`
   - Session type: check if `TELEGRAM_STATE_DIR` is set (bot) or not (terminal/IDE)
   - If bot: read bot name from `$TELEGRAM_STATE_DIR/instructions.md` line 1

2. **Read git log** for this session's commits:
   ```
   git log --oneline -20
   ```

3. **Read git diff** for uncommitted changes:
   ```
   git diff --stat
   git status --short
   ```

4. **Check GitHub issues** for the repo if available:
   ```
   gh issue list --state open --limit 10
   ```

5. **Compile summary:**

```
SESSION SUMMARY
===============
Project: <project name>
Path: <project path>
Branch: <branch>
Session: <terminal | bot:<name> | IDE>

Accomplished:
- <what was done, with commit refs>

Files changed (uncommitted):
- <list if any>

Pending / unfinished:
- <what was started but not completed>

Open issues:
- #<num> — <title>
```

### Step 2: Commit Pending Work

If there are uncommitted changes:

1. Stage relevant files — `git add` specific files (not `-A`)
2. Commit with descriptive message following the project's convention
3. Push if the branch has a remote tracking branch

If changes are incomplete or broken, stash instead:
```
git stash push -m "checkpoint: <description>"
```

### Step 3: Update CHANGELOG

If the project has a `CHANGELOG.md` and meaningful work was done:

1. Read the current CHANGELOG format
2. Add entries under the current version or an "Unreleased" section
3. One line per feature/fix — keep it concise
4. Commit the CHANGELOG update

### Step 4: GitHub Issues

1. **Close completed issues** — if commits resolve an issue, close it with `gh`
2. **Update in-progress issues** — add a progress comment
3. **Create new issues** — for bugs found, TODOs discovered, or next steps

Only create issues for non-trivial items. Use `gh` CLI single-line commands.

### Step 5: Update Memory

If the project has auto-memory enabled:

1. Save non-obvious decisions or context to memory files
2. Update stale memory entries discovered during the session
3. Keep memories factual and useful for future sessions

### Step 6: Generate Continuation Prompt

Generate a complete continuation prompt that any new session can use to resume this work. This is the most critical step.

```markdown
## Continuation Prompt

> Paste this at the start of your next session to restore context.

---

**Project:** <name and absolute path>
**Branch:** <current git branch>
**Last commit:** <hash — message>
**Stash:** <if anything was stashed, note it here>

**Context:**
<2-3 sentences on what this project is and what we're working on>

**What was just completed:**
- <bullet list of what this session accomplished>

**What's next (priority order):**
1. <most important next task — be specific with file paths and issue numbers>
2. <second task>
3. <third task>

**Key decisions made:**
- <non-obvious decisions that affect future work>

**Open issues:**
- #<number> — <title> (<status>)

**Files to look at first:**
- <file path> — <why this file matters>

**Commands to run first:**
- <setup commands: npm run dev, git stash pop, cd <path>, etc.>

---
```

### Step 7: Save & Log the Continuation Prompt

The continuation prompt must be persisted to disk — not just displayed. A prompt only in a context window that's about to close is useless.

1. **Create directory** if needed:
   ```
   mkdir -p .claude/checkpoints
   ```

2. **Save timestamped checkpoint:**
   ```
   .claude/checkpoints/<YYYY-MM-DD>-<HH-MM>-<short-tag>.md
   ```
   Where `<short-tag>` is a 2-3 word slug (e.g., `dashboard-ui`, `fix-auth-bug`).

3. **Save as LATEST** (always overwrite):
   ```
   .claude/checkpoints/LATEST.md
   ```

4. **Add to .gitignore** if not already there — checkpoints are local state:
   ```
   .claude/checkpoints/
   ```

5. **Log to global checkpoint ledger** (all projects, all sessions):
   ```
   ~/.claude/checkpoint-log.jsonl
   ```
   Append one JSON line:
   ```json
   {"project":"<path>","branch":"<branch>","session":"<terminal|bot:name>","timestamp":"<ISO>","commit":"<hash>","summary":"<one-line>","file":"<checkpoint-path>"}
   ```

6. **If bot session** — also log to fleet ledger:
   ```
   ~/.claude/channels/checkpoint-log.jsonl
   ```

### Output

- **Always** display the continuation prompt in the current session
- **Always** save to disk (Steps 7.1-7.5)
- **If Telegram bot** — also send via the reply tool to the user's chat
- **If autonomous** — saving to disk IS the output; no human to display to

### Auto-Resume Patterns

**Manual resume (any session):**
```
Read .claude/checkpoints/LATEST.md and continue from where we left off.
```

**Resume a specific checkpoint:**
```
Read .claude/checkpoints/2026-03-24-11-30-dashboard-ui.md and continue.
```

**Autonomous task chaining (the long-term goal):**
```
1. Agent picks up issue #7 from GitHub
2. Works on it until done (or context limit)
3. Checkpoint → saves state to LATEST.md
4. New session starts → reads LATEST.md → picks up next issue
5. Repeat
```

This pattern turns GitHub issues into a task queue that agents work through autonomously, checkpointing between each task to stay within context limits.

## Auto-Checkpoint on Context Limits

Add a PreCompact hook to auto-save before context compression:

```json
{
  "hooks": {
    "PreCompact": [{
      "hooks": [{
        "type": "prompt",
        "prompt": "Context is about to be compacted. Save a checkpoint: summarize current task state, pending work, and key decisions to .claude/checkpoints/LATEST.md and append to ~/.claude/checkpoint-log.jsonl. Keep it concise — this will be read back after compaction."
      }]
    }]
  }
}
```

## Rules

- **Always generate the continuation prompt** — even if nothing else applies
- **Always save to disk** — a prompt only in context is useless after session close
- **Be specific in next steps** — include file paths, issue numbers, exact commands
- **Commit before generating** — reference committed state, not uncommitted drift
- **Don't bloat CHANGELOG** — only user-visible changes
- **Environment-agnostic** — the same checkpoint file works whether resumed in a terminal, bot, or IDE session
