# Edge/Mobile Agent Deployment: Landscape Research for solocrew

> Research date: 2026-03-22
> Scope: How AI agents are deployed on edge devices and mobile platforms, and how solocrew could leverage these patterns.

---

## 1. Edge/Mobile Agent Frameworks

### 1.1 Raspberry Pi as Agent Orchestrator

The Raspberry Pi 5 (8GB, ~$80) has emerged as the cheapest viable 24/7 agent orchestrator. The key insight: **the Pi doesn't run inference — it orchestrates API calls**. Since tools like OpenClaw and Claude Code primarily send requests to cloud APIs, a Pi's modest hardware is more than enough for the core loop: receiving messages, dispatching to APIs, returning results.

**What works on a Pi:**
- OpenClaw gateway, scheduler, memory, and all cloud-based inference
- Telegram bot polling/webhook handling
- File-based state management (registry, access control, logs)
- Cron-based scheduling and health checks
- Power draw: ~5W, ~$0.40/month electricity

**What doesn't work on a Pi:**
- Local LLM inference (no GPU, insufficient RAM for even 3B models)
- Browser automation (Playwright/Puppeteer need significant resources)
- Heavy file processing or compilation

**Relevance to solocrew:** A Pi could run the entire solocrew fleet as an always-on orchestrator. Each bot's Claude Code session would still call Anthropic's API for inference, but the Pi handles message routing, scheduling, and state.

### 1.2 Mac mini / Mac Studio as Local Inference Nodes

The Mac mini M4 became the "unofficial OpenClaw appliance" in early 2026:
- 10-15W at idle, silent, always-on design
- M4 Neural Engine runs 7B-14B models via Ollama at usable speeds
- M4 Pro (48GB) handles 30B-70B models
- Mac Studio M4 Max (64-128GB) delivers ~60 tokens/sec on 30B models

**Fleet pattern:** Pi orchestrates, Mac runs local inference when needed, cloud API handles complex reasoning.

### 1.3 NVIDIA Jetson for Edge AI

The Jetson lineup serves a different niche — primarily robotics and computer vision rather than text-based agents:
- Jetson Orin Nano: 40 TOPS, good for small model inference
- Jetson AGX Orin (64GB): Can run agent-style workflows with open models
- Jetson AGX Thor: Server-class compute for physical AI agents

Less relevant for solocrew's text-based agent fleet, but worth noting for future multimodal agent capabilities.

### 1.4 Apple Intelligence On-Device

Apple's Foundation Models framework (WWDC 2025) provides developers access to ~3B parameter on-device models. Siri 2.0, targeted for spring 2026 (iOS 26.4), evolves from voice assistant to "autonomous AI agent" with agentic workflows navigating apps and executing multi-step tasks.

**Relevance:** Apple Shortcuts can already capture spoken input, transcribe it, and route to external services. A Siri Shortcut -> solocrew bot pipeline is technically feasible today via n8n or direct webhook integration.

### 1.5 Local LLM Servers (Ollama, LM Studio)

The local LLM ecosystem has matured significantly:

| Tool | Best For | API Compatible |
|------|----------|---------------|
| **Ollama** | CLI/API automation, headless servers, CI/CD | OpenAI-compatible API |
| **LM Studio** | Desktop GUI, model evaluation/selection | OpenAI-compatible API |
| **Jan** | Privacy-focused desktop app | OpenAI-compatible API |
| **vLLM** | High-throughput production serving | OpenAI-compatible API |
| **LocalAI** | Drop-in OpenAI replacement | OpenAI-compatible API |

All expose OpenAI-compatible APIs, making them potential backends for agent frameworks that support custom endpoints.

---

## 2. Inference Cascades for Fleet Economics

### 2.1 How Cascading Works

Model cascading is now an established pattern in production LLM systems (GPT-5 uses it internally). The core idea:

1. **Start with the cheapest model** — route the query to a small, fast model first
2. **Assess confidence** — if the small model's confidence is low or output is malformed, escalate
3. **Escalate to larger models** — progressively try more capable (and expensive) models
4. **Cloud as final fallback** — only use expensive cloud APIs for queries that genuinely need them

Research frameworks include:
- **Cascadia**: Adaptive cascade across small/medium/large model tiers
- **ZOOTER**: Reward-based routing optimizing accuracy vs. cost
- **Speculative cascades** (Google Research): Hybrid of cascading + speculative decoding

### 2.2 Cost Implications

The economics are compelling for fleet operators:

