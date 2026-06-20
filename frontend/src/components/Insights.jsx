import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { api } from "../api";
import { monthName } from "../utils/months";

const PALETTE = [
  "#7c6bf0", // accent indigo
  "#3fc6a8", // teal
  "#f0b259", // amber
  "#5aa9e6", // sky
  "#e272a6", // pink
  "#a6cc5c", // lime
  "#9d8cf5", // light indigo
];

const TOOLTIP_STYLE = {
  background: "#1a1c23",
  border: "1px solid #33353f",
  borderRadius: 8,
  fontSize: 12,
  color: "#edeef2",
};

function ChartCard({ title, sub, children, full }) {
  return (
    <div className={`card${full ? " full" : ""}`}>
      <h3>{title}</h3>
      {sub && <div className="card-sub">{sub}</div>}
      {children}
    </div>
  );
}

export default function Insights() {
  const [categories, setCategories] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [daily, setDaily] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [cat, month, day] = await Promise.all([
          api.getCategories(),
          api.getMonthly(),
          api.getDaily(),
        ]);
        if (cancelled) return;

        setCategories(
          (cat.groupexpences || []).map((item) => ({
            name: item.category ?? "Uncategorized",
            value: item.total,
          }))
        );

        setMonthly(
          (month.groupexpences || [])
            .slice()
            .sort((a, b) => (a.month ?? 0) - (b.month ?? 0))
            .map((item) => ({
              month: monthName(item.month),
              total: item.total,
            }))
        );

        setDaily(
          (day.groupexpences || [])
            .slice()
            .sort((a, b) => (a.day ?? 0) - (b.day ?? 0))
            .map((item) => ({
              day: item.day,
              total: item.total,
            }))
        );
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load insights.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="state-banner">Loading insights…</div>;
  }

  if (error) {
    return <div className="state-banner error">{error}</div>;
  }

  return (
    <div className="insights-grid">
      <ChartCard title="By category" sub="Current month">
        {categories && categories.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
              >
                {categories.map((entry, i) => (
                  <Cell key={entry.name} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#9296a3" }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">No category data yet.</div>
        )}
      </ChartCard>

      <ChartCard title="Daily trend" sub="Current month">
        {daily && daily.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={daily}>
              <CartesianGrid stroke="#24262f" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#5b5e6b"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#5b5e6b" fontSize={12} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#7c6bf0"
                strokeWidth={2}
                dot={{ r: 3, fill: "#7c6bf0" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">No daily data yet.</div>
        )}
      </ChartCard>

      <ChartCard title="Monthly trend" sub="All recorded months" full>
        {monthly && monthly.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}>
              <CartesianGrid stroke="#24262f" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#5b5e6b"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#5b5e6b" fontSize={12} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="total" fill="#3fc6a8" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">No monthly data yet.</div>
        )}
      </ChartCard>
    </div>
  );
}
