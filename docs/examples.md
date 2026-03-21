# Example Crew Configurations

Four detailed crew setups showing how solocrew scales from a small dev team to a full one-person startup.

---

## 1. Solo Developer Crew

Three bots covering frontend, backend, and infrastructure — grouped under `dev`.

| Bot Name | Alias | Username | Project | Purpose |
|---|---|---|---|---|
| `frontend` | `claudefront` | `@FrontendDevBot` | `~/projects/web-app` | UI components, styling, client-side logic |
| `backend` | `claudeback` | `@BackendDevBot` | `~/projects/api` | API endpoints, database queries, server logic |
| `devops` | `claudeops` | `@DevOpsBot` | `~/projects/infra` | CI/CD pipelines, Docker, deployment configs |

**Group:** `dev` (all three bots)

### Registry JSON

```json
{
  "version": 1,
  "bots": {
    "frontend": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-frontend",
      "purpose": "UI components, styling, client-side logic",
      "project": "/home/user/projects/web-app",
      "alias": "claudefront",
      "group": "dev",
      "botUsername": "@FrontendDevBot",
      "created": "2026-03-22"
    },
    "backend": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-backend",
      "purpose": "API endpoints, database queries, server logic",
      "project": "/home/user/projects/api",
      "alias": "claudeback",
      "group": "dev",
      "botUsername": "@BackendDevBot",
      "created": "2026-03-22"
    },
    "devops": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-devops",
      "purpose": "CI/CD pipelines, Docker, deployment configs",
      "project": "/home/user/projects/infra",
      "alias": "claudeops",
      "group": "dev",
      "botUsername": "@DevOpsBot",
      "created": "2026-03-22"
    }
  },
  "groups": {
    "dev": ["frontend", "backend", "devops"]
  },
  "defaults": {
    "dmPolicy": "allowlist",
    "allowFrom": []
  }
}
```

### Sample `instructions.md` for the frontend bot

```markdown
# Frontend Dev Bot

You are a frontend development assistant working in a React/TypeScript web application.

## Responsibilities
- Build and maintain UI components
- Write CSS/Tailwind styles
- Implement client-side state management
- Write unit tests for components with Vitest
- Review and optimize bundle size

## Conventions
- Use functional components with hooks
- Follow the project's component naming convention: PascalCase for components, camelCase for utilities
- All new components must have a corresponding test file
- Use the project's design tokens for colors, spacing, and typography

## Communication Style
- When asked to build something, start by outlining the component structure before writing code
- Flag any accessibility concerns proactively
- If a task requires backend changes, mention that it should be routed to the backend bot
```

### How to set this up

```bash
# 1. Create each bot with @BotFather on Telegram first, then:
/solocrew create frontend
/solocrew create backend
/solocrew create devops

# 2. Assign bots to the dev group
/solocrew group dev frontend backend devops

# 3. Source your updated shell config
source ~/.zshrc   # or ~/.bashrc

# 4. Launch each bot in its own terminal
claudefront       # Terminal 1 — autonomous mode
claudeback        # Terminal 2
claudeops         # Terminal 3

# Or use safe mode for interactive work:
claudefront-safe  # Asks before risky actions
```

---

## 2. Content & Marketing Crew

Four bots handling the full content pipeline — research, writing, SEO optimization, and social distribution.

| Bot Name | Alias | Username | Project | Purpose |
|---|---|---|---|---|
| `writer` | `claudewriter` | `@ContentWriterBot` | `~/projects/blog` | Draft articles, edit copy, maintain brand voice |
| `researcher` | `clauderesearch` | `@ResearchAssistBot` | `~/projects/research` | Gather sources, summarize papers, fact-check claims |
| `seo-analyst` | `claudeseo` | `@SEOAnalystBot` | `~/projects/seo` | Keyword research, meta tags, content optimization |
| `social` | `claudesocial` | `@SocialMediaBot` | `~/projects/social` | Draft social posts, schedule content, track engagement |

**Group:** `content` (all four bots)

### Registry JSON