| Approach | Cost per 1M tokens (approx) | Latency | Quality |
|----------|---------------------------|---------|---------|
| Cloud only (Claude Opus) | $15-75 | Low | Highest |
| Cloud only (Claude Haiku) | $0.25-1.25 | Lowest | Good |
| Local 27B (Mac M4 Pro) | ~$0 (electricity) | Medium | Good |
| Local 9B (Mac M4) | ~$0 (electricity) | Low | Moderate |
| Cascade: local 9B -> local 27B -> cloud | Blended ~$2-5 | Variable | High |

OpenClaw's hardware ecosystem reports 40-60% reduction in cloud API costs when routing simple inference locally and reserving cloud for complex reasoning.

### 2.3 Role-Based Model Assignment

Different agent roles have different intelligence requirements:

| Agent Role | Model Needs | Recommended Tier |
|------------|------------|-----------------|
| Dev/coding agent | High reasoning, code generation | Cloud Opus/Sonnet or local 70B |
| Writer/content agent | Good prose, creativity | Cloud Sonnet or local 27B |
| Research agent | Web search, summarization | Cloud Haiku or local 14B |
| Monitoring/ops agent | Status checks, log parsing | Local 9B or Cloud Haiku |
| Notification agent | Template-based responses | Local 3B or rule-based |

**Key insight:** A solocrew fleet of 5 bots doesn't need 5 Opus-tier sessions. A monitoring bot checking server health every hour can run on Haiku at 1/100th the cost.

---

## 3. Mobile-First Agent Access

### 3.1 Messaging Platform Landscape

| Platform | Bot API Status | Agent Viability | Notes |
|----------|---------------|-----------------|-------|
| **Telegram** | Mature, full-featured | Excellent | Claude Code native support, rich media, inline keyboards |
| **Discord** | Mature, full-featured | Excellent | Claude Code native support, server/channel model |
| **WhatsApp** | Business API only | Good with middleware | 3B users, requires approved business account or API provider (Gupshup, Twilio) |
| **Slack** | Mature workspace API | Good | Enterprise-focused, bolt SDK |
| **iMessage** | No public bot API | Poor | Apple doesn't offer programmatic access; workarounds fragile |
| **SMS** | Twilio/Vonage APIs | Moderate | Universal reach, no rich media, high per-message cost |
| **Signal** | Limited bot support | Poor | Privacy-focused, minimal automation APIs |

**WhatsApp integration path:** Use WhatsApp Business API (via Twilio, Gupshup, or self-hosted Baileys library) as a channel adapter. Messages arrive via webhook, get routed to Claude Code session, response sent back. This is achievable but requires a registered business number and API provider.

**SMS integration path:** Twilio webhook -> agent backend -> Twilio response. Simple but expensive ($0.0079/message) and limited to plain text.

### 3.2 PWA Fleet Dashboard

A Progressive Web App for fleet monitoring is now fully viable:
- All major browsers support service workers, Web App Manifest, and Web Push (2026)
- Push notifications work on iOS (since iOS 16.4) and Android
- Installable on home screen for native-like experience
- Can show: bot status, recent messages, error rates, token usage, session health

**Architecture:** Each solocrew bot writes status to a shared state file or lightweight API. PWA polls or subscribes via WebSocket. Push notifications fire on errors or important events.

### 3.3 Voice Interaction

Three viable patterns:
1. **Telegram voice messages** — Bot receives audio, transcribes via Whisper/Deepgram, processes as text, responds as text or TTS audio
2. **Siri Shortcuts** — Capture spoken input -> transcribe -> send to webhook -> receive response -> speak it back. n8n templates exist for this exact flow.
3. **Direct voice in Claude Code** — Not yet supported natively, but Telegram voice messages provide a natural proxy

---

## 4. Always-On Agent Patterns

### 4.1 Process Management Comparison

| Method | Auto-Restart | Boot Start | Multi-Instance | Best For |
|--------|-------------|-----------|----------------|----------|
| **tmux/screen** | No | No | Yes (panes) | Dev/testing, SSH sessions |
| **pm2** | Yes | Yes | Yes | Cross-platform, most users |
| **systemd** | Yes | Yes | Yes (units) | Linux VPS production |
| **launchd** | Yes | Yes | Yes (plists) | macOS production |
| **Docker** | Yes | Yes | Yes (containers) | Full isolation, portability |
| **cron + tmux** | Partial | Yes | Yes | Scheduled work cycles |

### 4.2 Claude Code on VPS: The Standard Stack

