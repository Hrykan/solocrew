import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { BotCard } from "./components/BotCard";
import "./App.css";

function App() {
  const bots = useQuery(api.bots.list);

  const healthyCount = bots?.filter((b) => b.status === "healthy").length ?? 0;
  const totalCount = bots?.length ?? 0;

  return (
    <div className="app">
      <header className="header">
        <h1>solocrew</h1>
        <p className="tagline">command center</p>
      </header>

      <div className="fleet-summary">
        <span className="health-count">
          {healthyCount}/{totalCount} bots healthy
        </span>
      </div>

      <div className="bot-grid">
        {bots === undefined ? (
          <p className="loading">Loading fleet...</p>
        ) : bots.length === 0 ? (
          <p className="empty">
            No bots synced yet. Run the sync service to populate the dashboard.
          </p>
        ) : (
          bots.map((bot) => <BotCard key={bot._id} bot={bot} />)
        )}
      </div>
    </div>
  );
}

export default App;