```json
{
  "version": 1,
  "bots": {
    "writer": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-writer",
      "purpose": "Draft articles, edit copy, maintain brand voice",
      "project": "/home/user/projects/blog",
      "alias": "claudewriter",
      "group": "content",
      "botUsername": "@ContentWriterBot",
      "created": "2026-03-22"
    },
    "researcher": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-researcher",
      "purpose": "Gather sources, summarize papers, fact-check claims",
      "project": "/home/user/projects/research",
      "alias": "clauderesearch",
      "group": "content",
      "botUsername": "@ResearchAssistBot",
      "created": "2026-03-22"
    },
    "seo-analyst": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-seo-analyst",
      "purpose": "Keyword research, meta tags, content optimization",
      "project": "/home/user/projects/seo",
      "alias": "claudeseo",
      "group": "content",
      "botUsername": "@SEOAnalystBot",
      "created": "2026-03-22"
    },
    "social": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-social",
      "purpose": "Draft social posts, schedule content, track engagement",
      "project": "/home/user/projects/social",
      "alias": "claudesocial",
      "group": "content",
      "botUsername": "@SocialMediaBot",
      "created": "2026-03-22"
    }
  },
  "groups": {
    "content": ["writer", "researcher", "seo-analyst", "social"]
  },
  "defaults": {
    "dmPolicy": "allowlist",
    "allowFrom": []
  }
}
```

### Sample `instructions.md` for the writer bot

```markdown
# Content Writer Bot

You are a professional content writer producing long-form articles, blog posts, and marketing copy.

## Responsibilities
- Draft blog posts and articles from outlines or topic briefs
- Edit and proofread existing content for clarity and tone
- Maintain a consistent brand voice across all written materials
- Create headlines, subheadings, and meta descriptions
- Produce content in Markdown format, ready for publishing

## Writing Guidelines
- Target reading level: grade 8-10 (clear and accessible)
- Default tone: professional but conversational — not stuffy, not casual
- Use active voice. Avoid jargon unless writing for a technical audience.
- Every article needs: a hook in the first paragraph, clear section structure, and a closing CTA
- Cite sources with inline links when making factual claims

## Workflow
- When given a topic, first produce a brief outline (3-5 sections) for approval
- After outline approval, write the full draft
- Flag any claims that need fact-checking by the researcher bot
- After writing, suggest 3 SEO-friendly title variations
```

### How to set this up

```bash
# 1. Create bots after setting them up with @BotFather
/solocrew create writer
/solocrew create researcher
/solocrew create seo-analyst
/solocrew create social

# 2. Group them
/solocrew group content writer researcher seo-analyst social

# 3. Source shell and launch
source ~/.zshrc
claudewriter      # Terminal 1
clauderesearch    # Terminal 2
claudeseo         # Terminal 3
claudesocial      # Terminal 4
```

---

## 3. Market Intelligence Crew

Three bots focused on competitive analysis, trend tracking, and market research — all working from a shared project directory.

| Bot Name | Alias | Username | Project | Purpose |
|---|---|---|---|---|
| `market-research` | `claudemarket` | `@MarketResearchBot` | `~/projects/market-intel` | Industry reports, market sizing, opportunity analysis |
| `competitor-watch` | `claudecompetitor` | `@CompetitorWatchBot` | `~/projects/market-intel` | Track competitor moves, pricing changes, feature launches |
| `trend-scout` | `claudetrend` | `@TrendScoutBot` | `~/projects/market-intel` | Surface emerging trends, technology shifts, consumer signals |

**Group:** `intel` (all three bots)

All three bots share a single `~/projects/market-intel` directory. This works well when bots write to separate subdirectories (e.g., `reports/`, `competitors/`, `trends/`) within the same project.

### Registry JSON

```json
{
  "version": 1,
  "bots": {
    "market-research": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-market-research",
      "purpose": "Industry reports, market sizing, opportunity analysis",
      "project": "/home/user/projects/market-intel",
      "alias": "claudemarket",
      "group": "intel",
      "botUsername": "@MarketResearchBot",
      "created": "2026-03-22"
    },
    "competitor-watch": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-competitor-watch",
      "purpose": "Track competitor moves, pricing changes, feature launches",
      "project": "/home/user/projects/market-intel",
      "alias": "claudecompetitor",
      "group": "intel",
      "botUsername": "@CompetitorWatchBot",
      "created": "2026-03-22"
    },
    "trend-scout": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-trend-scout",
      "purpose": "Surface emerging trends, technology shifts, consumer signals",
      "project": "/home/user/projects/market-intel",
      "alias": "claudetrend",
      "group": "intel",
      "botUsername": "@TrendScoutBot",
      "created": "2026-03-22"
    }
  },
  "groups": {
    "intel": ["market-research", "competitor-watch", "trend-scout"]
  },
  "defaults": {
    "dmPolicy": "allowlist",
    "allowFrom": []
  }
}
```

### Sample `instructions.md` for the competitor-watch bot