The community-standard setup for always-on Claude Code:
1. **VPS**: Ubuntu, 1-2GB RAM minimum, non-root user with sudo
2. **Security**: SSH keys, UFW firewall, Tailscale for private access
3. **Runtime**: Node.js/Bun installed, Claude Code installed
4. **Auth**: `claude setup-token` on local machine -> transfer OAuth token to VPS via `CLAUDE_CODE_OAUTH_TOKEN`
5. **Session**: tmux session per bot, `--no-browser` flag for headless
6. **Persistence**: tmux sessions survive SSH disconnection

### 4.3 Watchdog and Health Patterns

**Cron-based health check (from OpenClaw community):**
```bash
*/5 * * * * curl -sf http://localhost:18789/health || \
  curl -s "https://api.telegram.org/botTOKEN/sendMessage" \
  -d "chat_id=CHAT_ID&text=Gateway+DOWN"
```

**Self-scheduling pattern (tmux-orchestrator):**
Agents schedule their own next check-in with context notes. Each round runs with `--no-session-persistence` to avoid session expiry. State persists in shared files, not memory.

**Hourly work cycles (AI Night Shift):**
Rather than continuous operation, agents wake hourly via cron, do a burst of work, commit progress to git, and sleep. This respects rate limits and prevents context window exhaustion.

### 4.4 Multi-Agent Resource Management

**Rate limits are the real bottleneck, not hardware.** A modern laptop with 16GB+ RAM handles 3-4 concurrent CLI agents. Claude Code Pro tier comfortably supports 2-3 concurrent instances; Max tier pushes to 4-5.

**Isolation patterns:**
- Git worktrees: instant setup, shared history, minimal disk overhead (preferred)
- Docker containers: full isolation, portable, heavier setup
- Separate tmux panes: simplest, no file isolation (risk of conflicts)

**Tools that have emerged:**
- **NTM (Named Tmux Manager)**: Named panes, broadcast prompts, conflict detection, TUI dashboard
- **cmux**: GPU-accelerated terminal with agent notifications and vertical tabs
- **AMUX**: Handles dozens of parallel agents with self-healing watchdog and SQLite kanban
- **Codeman**: Web UI for managing Claude Code instances in tmux sessions
- **agent-deck**: Terminal session manager TUI for multiple AI coding agents

---

## 5. Recommendations for solocrew

### Near-Term (v1.1-1.2, 0-3 months)

These require minimal architecture changes and build on solocrew's existing patterns.

#### 5a. Always-On VPS Deployment Guide
**Effort: Documentation only**

solocrew already works on a VPS — the architecture is just shell aliases + environment variables + Claude Code. What's missing is a documented deployment path:

1. Provision VPS (Ubuntu, 2GB+ RAM)
2. Install Bun + Claude Code
3. Transfer OAuth token via `claude setup-token` + `CLAUDE_CODE_OAUTH_TOKEN`
4. Run `/solocrew create` to set up bots
5. Launch each bot alias inside a dedicated tmux session
6. Optional: cron health check that pings a Telegram bot if a session dies

**Concrete addition to solocrew:** A `/solocrew deploy` command that generates a systemd unit file or tmux launcher script for all registered bots.

#### 5b. Bot Health Check Command
**Effort: Small feature**

Add `/solocrew health` that checks each registered bot:
- Is the tmux session running? (`tmux has-session -t <name>`)
- Is the Claude Code process alive? (`pgrep -f "TELEGRAM_STATE_DIR=<dir>"`)
- When was the last message processed? (check bot directory for activity)

#### 5c. Fleet Launcher Script
**Effort: Small feature**

Generate a `crew-launch.sh` script that starts all registered bots in tmux panes:
```bash
#!/bin/bash
tmux new-session -d -s crew
for bot in $(jq -r '.bots | keys[]' ~/.claude/channels/crew-registry.json); do
  tmux new-window -t crew -n "$bot"
  tmux send-keys -t "crew:$bot" "<alias command>" Enter
done
tmux attach -t crew
```

This could be generated by `/solocrew launch` using the registry data.

### Medium-Term (v1.3-2.0, 3-6 months)

These require new infrastructure but are achievable with solocrew's plugin architecture.

#### 5d. Inference Cascade Support (Model Routing Per Bot)
**Effort: Medium feature**

Add a `model` field to the bot registry schema:
```json
{
  "devbot": {
    "model": "opus",
    "channel": "telegram",
    ...
  },
  "monitor": {
    "model": "haiku",
    ...
  }
}
```

