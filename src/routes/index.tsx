import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Gauge, AlertTriangle, ShieldAlert, IndianRupee, Plug } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { Card, Kpi, PageHeader, SeverityBadge, sevColor, useMeters } from "@/components/gg";
import { NETWORK, dailySeries, inr, num, safePct, totals } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Overview | Grid Guard" }, { name: "description", content: "Grid Guard overview: supply, consumption, unaccounted energy and suspicious meters." }, { property: "og:title", content: "Overview | Grid Guard" }, { property: "og:description", content: "Electricity theft detection dashboard overview." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Overview,
});

const tr = (now: number, prev: number) => safePct(now - prev, prev);

function Overview() {
  const { meters } = useMeters();
  const t = totals(meters);
  const flagged = meters.filter((m) => m.severity !== "normal");
  const pie = (["normal", "suspicious", "high"] as const).map((s) => ({ name: s === "high" ? "High alert" : s[0].toUpperCase() + s.slice(1), value: meters.filter((m) => m.severity === s).length, s }));
  const top = [...flagged].sort((a, b) => b.unaccounted - a.unaccounted || b.confidence - a.confidence).slice(0, 6);
  return (
    <>
      <PageHeader title="Overview" sub="Network-wide energy balance for the selected period" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Energy Supplied" value={`${num(t.supplied)} kWh`} trend={tr(t.supplied, NETWORK.prevSupplied)} icon={Zap} />
        <Kpi label="Energy Consumed" value={`${num(t.consumed)} kWh`} trend={tr(t.consumed, NETWORK.prevConsumed)} icon={Gauge} />
        <Kpi label="Unaccounted" value={`${num(t.unaccounted)} kWh`} trend={tr(t.unaccounted, NETWORK.prevUnaccounted)} icon={AlertTriangle} goodUp={false} />
        <Kpi label="Suspicious Meters" value={String(t.suspicious)} trend={tr(t.suspicious, NETWORK.prevSuspicious)} icon={ShieldAlert} goodUp={false} />
        <Kpi label="Revenue" value={inr(t.revenue)} trend={tr(t.revenue, NETWORK.prevRevenue)} icon={IndianRupee} />
        <Kpi label="Active Connections" value={num(t.connections)} trend={tr(t.connections, NETWORK.prevConnections)} icon={Plug} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-3 font-semibold">Supplied vs Consumed (kWh)</h2>
          <div className="h-64"><ResponsiveContainer><LineChart data={dailySeries()}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="day" fontSize={12} /><YAxis fontSize={12} width={40} /><Tooltip /><Legend /><Line dataKey="supplied" stroke="var(--primary)" strokeWidth={2} /><Line dataKey="consumed" stroke="var(--success)" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold">Meters by Severity</h2>
          <div className="h-64"><ResponsiveContainer><PieChart><Pie data={pie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>{pie.map((p) => <Cell key={p.s} fill={sevColor(p.s)} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="mb-3 font-semibold">Recent Alerts</h2>
          <ul className="space-y-3">{flagged.slice(0, 6).map((m) => (
            <li key={m.id} className="flex items-start gap-3 text-sm"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: sevColor(m.severity) }} /><div className="min-w-0"><div className="font-medium">{m.id} · {m.location}</div><div className="text-xs text-muted-foreground">{m.anomaly} · {m.status}</div></div></li>
          ))}</ul>
        </Card>
        <Card className="overflow-x-auto lg:col-span-2">
          <div className="mb-3 flex justify-between"><h2 className="font-semibold">Top Discrepancy Meters</h2><Link to="/theft" className="text-sm font-medium text-primary">View all</Link></div>
          <table className="w-full min-w-[480px] text-sm"><thead className="text-left text-xs text-muted-foreground"><tr><th className="pb-2">Meter</th><th>Feeder</th><th>Expected</th><th>Actual</th><th>Unaccounted</th><th>Severity</th></tr></thead>
            <tbody>{top.map((m) => <tr key={m.id} className="border-t"><td className="py-2 font-medium">{m.id}</td><td>{m.feeder}</td><td>{m.expected}</td><td>{m.consumption}</td><td className="font-semibold">{m.unaccounted} kWh</td><td><SeverityBadge s={m.severity} /></td></tr>)}</tbody></table>
        </Card>
      </div>
    </>
  );
}