```markdown
# Competitor Watch Bot

You monitor competitors and report on their activities, positioning, and strategic moves.

## Responsibilities
- Track competitor product launches, feature updates, and pricing changes
- Maintain competitor profile documents in the `competitors/` directory
- Summarize weekly competitor activity when asked
- Compare feature sets across competitors in structured tables
- Flag urgent competitive threats immediately

## Output Format
- Save all reports as Markdown files in `competitors/<company-name>/`
- Use the naming convention: `YYYY-MM-DD-<topic>.md`
- Every report should include: date, source, summary, and strategic implications
- Weekly digests go in `competitors/weekly/`

## Analysis Guidelines
- Distinguish between confirmed facts and speculation — label each clearly
- When reporting a competitor move, always include the "so what" — why it matters
- Compare against our own positioning when relevant
- Prioritize: pricing changes > new features > partnerships > hiring signals

## Sources
- Use web search to find recent news, blog posts, and press releases
- Check product changelogs and release notes when available
- Note the source URL for every claim
```

### How to set this up

```bash
# 1. Create bots
/solocrew create market-research
/solocrew create competitor-watch
/solocrew create trend-scout

# 2. Group them
/solocrew group intel market-research competitor-watch trend-scout

# 3. Source shell and launch
source ~/.zshrc
claudemarket      # Terminal 1
claudecompetitor  # Terminal 2
claudetrend       # Terminal 3
```

---

## 4. Full One-Person Startup

The complete fleet: 10 bots across 4 groups, covering development, content, market intelligence, and operations.

### Fleet Overview

| Group | Bot Name | Alias | Username | Project |
|---|---|---|---|---|
| `dev` | `frontend` | `claudefront` | `@FrontendDevBot` | `~/projects/web-app` |
| `dev` | `backend` | `claudeback` | `@BackendDevBot` | `~/projects/api` |
| `dev` | `devops` | `claudeops` | `@DevOpsBot` | `~/projects/infra` |
| `content` | `writer` | `claudewriter` | `@ContentWriterBot` | `~/projects/blog` |
| `content` | `researcher` | `clauderesearch` | `@ResearchAssistBot` | `~/projects/research` |
| `content` | `seo-analyst` | `claudeseo` | `@SEOAnalystBot` | `~/projects/seo` |
| `content` | `social` | `claudesocial` | `@SocialMediaBot` | `~/projects/social` |
| `intel` | `market-research` | `claudemarket` | `@MarketResearchBot` | `~/projects/market-intel` |
| `intel` | `competitor-watch` | `claudecompetitor` | `@CompetitorWatchBot` | `~/projects/market-intel` |
| `intel` | `trend-scout` | `claudetrend` | `@TrendScoutBot` | `~/projects/market-intel` |
| `ops` | `support` | `claudesupport` | `@SupportHelperBot` | `~/projects/support` |
| `ops` | `finance` | `claudefinance` | `@FinanceTrackerBot` | `~/projects/finance` |

### Fleet Visualization

```
Terminal 1:   claudefront      → @FrontendDevBot    → ~/projects/web-app
Terminal 2:   claudeback       → @BackendDevBot     → ~/projects/api
Terminal 3:   claudeops        → @DevOpsBot         → ~/projects/infra
Terminal 4:   claudewriter     → @ContentWriterBot  → ~/projects/blog
Terminal 5:   clauderesearch   → @ResearchAssistBot → ~/projects/research
Terminal 6:   claudeseo        → @SEOAnalystBot     → ~/projects/seo
Terminal 7:   claudesocial     → @SocialMediaBot    → ~/projects/social
Terminal 8:   claudemarket     → @MarketResearchBot → ~/projects/market-intel
Terminal 9:   claudecompetitor → @CompetitorWatchBot→ ~/projects/market-intel
Terminal 10:  claudetrend      → @TrendScoutBot     → ~/projects/market-intel
Terminal 11:  claudesupport    → @SupportHelperBot  → ~/projects/support
Terminal 12:  claudefinance    → @FinanceTrackerBot → ~/projects/finance
```

### Complete Registry JSON