The shell alias would include `--model <model>` (if Claude Code supports it) or set an environment variable that controls model selection. This lets fleet operators assign expensive models to dev bots and cheap models to monitoring bots.

**Cost impact:** A 5-bot fleet using all Opus might cost $X/day. With cascade routing (1 Opus + 2 Sonnet + 2 Haiku), costs drop 60-70%.

#### 5e. WhatsApp Channel Adapter
**Effort: Medium feature**

Since Claude Code channels are plugin-based, a WhatsApp adapter following the same pattern as the Telegram plugin is feasible:
1. Use WhatsApp Business API (via Baileys for self-hosted, or Twilio for managed)
2. Webhook receives messages -> routes to Claude Code session
3. Response sent back via WhatsApp API

This would make solocrew accessible to WhatsApp's 3B users without changing the core architecture.

#### 5f. PWA Fleet Dashboard
**Effort: Medium feature**

A lightweight web dashboard that reads from the crew-registry.json and bot state directories:
- Bot list with status indicators (running/stopped/error)
- Last message timestamp per bot
- Token usage estimates
- Push notifications on bot failures
- Mobile-friendly for phone-based fleet management

Stack: Static PWA (no server needed), reads state from a JSON file that bots update. Could be a simple HTML/JS file served locally or on the VPS.

#### 5g. Voice Message Support
**Effort: Small feature (if Telegram plugin supports it)**

Telegram already delivers voice messages to bots. The channel plugin would need to:
1. Receive voice message
2. Transcribe via Whisper API or Deepgram
3. Forward transcription to Claude Code as text
4. Return response as text (or optionally TTS audio)

This lets the CEO manage their fleet while walking or driving.

### Long-Term (v2.0+, 6-12 months)

These represent architectural shifts that expand solocrew's reach significantly.

#### 5h. solocrew on Raspberry Pi
**Effort: Large feature (but mostly documentation + testing)**

A Pi 5 (8GB) can run the entire solocrew stack:
- All bot sessions run in tmux (Pi orchestrates, cloud does inference)
- Registry, state, and config live on the Pi's SD card (or USB SSD for reliability)
- Power draw: ~5W, always-on, silent
- Total cost: ~$100 hardware + ~$0.40/month electricity

The main work is testing Claude Code's VPS deployment pattern on ARM64 and documenting Pi-specific setup (headless install, SSH-only access, optional Tailscale).

#### 5i. Hybrid Local/Cloud Inference
**Effort: Large architectural change**

For bots that don't need Claude-tier intelligence:
1. Run Ollama on a Mac mini alongside the Pi orchestrator
2. Simple bots (monitoring, notifications) hit Ollama's local API
3. Complex bots (dev, research) hit Anthropic's cloud API
4. The registry tracks which backend each bot uses

This requires solocrew to abstract the inference backend, which is a significant change from the current "everything is a Claude Code session" model.

#### 5j. Cross-Agent Communication
**Effort: Large feature**

Enable bots to message each other through shared files or a lightweight message bus:
- Dev bot completes a feature -> notifies QA bot to test
- Research bot finds an insight -> forwards to writer bot
- Ops bot detects an issue -> alerts dev bot

The tmux-orchestrator project shows a working pattern: shared markdown files that agents read/write on their heartbeat cycles.

#### 5k. Siri/Shortcuts Integration
**Effort: Medium feature**

An Apple Shortcut that:
1. Captures voice input via Siri
2. Transcribes to text
3. Sends to a specific solocrew bot via Telegram (or direct webhook)
4. Reads back the response via Siri TTS

This makes solocrew accessible via "Hey Siri, tell my dev bot to check the build status."

---

## 6. Recommended Priority Order

Based on impact, effort, and alignment with solocrew's vision:

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| 1 | Fleet launcher script (`/solocrew launch`) | Small | High — immediate quality-of-life |
| 2 | Health check command (`/solocrew health`) | Small | High — essential for always-on |
| 3 | VPS deployment guide + `deploy` command | Small-Medium | High — unlocks always-on for everyone |
| 4 | Model routing per bot (inference cascade) | Medium | High — fleet economics |
| 5 | Voice message transcription | Small | Medium — mobile-first CEO experience |
| 6 | PWA fleet dashboard | Medium | Medium — visual fleet management |
| 7 | WhatsApp channel adapter | Medium | Medium — massive reach expansion |
| 8 | Raspberry Pi deployment guide | Small | Medium — cheapest always-on option |
| 9 | Cross-agent communication | Large | High — unlocks true fleet collaboration |
| 10 | Hybrid local/cloud inference | Large | Medium — cost optimization for power users |
| 11 | Siri Shortcuts integration | Medium | Low-Medium — niche but impressive |

