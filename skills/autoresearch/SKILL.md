---
name: autoresearch
description: This skill should be used when the user asks to "run autoresearch", "optimize this file", "run experiments overnight", "autonomous optimization loop", "improve performance automatically", "run a research loop", "deep research on a topic", or wants an agent to iteratively modify code, measure results, and keep improvements. Covers both dev loops (code optimization) and research loops (knowledge gathering). Inspired by Karpathy's autoresearch pattern.
---

# Autoresearch: Autonomous Experiment & Research Loop

Inspired by [Karpathy's autoresearch](https://github.com/karpathy/autoresearch) — give an AI agent a real setup and let it experiment autonomously. It modifies code, runs tests, checks if results improved, keeps or discards, and repeats.

Two modes: **Dev Loop** (code optimization) and **Research Loop** (knowledge gathering).

## MODE 1: Dev Loop

Optimize any file against a measurable metric. The agent modifies code, measures the result, commits improvements, reverts failures, and repeats indefinitely.

### Setup Phase

1. **Agree on goal metric** — what number to optimize (lower or higher = better)
2. **Create experiment branch** — `git checkout -b autoresearch/<tag>`
3. **Read in-scope files** — understand what CAN and CANNOT be modified
4. **Establish baseline** — run measurement command once, record the number
5. **Initialize results log** — create `results.tsv` with headers: `commit\tmetric\tstatus\tdescription`
6. **Confirm and begin** — then enter the loop

### The Loop

```
LOOP FOREVER:

1. OBSERVE — check git status, current metric, recent results
2. HYPOTHESIZE — form ONE focused change based on evidence
3. MODIFY — make the change (Edit tool, single file)
4. COMMIT — atomic commit with descriptive message
5. MEASURE — run fixed evaluation command
   - Redirect output: `command > run.log 2>&1`
   - Extract metric: `grep "pattern" run.log`
6. RECORD — append result to results.tsv
7. DECIDE:
   - IMPROVED → keep commit, new baseline
   - SAME/WORSE → `git reset --hard HEAD~1`
   - CRASHED → fix (max 2 tries) or revert
8. REPEAT → go to step 1
```

### Critical Rules

- **NEVER STOP** — run indefinitely until manually interrupted. Do not ask "should I continue?"
- **ONE CHANGE AT A TIME** — never bundle changes. Isolation reveals what helped.
- **SIMPLICITY CRITERION** — simpler is better at equal metrics. Removing code = great outcome.
- **FIXED EVALUATION** — never modify the test/benchmark harness mid-loop.
- **CRASH RECOVERY** — typo fix = re-run. Fundamental break = revert + move on.
- **CONTEXT MANAGEMENT** — redirect outputs to files, grep for metrics, compact when needed.

### Domain Presets

For quick setup, reference **`references/presets.md`** which contains ready-to-use configurations for common optimization targets (test coverage, bundle size, Lighthouse, type safety, lint warnings).

### program.md Pattern

Create a `program.md` in the project root to configure the experiment. This is the file the human iterates on — the "research org code":

```markdown
# Autoresearch: [Goal]

## Goal
[Metric to optimize, current value, target value, direction (lower/higher)]

## In-scope files (CAN modify)
- [file patterns]

## Out-of-scope (DO NOT modify)
- [file patterns — especially evaluation harness]

## Metric command
[exact command to run and extract the metric number]

## Baseline
[current metric value]
```

### Results Log Format (TSV)

```
commit	metric	status	description
a1b2c3d	87/89	keep	baseline
b2c3d4e	88/89	keep	add testid to modal
c3d4e5f	87/89	discard	refactor nav — broke tabs
d4e5f6g	CRASH	crash	circular import
```

---

## MODE 2: Research Loop

Gather comprehensive knowledge on a topic through iterative search, scrape, and scoring rounds. Stop when completeness threshold is met.

### The Loop

```
SETUP:
1. Parse topic into research dimensions
2. Create .firecrawl/ output directory
3. Initialize research state

LOOP (max 5 rounds, stop when score >= 85):
  1. SEARCH — targeted Firecrawl searches for current gaps
  2. SCRAPE — deep-scrape most relevant results (parallel with &)
  3. SYNTHESIZE — extract key facts, data, quotes, angles
  4. SCORE — rate completeness 0-100 per dimension
  5. IDENTIFY GAPS — what's missing? what angles unexplored?
  6. If score >= 85 or round == 5 → STOP
  7. Generate new queries targeting gaps → LOOP

OUTPUT:
  - Structured research document with sourced facts
  - Statistics and data points
  - Multiple perspectives
  - Source URLs for attribution
```

### Research Dimensions

Score each 0-100 after every round:

| Dimension | Question |
|-----------|----------|
| core_facts | Clear definitions and key facts? |
| data_stats | At least 3 concrete numbers? |
| key_players | Main people/orgs and their roles? |
| timeline | Chronology of key events? |
| impact | Why this matters? |
| controversy | Opposing viewpoints covered? |
| future | Predictions or trends? |
| visuals | Vivid details for imagery? |

Overall = average. Threshold = 85.

### Rules

- Always use Firecrawl CLI for web operations (never WebSearch/WebFetch)
- Parallel scraping with `&` and `wait`
- Never read entire scrape files — use grep, head, offset/limit
- Source everything with URLs
- Numbers over adjectives ("grew 300%" not "grew significantly")
- Minimum 2 rounds, maximum 5
- Score honestly — 0 for missing dimensions

For the full research output template and Firecrawl command patterns, see **`references/research-template.md`**.

---

## solocrew Integration

When running autoresearch through a solocrew bot:

- The bot's `instructions.md` defines its domain expertise
- `program.md` in the project root configures the experiment
- Results commit to git on the bot's project branch
- Cross-bot pattern: dev bot modifies → QA bot scores → orchestrated loop
- Dashboard tracks experiment progress via Convex activity_log

## Additional Resources

### Reference Files

- **`references/presets.md`** — Ready-to-use configurations for common optimization targets
- **`references/research-template.md`** — Full research output template and Firecrawl patterns
