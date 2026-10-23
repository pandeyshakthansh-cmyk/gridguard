import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, X, Info } from "lucide-react";
import { Card, PageHeader, SeverityBadge, sevColor, useMeters } from "@/components/gg";
import { METERS, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/location")({
  head: () => ({ meta: [{ title: "Location Tracking | Grid Guard" }, { name: "description", content: "Schematic map of registered meters and infrastructure by severity." }, { property: "og:title", content: "Location Tracking | Grid Guard" }, { property: "og:description", content: "Registered meter locations by severity." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Location,
});

const W = 800, H = 500;
const lats = METERS.map((m) => m.lat), lngs = METERS.map((m) => m.lng);
const [la0, la1, ln0, ln1] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)];
const px = (lng: number) => 60 + ((lng - ln0) / (ln1 - ln0 || 1)) * (W - 120);
const py = (lat: number) => H - 50 - ((lat - la0) / (la1 - la0 || 1)) * (H - 100);

function Location() {
  const { meters } = useMeters();
  const [sev, setSev] = useState("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const m = meters.find((x) => x.id === sel);
  const visible = meters.filter((x) => (sev === "all" || x.severity === sev) && x.id.toLowerCase().includes(q.toLowerCase()));
  const trs = [...new Set(meters.map((x) => x.transformer))].map((t) => { const ms = meters.filter((x) => x.transformer === t); return { t, x: ms.reduce((a, x) => a + px(x.lng), 0) / ms.length, y: ms.reduce((a, x) => a + py(x.lat), 0) / ms.length }; });

  return (
    <>
      <PageHeader title="Location Tracking" sub="Schematic view of registered meter locations" />
      <div className="mb-3 flex flex-wrap gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search meter ID (e.g. MTR-1004)" className="h-9 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
        <select value={sev} onChange={(e) => setSev(e.target.value)} className="h-9 rounded-lg border bg-card px-2 text-sm"><option value="all">All severities</option><option value="high">Potential Theft</option><option value="suspicious">Suspicious</option><option value="normal">Normal</option></select>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-2 lg:col-span-2 md:p-2">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg bg-muted">
            {Array.from({ length: 9 }, (_, i) => <line key={"v" + i} x1={i * 100} y1={0} x2={i * 100} y2={H} stroke="var(--border)" />)}
            {Array.from({ length: 6 }, (_, i) => <line key={"h" + i} x1={0} y1={i * 100} x2={W} y2={i * 100} stroke="var(--border)" />)}
            <path d={`M0 ${H * 0.55} C200 ${H * 0.4} 500 ${H * 0.7} ${W} ${H * 0.45}`} stroke="var(--accent)" strokeWidth={14} fill="none" />
            {trs.map((t) => <g key={t.t}><rect x={t.x - 9} y={t.y - 9} width={18} height={18} rx={4} fill="var(--primary)" /><text x={t.x} y={t.y - 14} fontSize={11} textAnchor="middle" fill="var(--primary)" fontWeight={600}>{t.t}</text></g>)}
            {visible.map((x) => <circle key={x.id} cx={px(x.lng)} cy={py(x.lat)} r={sel === x.id ? 10 : 7} fill={sevColor(x.severity)} stroke="var(--card)" strokeWidth={2} className="cursor-pointer" onClick={() => setSel(x.id)}><title>{x.id}</title></circle>)}
          </svg>
          <div className="flex flex-wrap gap-4 p-2 text-xs">
            {[["var(--success)", "Normal"], ["var(--warning)", "Suspicious"], ["var(--danger)", "High alert"], ["var(--primary)", "Transformer"]].map(([c, l]) => <span key={l} className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: c }} />{l}</span>)}
          </div>
        </Card>
        <Card>
          {m ? (
            <>
              <div className="flex justify-between"><div><h2 className="font-bold">{m.id}</h2><p className="text-xs text-muted-foreground">{m.consumerId}</p></div><button onClick={() => setSel(null)} aria-label="Close"><X className="h-4 w-4" /></button></div>
              <div className="mt-2"><SeverityBadge s={m.severity} /></div>
              <dl className="mt-3 space-y-2 text-sm">
                {[["Location", m.location], ["Feeder / Transformer", `${m.feeder} / ${m.transformer}`], ["Coordinates", `${m.lat.toFixed(4)}, ${m.lng.toFixed(4)}`], ["Consumption", `${m.consumption} kWh`], ["Unaccounted", `${m.unaccounted} kWh`], ["Bill", inr(m.bill)], ["Status", m.status]].map(([k, v]) => <div key={k} className="flex justify-between gap-2 border-b pb-1.5"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}
              </dl>
            </>
          ) : <p className="text-sm text-muted-foreground">Click a marker to view meter details. Showing {visible.length} of {meters.length} meters.</p>}
          <p className="mt-4 flex gap-2 rounded-lg bg-accent p-3 text-xs text-accent-foreground"><Info className="h-4 w-4 shrink-0" />Shows registered meter locations only — not live tracking of people or devices.</p>
        </Card>
      </div>
    </>
  );
}
