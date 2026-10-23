import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, Search, X, Info } from "lucide-react";
import { Card, PageHeader, SeverityBadge, useMeters } from "@/components/gg";
import { safePct, type Meter, type Status } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

import { SHARE_IMAGE } from "@/lib/brand";
export const Route = createFileRoute("/theft")({
  head: () => ({ meta: [{ title: "Theft Detection | Grid Guard" }, { name: "description", content: "Review meters flagged for potential theft or suspicious activity." }, { property: "og:title", content: "Theft Detection | Grid Guard" }, { property: "og:description", content: "Flagged meters with confidence scores and actions." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { property: "og:image", content: SHARE_IMAGE }, { name: "twitter:image", content: SHARE_IMAGE }] }),
  component: Theft,
});

type Key = "id" | "location" | "expected" | "consumption" | "unaccounted" | "anomaly" | "severity" | "status";
const COLS: [Key, string][] = [["id", "Meter ID"], ["location", "Location"], ["expected", "Expected"], ["consumption", "Actual"], ["unaccounted", "Unaccounted"], ["anomaly", "Anomaly Type"], ["severity", "Severity"], ["status", "Status"]];
const SEV_RANK = { normal: 0, suspicious: 1, high: 2 };

function Theft() {
  const { meters, setStatus } = useMeters();
  const [q, setQ] = useState("");
  const [sev, setSev] = useState("all");
  const [sort, setSort] = useState<{ k: Key; asc: boolean }>({ k: "unaccounted", asc: false });
  const [openId, setOpenId] = useState<string | null>(null);
  const open = meters.find((m) => m.id === openId);

  const rows = useMemo(() => meters
    .filter((m) => (sev === "all" ? m.severity !== "normal" : sev === "every" ? true : m.severity === sev))
    .filter((m) => `${m.id} ${m.location} ${m.consumerId} ${m.feeder}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => {
      const va = sort.k === "severity" ? SEV_RANK[a.severity] : a[sort.k], vb = sort.k === "severity" ? SEV_RANK[b.severity] : b[sort.k];
      const c = typeof va === "number" ? va - (vb as number) : String(va).localeCompare(String(vb));
      return sort.asc ? c : -c;
    }), [meters, q, sev, sort]);

  return (
    <>
      <PageHeader title="Theft Detection" sub="Flags indicate potential theft or suspicious activity — not proof. Field inspection required." />
      <Card>
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search meter, location, consumer…" className="h-9 w-full rounded-lg border bg-muted pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
          <select value={sev} onChange={(e) => setSev(e.target.value)} className="h-9 rounded-lg border bg-card px-2 text-sm">
            <option value="all">All flagged</option><option value="high">Potential Theft</option><option value="suspicious">Suspicious Activity</option><option value="normal">Normal</option><option value="every">All meters</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead><tr className="text-left text-xs text-muted-foreground">{COLS.map(([k, l]) => (
              <th key={k} className="pb-2"><button onClick={() => setSort({ k, asc: sort.k === k ? !sort.asc : true })} className="flex items-center gap-1 hover:text-foreground">{l}<ArrowUpDown className="h-3 w-3" /></button></th>
            ))}</tr></thead>
            <tbody>{rows.map((m) => (
              <tr key={m.id} onClick={() => setOpenId(m.id)} className="cursor-pointer border-t hover:bg-muted">
                <td className="py-2.5 font-medium">{m.id}</td><td>{m.location}</td><td>{m.expected} kWh</td><td>{m.consumption} kWh</td><td className="font-semibold">{m.unaccounted} kWh</td><td>{m.anomaly}</td><td><SeverityBadge s={m.severity} /></td><td><StatusPill s={m.status} /></td>
              </tr>
            ))}</tbody>
          </table>
          {!rows.length && <p className="py-8 text-center text-sm text-muted-foreground">No meters match.</p>}
        </div>
      </Card>
      {open && <Drawer m={open} onClose={() => setOpenId(null)} setStatus={setStatus} />}
    </>
  );
}

export const StatusPill = ({ s }: { s: Status }) => (
  <span className={cn("whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium", s === "Resolved" || s === "Normal" ? "bg-success/15 text-success" : s === "Escalated" ? "bg-danger/15 text-danger" : s === "Under Review" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground")}>{s}</span>
);

function Drawer({ m, onClose, setStatus }: { m: Meter; onClose: () => void; setStatus: (id: string, s: Status) => void }) {
  const gap = safePct(m.unaccounted, m.expected);
  const action = m.severity === "high" ? "Schedule an on-site inspection within 48 hours and verify meter seals." : m.severity === "suspicious" ? "Monitor for 7 days and compare against transformer-level readings." : "No action needed.";
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between"><div><h2 className="text-lg font-bold">{m.id}</h2><p className="text-sm text-muted-foreground">{m.consumerId} · {m.location}</p></div><button onClick={onClose} className="rounded-md p-1 hover:bg-muted" aria-label="Close"><X className="h-5 w-5" /></button></div>
        <div className="mt-3 flex gap-2"><SeverityBadge s={m.severity} /><StatusPill s={m.status} /></div>
        <section className="mt-5"><h3 className="text-sm font-semibold">Why flagged</h3><p className="mt-1 text-sm text-muted-foreground">{m.severity === "normal" ? "Consumption matches expected load." : `${m.anomaly}. Recorded usage is ${gap.toFixed(1)}% below the expected load estimated from ${m.transformer} on ${m.feeder}.`}</p></section>
        <section className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {[["Previous reading", m.previous], ["Current reading", m.current], ["Consumption", `${m.consumption} kWh`], ["Expected", `${m.expected} kWh`], ["Unaccounted", `${m.unaccounted} kWh`], ["Transformer", m.transformer]].map(([k, v]) => <div key={k} className="rounded-lg bg-muted p-2.5"><div className="text-xs text-muted-foreground">{k}</div><div className="font-semibold">{v}</div></div>)}
        </section>
        <section className="mt-4"><div className="flex justify-between text-sm"><span className="font-semibold">Confidence score</span><span>{m.confidence}%</span></div><div className="mt-1.5 h-2 rounded-full bg-muted"><div className={cn("h-2 rounded-full", m.severity === "high" ? "bg-danger" : "bg-warning")} style={{ width: `${m.confidence}%` }} /></div></section>
        <section className="mt-4"><h3 className="text-sm font-semibold">Recommended action</h3><p className="mt-1 text-sm text-muted-foreground">{action}</p></section>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {(["Under Review", "Resolved", "Escalated"] as Status[]).map((s) => <button key={s} onClick={() => setStatus(m.id, s)} className={cn("rounded-lg border px-2 py-2 text-xs font-semibold transition-colors hover:bg-muted", m.status === s && "border-primary bg-primary text-primary-foreground hover:bg-primary")}>{s}</button>)}
        </div>
        <p className="mt-4 flex gap-2 rounded-lg bg-accent p-3 text-xs text-accent-foreground"><Info className="h-4 w-4 shrink-0" />This is an automated indication, not evidence of theft. Verify on site before any action.</p>
      </div>
    </div>
  );
}