---

## Sources

### Edge/Mobile Frameworks
- [Beyond the Cloud: Running OpenClaw on Mac mini, Raspberry Pi, and Intel AI PCs](https://openclaws.io/blog/openclaw-hardware-ecosystem-2026)
- [Turn your Raspberry Pi into an AI agent with OpenClaw](https://www.raspberrypi.com/news/turn-your-raspberry-pi-into-an-ai-agent-with-openclaw/)
- [Best Hardware for OpenClaw in 2026](https://pchojecki.medium.com/the-best-hardware-setup-for-openclaw-in-2026-from-raspberry-pi-to-mac-mini-and-beyond-893fc4d079e4)
- [Getting Started with Edge AI on NVIDIA Jetson](https://developer.nvidia.com/blog/getting-started-with-edge-ai-on-nvidia-jetson-llms-vlms-and-foundation-models-for-robotics/)
- [Edge AI in 2026](https://www.codercops.com/blog/edge-ai-on-device-intelligence-iot-sensors-2026)

### Inference Cascades
- [Dynamic Model Routing and Cascading for Efficient LLM Inference: A Survey](https://arxiv.org/html/2603.04445)
- [Speculative Cascades — Google Research](https://research.google/blog/speculative-cascades-a-hybrid-approach-for-smarter-faster-llm-inference/)
- [A Unified Approach to Routing and Cascading for LLMs](https://arxiv.org/html/2410.10347v1)
- [Cascadia: An Efficient Cascade Serving System](https://arxiv.org/html/2506.04203)

### Local LLM Infrastructure
- [Run LLMs Locally with Ollama](https://www.cohorte.co/blog/run-llms-locally-with-ollama-privacy-first-ai-for-developers-in-2025)
- [LM Studio vs Ollama 2026](https://www.zealousys.com/blog/lm-studio-vs-ollama/)
- [Local LLM Hosting Complete Guide](https://medium.com/@rosgluk/local-llm-hosting-complete-2025-guide-ollama-vllm-localai-jan-lm-studio-more-f98136ce7e4a)

### Mobile/Messaging
- [WhatsApp AI Chatbot Platforms 2026](https://www.kommunicate.io/blog/best-whatsapp-ai-chatbots/)
- [Create a WhatsApp Bot: Complete Guide](https://www.voiceflow.com/blog/whatsapp-chatbot)
- [Apple Intelligence and Siri 2026](https://ia.acs.org.au/article/2026/apple-reveals-the-ai-behind-siri-s-big-2026-upgrade.html)
- [Siri AI Agent via Apple Shortcuts (n8n template)](https://n8n.io/workflows/2436-siri-ai-agent-apple-shortcuts-powered-voice-template/)

### Always-On Patterns
- [Claude Code on VPS: Complete Setup](https://medium.com/@0xmega/claude-code-on-a-vps-the-complete-setup-security-tmux-mobile-access-2d214f5a0b3b)
- [AI Night Shift: tmux + cron + Claude Code](https://judyailab.com/en/posts/ai-night-shift-setup-guide/)
- [Agentmaxxing: Multiple AI Agents in Parallel](https://vibecoding.app/blog/agentmaxxing)
- [OpenClaw Gateway Daemon Guide](https://www.crewclaw.com/blog/openclaw-gateway-daemon-guide)
- [tmux-orchestrator-ai-code](https://github.com/bufanoc/tmux-orchestrator-ai-code)
- [Agentic Coding Flywheel Setup](https://github.com/Dicklesworthstone/agentic_coding_flywheel_setup)

### Claude Code Channels
- [Claude Code Channels Documentation](https://code.claude.com/docs/en/channels)
- [Claude Code Telegram Plugin Setup 2026](https://dev.to/czmilo/claude-code-telegram-plugin-complete-setup-guide-2026-3j0p)
- [Anthropic ships Claude Code Channels (VentureBeat)](https://venturebeat.com/orchestration/anthropic-just-shipped-an-openclaw-killer-called-claude-code-channels)

### Fleet Monitoring & Tools
- [AI Observability Tools 2026](https://www.braintrust.dev/articles/best-ai-observability-tools-2026)
- [Codeman: Web UI for Claude Code in tmux](https://github.com/Ark0N/Codeman)
- [agent-deck: Terminal session manager for AI agents](https://github.com/asheshgoplani/agent-deck)