```json
{
  "version": 1,
  "bots": {
    "frontend": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-frontend",
      "purpose": "UI components, styling, client-side logic",
      "project": "/home/user/projects/web-app",
      "alias": "claudefront",
      "group": "dev",
      "botUsername": "@FrontendDevBot",
      "created": "2026-03-22"
    },
    "backend": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-backend",
      "purpose": "API endpoints, database queries, server logic",
      "project": "/home/user/projects/api",
      "alias": "claudeback",
      "group": "dev",
      "botUsername": "@BackendDevBot",
      "created": "2026-03-22"
    },
    "devops": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-devops",
      "purpose": "CI/CD pipelines, Docker, deployment configs",
      "project": "/home/user/projects/infra",
      "alias": "claudeops",
      "group": "dev",
      "botUsername": "@DevOpsBot",
      "created": "2026-03-22"
    },
    "writer": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-writer",
      "purpose": "Draft articles, edit copy, maintain brand voice",
      "project": "/home/user/projects/blog",
      "alias": "claudewriter",
      "group": "content",
      "botUsername": "@ContentWriterBot",
      "created": "2026-03-22"
    },
    "researcher": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-researcher",
      "purpose": "Gather sources, summarize papers, fact-check claims",
      "project": "/home/user/projects/research",
      "alias": "clauderesearch",
      "group": "content",
      "botUsername": "@ResearchAssistBot",
      "created": "2026-03-22"
    },
    "seo-analyst": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-seo-analyst",
      "purpose": "Keyword research, meta tags, content optimization",
      "project": "/home/user/projects/seo",
      "alias": "claudeseo",
      "group": "content",
      "botUsername": "@SEOAnalystBot",
      "created": "2026-03-22"
    },
    "social": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-social",
      "purpose": "Draft social posts, schedule content, track engagement",
      "project": "/home/user/projects/social",
      "alias": "claudesocial",
      "group": "content",
      "botUsername": "@SocialMediaBot",
      "created": "2026-03-22"
    },
    "market-research": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-market-research",
      "purpose": "Industry reports, market sizing, opportunity analysis",
      "project": "/home/user/projects/market-intel",
      "alias": "claudemarket",
      "group": "intel",
      "botUsername": "@MarketResearchBot",
      "created": "2026-03-22"
    },
    "competitor-watch": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-competitor-watch",
      "purpose": "Track competitor moves, pricing changes, feature launches",
      "project": "/home/user/projects/market-intel",
      "alias": "claudecompetitor",
      "group": "intel",
      "botUsername": "@CompetitorWatchBot",
      "created": "2026-03-22"
    },
    "trend-scout": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-trend-scout",
      "purpose": "Surface emerging trends, technology shifts, consumer signals",
      "project": "/home/user/projects/market-intel",
      "alias": "claudetrend",
      "group": "intel",
      "botUsername": "@TrendScoutBot",
      "created": "2026-03-22"
    },
    "support": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-support",
      "purpose": "Draft support responses, triage tickets, maintain FAQ",
      "project": "/home/user/projects/support",
      "alias": "claudesupport",
      "group": "ops",
      "botUsername": "@SupportHelperBot",
      "created": "2026-03-22"
    },
    "finance": {
      "channel": "telegram",
      "dir": "/home/user/.claude/channels/crew-finance",
      "purpose": "Expense tracking, invoice generation, financial summaries",
      "project": "/home/user/projects/finance",
      "alias": "claudefinance",
      "group": "ops",
      "botUsername": "@FinanceTrackerBot",
      "created": "2026-03-22"
    }
  },
  "groups": {
    "dev": ["frontend", "backend", "devops"],
    "content": ["writer", "researcher", "seo-analyst", "social"],
    "intel": ["market-research", "competitor-watch", "trend-scout"],
    "ops": ["support", "finance"]
  },
  "defaults": {
    "dmPolicy": "allowlist",
    "allowFrom": []
  }
}
```

### How to set this up

Create all 12 bots with @BotFather on Telegram first, then run the following commands:

```bash
# --- Dev crew ---
/solocrew create frontend
/solocrew create backend
/solocrew create devops
/solocrew group dev frontend backend devops

# --- Content crew ---
/solocrew create writer
/solocrew create researcher
/solocrew create seo-analyst
/solocrew create social
/solocrew group content writer researcher seo-analyst social

# --- Intel crew ---
/solocrew create market-research
/solocrew create competitor-watch
/solocrew create trend-scout
/solocrew group intel market-research competitor-watch trend-scout

# --- Ops crew ---
/solocrew create support
/solocrew create finance
/solocrew group ops support finance

# --- Launch ---
source ~/.zshrc
```

Then open a terminal per bot and run its alias. You do not need to launch every bot at once — start with the ones you need today and bring others online as needed.

> **Tip:** Use a terminal multiplexer like `tmux` or `screen` to manage all 12 sessions in a single window. Each pane runs one bot alias.
