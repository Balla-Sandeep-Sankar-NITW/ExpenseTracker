export default function Navbar({ view, onChange }) {
  return (
    <header className="navbar">
      <div className="wordmark">
        Ledger<span className="dot">.</span>
      </div>
      <nav className="nav-tabs">
        <button
          className={view === "entries" ? "active" : ""}
          onClick={() => onChange("entries")}
        >
          Entries
        </button>
        <button
          className={view === "insights" ? "active" : ""}
          onClick={() => onChange("insights")}
        >
          Insights
        </button>
      </nav>
    </header>
  );
}
