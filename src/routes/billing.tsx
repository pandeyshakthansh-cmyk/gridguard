import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, PageHeader } from "@/components/gg";
import { NETWORK, TARIFF, calcBill, inr, num, totals } from "@/lib/demo-data";

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "Billing | Grid Guard" }, { name: "description", content: "Billing summary and live electricity bill calculator." }, { property: "og:title", content: "Billing | Grid Guard" }, { property: "og:description", content: "Revenue, collections and bill calculator." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Billing,
});

function Billing() {
  const t = totals();
  const collected = t.revenue * NETWORK.collectionRate;
  const cards = [["Units Billed", `${num(t.consumed)} kWh`], ["Revenue", inr(t.revenue)], ["Collected", inr(collected)], ["Outstanding", inr(t.revenue - collected)], ["Value of Unaccounted Energy", inr(t.unaccounted * TARIFF)]];
  const [f, setF] = useState({ previous: 4520, current: 4810, tariff: TARIFF, fixed: 207, extra: 0, tax: 5 });
  const units = f.current - f.previous;
  const energy = Math.max(0, units) * f.tariff;
  const sub = calcBill(units, f.tariff, f.fixed + f.extra);
  const tax = (sub * f.tax) / 100;
  const fields: [keyof typeof f, string][] = [["previous", "Previous reading (kWh)"], ["current", "Current reading (kWh)"], ["tariff", "Tariff (₹/kWh)"], ["fixed", "Fixed charges (₹)"], ["extra", "Extra charges (₹)"], ["tax", "Tax (%)"]];
  return (
    <>
      <PageHeader title="Billing" sub="Revenue summary and bill calculator" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {cards.map(([k, v]) => <Card key={k} className="p-4"><div className="text-xs text-muted-foreground">{k}</div><div className="mt-1 text-lg font-bold md:text-xl">{v}</div></Card>)}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold">Bill Calculator</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map(([k, l]) => <label key={k} className="text-sm"><span className="text-muted-foreground">{l}</span><input type="number" value={f[k]} onChange={(e) => setF({ ...f, [k]: Number(e.target.value) || 0 })} className="mt-1 h-9 w-full rounded-lg border bg-muted px-3 outline-none focus:ring-2 focus:ring-ring" /></label>)}
          </div>
          {units < 0 && <p className="mt-2 text-xs text-danger">Current reading is lower than previous — units treated as 0.</p>}
        </Card>
        <Card className="bg-sidebar text-sidebar-foreground">
          <h2 className="mb-3 font-semibold text-primary-foreground">Bill Breakdown</h2>
          {[["Units consumed", `${num(Math.max(0, units))} kWh`], ["Energy charge", inr(energy)], ["Fixed charges", inr(f.fixed)], ["Extra charges", inr(f.extra)], ["Subtotal", inr(sub)], [`Tax (${f.tax}%)`, inr(tax)]].map(([k, v]) => <div key={k} className="flex justify-between border-b border-sidebar-border py-2 text-sm"><span>{k}</span><span className="font-medium text-primary-foreground">{v}</span></div>)}
          <div className="mt-3 flex items-end justify-between"><span>Total payable</span><span className="text-3xl font-bold text-primary-foreground">{inr(sub + tax)}</span></div>
        </Card>
      </div>
    </>
  );
}
