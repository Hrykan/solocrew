# solocrew Command Center — Vision Doc

> Date: 2026-03-22
> Status: Planning

---

## Core Concept

A sim-game style command center (think Kairosoft / Game Dev Tycoon) where the user sees all their AI agents as characters in a 2D isometric workspace. Each agent has a distinct visual identity, personality, and visible work status.

### What the user sees

- A 2D isometric virtual office/workspace
- Each bot is a character sprite at a "station" matching their role (coding desk, editing bay, data console, management board)
- Status bubbles show what each bot is doing: "Working on PR #42", "Idle", "Waiting for review"
- Click a bot to see activity log, assign tasks, or open a chat
- At scale: multiple "floors" — dev floor, content floor, ops floor
- Bots move between stations based on current activity

### Character Design

Each bot has:
- A distinct sprite/avatar reflecting their role and personality
- Idle animations (reading newspaper, stretching, organizing desk)
- Working animations (typing, code particles, progress bars)
- Status indicators (green = active, yellow = idle, red = error)

---

## Technical Architecture

### Frontend
- **React** — UI shell, panels, task assignment
- **PixiJS** — 2D rendering for the sim view (sprites, animations, isometric grid)
- **Convex client** — real-time subscriptions for live bot status

### Primary Backend: Convex
- Real-time subscriptions — bot status pushes to dashboard instantly
- Quick mutations — task assignment reflected everywhere immediately
- Built-in auth, file storage, scheduled functions (cron)
- TypeScript-native
- Manages: bot state, positions, statuses, activity logs, task queues

### Analytics Layer (separate)
Convex is optimized for transactional reads/writes, not analytical queries. For analytics:

- **Option A:** Convex export to PostgreSQL (on VPS / imaginator.in)
  - Periodic sync via Convex action
  - Grafana dashboards for: token usage over time, bot productivity, cost breakdowns
- **Option B:** SQLite on VPS for simpler setups

### Bridge Service
A small service that syncs bot activity into Convex:
- Reads from crew-registry.json and bot state directories
- Watches for tmux session status, last message timestamps
- Pushes updates to Convex tables
- Could run as a Convex action polling the local filesystem, or a lightweight daemon on the host

### Communication
- Tasks assigned via dashboard are sent to bots via Telegram Bot API
- Responses flow back through the same Telegram channel
- Future: direct WebSocket communication bypassing Telegram for dashboard-to-bot

---

## Evolution Levels

| Level | Name | Description |
|-------|------|-------------|
| 1 | Fleet Manager | Current state — 5 bots, individual Telegram messaging |
| 2 | Command Center | Web dashboard, see all bots, assign tasks, monitor progress |
| 3 | Orchestrator | Cross-bot messaging, workflow pipelines, shared context |
| 4 | Agent Platform | Other people run solocrew for their teams (SaaS potential) |

---

## Hosting

- Target domain: solocrew.dev or similar
- Deploy via Vercel (frontend) + Convex (backend) + VPS (analytics)
- Mobile-responsive — usable from phone as well as desktop

---

## Security Considerations

- Dashboard auth required (Convex auth / OAuth)
- Bot tokens never leave the host — dashboard only sees status, not credentials
- Task assignment goes through Telegram Bot API (already secured with allowlist)
- Analytics DB contains usage patterns, not message content
- No bot-to-bot lateral access through the dashboard

---

## Open Questions

- Sprite art: custom pixel art or generated? Could use the cybernetic octopus brand aesthetic
- Domain: solocrew.dev? crew.imaginator.in?
- MVP scope: start with status cards + task assignment, add sim view later?
