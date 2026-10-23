import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Factory, Building2, Cable, Box, Gauge, ChevronRight, Info } from "lucide-react";
import { Card, PageHeader } from "@/components/gg";
import { feederStats, num, totals } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/supply")({
  head: () => ({ meta: [{ title: "Supply Distribution | Grid Guard" }, { name: "description", content: "Energy flow from grid to meters with losses per feeder." }, { property: "og:title", content: "Supply Distribution | Grid Guard" }, { property: "og:description", content: "Grid to meter energy flow and balance." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Supply,
});

function Supply() {
  const feeders = feederStats();
  const t = totals();
  const [sel, setSel] = useState(feeders[0]!.name);
  const f = feeders.find((x) => x.name === sel)!;
  const stages = [
    { icon: Factory, label: "Grid", value: `${num(t.supplied)} kWh` },
    { icon: Building2, label: "Substation", value: "SS-Lucknow East" },
    { icon: Cable, label: "Feeders", value: `${feeders.length} feeders` },
    { icon: Box, label: "Transformers", value: `${feeders.reduce((a, x) => a + x.transformers.length, 0)} units` },
    { icon: Gauge, label: "Meters", value: `${num(t.consumed)} kWh billed` },
  ];
  return (
    <>
      <PageHeader title="Supply Distribution" sub="How energy flows from the grid to consumer meters" />
      <Card>
        <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
          {stages.map((s, i) => (
            <div key={s.label} className="flex flex-1 flex-col items-center gap-2 md:flex-row">
              <div className="w-full flex-1 rounded-xl border bg-muted p-3 text-center"><s.icon className="mx-auto h-6 w-6 text-primary" /><div className="mt-1 text-sm font-semibold">{s.label}</div><div className="text-xs text-muted-foreground">{s.value}</div></div>
              {i < stages.length - 1 && <ChevronRight className="h-5 w-5 rotate-90 text-muted-foreground md:rotate-0" />}
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-sm">Total loss between grid and meters: <b className="text-danger">{num(t.unaccounted)} kWh ({t.unaccountedPct.toFixed(1)}%)</b></p>
      </Card>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-3 font-semibold">Feeders — click to inspect</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {feeders.map((x) => (
              <button key={x.name} onClick={() => setSel(x.name)} className={cn("rounded-xl border p-4 text-left transition-colors hover:bg-muted", sel === x.name && "border-primary ring-2 ring-primary/30")}>
                <div className="flex justify-between"><span className="font-semibold">{x.name}</span><span className={cn("text-sm font-semibold", x.pct > 15 ? "text-danger" : x.pct > 8 ? "text-warning" : "text-success")}>{x.pct.toFixed(1)}% loss</span></div>
                <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${100 - x.pct}%` }} /></div>
                <div className="mt-2 text-xs text-muted-foreground">{x.transformers.join(", ")} · {x.meters} meters</div>
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-accent p-4 text-center text-accent-foreground">
            <div><div className="text-xs">Supplied</div><div className="text-lg font-bold">{num(f.supplied)} kWh</div></div>
            <div><div className="text-xs">Consumed</div><div className="text-lg font-bold">{num(f.consumed)} kWh</div></div>
            <div><div className="text-xs">Discrepancy</div><div className="text-lg font-bold">{num(f.unaccounted)} kWh</div></div>
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold">Energy Balance</h2>
          {[["Energy supplied", t.supplied], ["Energy accounted (billed)", t.consumed], ["Unaccounted", t.unaccounted]].map(([k, v]) => <div key={k as string} className="flex justify-between border-b py-2.5 text-sm last:border-0"><span>{k}</span><b>{num(v as number)} kWh</b></div>)}
          <div className="flex justify-between py-2.5 text-sm"><span>Unaccounted %</span><b className="text-danger">{t.unaccountedPct.toFixed(2)}%</b></div>
          <p className="mt-3 flex gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground"><Info className="h-4 w-4 shrink-0" />Unaccounted energy is not the same as theft. It also includes technical line losses, metering errors and billing gaps.</p>
        </Card>
      </div>
    </>
  );
}
