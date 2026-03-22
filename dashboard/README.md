# solocrew Command Center

Real-time fleet dashboard for your solocrew agent fleet.

## Setup

### 1. Install dependencies

```bash
cd dashboard
npm install
```

### 2. Set up Convex

Create a Convex project at [dashboard.convex.dev](https://dashboard.convex.dev):

```bash
npx convex dev
```

This will create a `.env.local` file with your `VITE_CONVEX_URL`.

### 3. Run the dev server

```bash
npm run dev
```

## Architecture

- **Frontend:** React + Vite + TypeScript
- **Backend:** Convex (real-time database + serverless functions)
- **Data flow:** Sync service reads local registry + bot status, pushes to Convex, dashboard subscribes to real-time updates

## Convex Schema

- `bots` — Bot metadata and status (synced from crew-registry.json)
- `activity_log` — Bot activity feed (messages, tasks, errors)
- `tasks` — Task assignments from dashboard to bots
