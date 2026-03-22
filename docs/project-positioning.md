# solocrew — Project Positioning

> Date: 2026-03-22

---

## Value Proposition

An open-source architecture for one person to run a fleet of AI agents — using the tools they already have access to.

Not a SaaS. Not a platform lock-in. An architecture + plugin that shows people HOW to do it, and makes it easy.

---

## Strategy

1. **Open source plugin** (done) — people install it, create their own crew
2. **Show, don't tell** — the maintainer's own fleet (5 bots) is the living demo. Blog posts, tweets, videos showing what one person can accomplish with a crew
3. **Architecture docs** (started) — registry schema, security model, deployment patterns. People fork and adapt
4. **Community contributions** — Discord support, WhatsApp adapter, Pi deployments. PRs flow in because the architecture is clean and extensible
5. **Credibility to opportunities** — people see what you built, want their own version customized for their workflow/platform. Custom implementations via Infini Imaginator (imaginator.in)

---

## Differentiators

- **It actually works** — not a concept, there are 5 live bots in production use
- **Built on official Anthropic infrastructure** — Claude Code channels, not a hack
- **Simple architecture** — shell aliases + registry + Telegram. Anyone can understand and extend it
- **Security-first** — allowlist access, token isolation, path validation, dual alias model (safe/auto)
- **Lighter than alternatives** — no daemon, no infrastructure, just a plugin

---

## Comparison to OpenClaw

Similar playbook: open source the core, build community, monetize on custom implementations.

Key difference: solocrew is lighter and more accessible — no daemon, no gateway, no infrastructure. Just a Claude Code plugin + aliases + Telegram.

---

## Business Model

- **Open source plugin**: free, MIT license
- **Custom implementations**: paid, through Infini Imaginator (imaginator.in)
  - Build custom agent fleets for businesses
  - Platform-specific adaptations (Slack, WhatsApp, Discord)
  - VPS/on-prem deployment and management
  - Command center dashboard customization

---

## Visibility Plan

- Polish README with compelling demo GIF
- "How I run a 5-agent AI team from my phone" blog post
- Architecture docs clear enough for forking
- Keep building features that make the demo more impressive
- Engage with Claude Code / AI agent communities
