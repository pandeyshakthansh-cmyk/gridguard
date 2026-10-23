// DEMO DATA — all values are hardcoded samples. Every KPI, chart, table and marker derives from here.
export type Severity = "normal" | "suspicious" | "high";
export type Status = "Normal" | "Open" | "Under Review" | "Resolved" | "Escalated";

export interface Meter {
  id: string; consumerId: string; feeder: string; transformer: string; location: string;
  lat: number; lng: number; previous: number; current: number; consumption: number;
  expected: number; unaccounted: number; tariff: number; fixedCharge: number; bill: number;
  severity: Severity; status: Status; anomaly: string; confidence: number;
}

export const NETWORK = { activeConnections: 1248, prevSupplied: 12210, prevConsumed: 10580, prevUnaccounted: 1630, prevSuspicious: 15, prevRevenue: 124100, prevConnections: 1231, collectionRate: 0.86 };
export const TARIFF = 11; // ₹ per kWh
export const FIXED = 207; // ₹ fixed charge per meter

export const safePct = (num: number, den: number) => (den ? (num / den) * 100 : 0);
export const calcBill = (units: number, tariff: number, charges: number) => Math.max(0, units) * tariff + charges;
export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const num = (n: number) => Math.round(n).toLocaleString("en-IN");

const FEEDERS = ["Feeder A", "Feeder B", "Feeder C", "Feeder D"];
const AREAS = ["Gomti Nagar", "Aliganj", "Hazratganj", "Indira Nagar", "Alambagh", "Chinhat", "Mahanagar", "Aminabad"];
const HIGH = [3, 8, 14, 21, 27, 33];
const SUSP = [1, 5, 7, 11, 12, 16, 19, 24, 29, 31, 36, 38];
const ANOMALIES = ["Meter bypass pattern", "Sudden consumption drop", "Reverse reading", "Zero consumption, load present", "Tamper signal", "Night-time spike mismatch"];

const raw = Array.from({ length: 40 }, (_, i) => 233 + ((i * 37) % 81));
raw[39] = 10920 - raw.slice(0, 39).reduce((a, b) => a! + b!, 0)!;

export const METERS: Meter[] = raw.map((consumption, i) => {
  const severity: Severity = HIGH.includes(i) ? "high" : SUSP.includes(i) ? "suspicious" : "normal";
  const unaccounted = severity === "high" ? 160 : severity === "suspicious" ? 80 : 0;
  const t = Math.floor(i / 5); // 8 transformers, 2 per feeder
  const previous = 4000 + i * 213;
  return {
    id: `MTR-${String(1001 + i)}`, consumerId: `CON-${String(52000 + i * 7)}`,
    feeder: FEEDERS[Math.floor(t / 2)]!, transformer: `TR-${t + 1}`, location: AREAS[t]!,
    lat: 26.80 + (t % 4) * 0.035 + ((i * 13) % 10) * 0.003, lng: 80.90 + Math.floor(t / 4) * 0.06 + (t % 2) * 0.025 + ((i * 7) % 10) * 0.002,
    previous, current: previous + consumption, consumption, expected: consumption + unaccounted, unaccounted,
    tariff: TARIFF, fixedCharge: FIXED, bill: calcBill(consumption, TARIFF, FIXED), severity,
    status: severity === "normal" ? "Normal" : "Open",
    anomaly: severity === "normal" ? "—" : ANOMALIES[i % ANOMALIES.length]!,
    confidence: severity === "high" ? 82 + (i % 12) : severity === "suspicious" ? 58 + (i % 15) : 0,
  };
});

export function feederStats(meters = METERS) {
  return FEEDERS.map((name) => {
    const ms = meters.filter((m) => m.feeder === name);
    const consumed = ms.reduce((a, m) => a + m.consumption, 0);
    const supplied = ms.reduce((a, m) => a + m.expected, 0);
    const transformers = [...new Set(ms.map((m) => m.transformer))];
    return { name, supplied, consumed, unaccounted: supplied - consumed, pct: safePct(supplied - consumed, supplied), meters: ms.length, transformers };
  });
}

export function totals(meters = METERS) {
  const supplied = meters.reduce((a, m) => a + m.expected, 0);
  const consumed = meters.reduce((a, m) => a + m.consumption, 0);
  const revenue = meters.reduce((a, m) => a + m.bill, 0);
  return { supplied, consumed, unaccounted: supplied - consumed, unaccountedPct: safePct(supplied - consumed, supplied), suspicious: meters.filter((m) => m.severity !== "normal").length, revenue, connections: NETWORK.activeConnections };
}

const DAY_SHARE = [0.13, 0.14, 0.15, 0.14, 0.15, 0.13, 0.16];
export function dailySeries() {
  const t = totals();
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({ day, supplied: Math.round(t.supplied * DAY_SHARE[i]!), consumed: Math.round(t.consumed * DAY_SHARE[i]!) }));
}
