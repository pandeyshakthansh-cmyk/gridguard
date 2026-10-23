import { createContext, useContext, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ShieldAlert, Network, MapPin, Receipt, Activity, BarChart3, Bell, Settings, Zap, Search, User, ChevronsLeft, Menu, Construction, TrendingUp, TrendingDown } from "lucide-react";
import { METERS, type Meter, type Severity, type Status } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

// Shared meter state (status updates live in React state only)
const Ctx = createContext<{ meters: Meter[]; setStatus: (id: string, s: Status) => void }>({ meters: METERS, setStatus: () => {} });
export const useMeters = () => useContext(Ctx);

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/theft", label: "Theft Detection", icon: ShieldAlert },
  { to: "/supply", label: "Supply Distribution", icon: Network },
  { to: "/location", label: "Location Tracking", icon: MapPin },
  { to: "/billing", label: "Billing", icon: Receipt },
  { to: "/live", label: "Live Monitoring", icon: Activity },
  { to: "/analytics", label: "Consumption Analytics", icon: BarChart3 },
  { to: "/alerts", label: "Alerts & Reports", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Logo({ small }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary">
        <ShieldAlert className="absolute h-6 w-6 text-primary-foreground/30" />
        <Zap className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
      </div>
      {!small && <div><div className="font-bold leading-tight text-primary-foreground">Grid Guard</div><div className="text-[10px] text-sidebar-foreground/70">Detect. Monitor. Protect.</div></div>}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [meters, setMeters] = useState(METERS);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = useRouterState({ select: (r) => r.location.pathname });
  const setStatus = (id: string, s: Status) => setMeters((ms) => ms.map((m) => (m.id === id ? { ...m, status: s } : m)));

  return (
    <Ctx.Provider value={{ meters, setStatus }}>
      <div className="flex min-h-screen w-full">
        {mobileOpen && <div className="fixed inset-0 z-30 bg-foreground/40 md:hidden" onClick={() => setMobileOpen(false)} />}
        <aside className={cn("fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar text-sidebar-foreground transition-all md:sticky md:top-0 md:h-screen", collapsed ? "md:w-16" : "md:w-60", mobileOpen ? "w-60 translate-x-0" : "w-60 -translate-x-full md:translate-x-0")}>
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-3.5">
            <Logo small={collapsed && !mobileOpen} />
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-2">
            {NAV.map((n) => {
              const active = path === n.to;
              return (
                <Link key={n.to} to={n.to} onClick={() => setMobileOpen(false)} title={n.label}
                  className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent", active && "bg-primary text-primary-foreground hover:bg-primary")}>
                  <n.icon className="h-4 w-4 shrink-0" />{(!collapsed || mobileOpen) && <span className="truncate">{n.label}</span>}
                </Link>
              );
            })}
          </nav>
          <button onClick={() => setCollapsed(!collapsed)} className="m-2 hidden items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-sidebar-accent md:flex">
            <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />{!collapsed && "Collapse"}
          </button>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b bg-card px-3 md:px-6">
            <button className="rounded-md p-2 hover:bg-muted md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search meters, feeders…" className="h-9 w-full rounded-lg border bg-muted pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <select className="hidden h-9 rounded-lg border bg-card px-2 text-sm sm:block"><option>Last 7 days</option><option>Last 30 days</option><option>This quarter</option></select>
            <span className="ml-auto hidden rounded-full bg-warning/15 px-2.5 py-1 text-xs font-semibold text-warning sm:inline">Demo Mode</span>
            <button className="relative rounded-full p-2 hover:bg-muted" aria-label="Notifications"><Bell className="h-5 w-5" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" /></button>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-foreground"><User className="h-4 w-4" /></div>
          </header>
          <main className="flex-1 p-3 md:p-6">{children}</main>
        </div>
      </div>
    </Ctx.Provider>
  );
}

export const Card = ({ className, children }: { className?: string; children: ReactNode }) => <div className={cn("rounded-xl border bg-card p-4 shadow-sm md:p-5", className)}>{children}</div>;

export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return <div className="mb-5 flex flex-wrap items-end justify-between gap-2"><div><h1 className="text-xl font-bold md:text-2xl">{title}</h1>{sub && <p className="text-sm text-muted-foreground">{sub}</p>}</div><span className="rounded-md border border-dashed px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Demo Data</span></div>;
}

export function Kpi({ label, value, trend, icon: Icon, goodUp = true }: { label: string; value: string; trend: number; icon: typeof Zap; goodUp?: boolean }) {
  const good = trend >= 0 === goodUp;
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between"><span className="text-xs font-medium text-muted-foreground">{label}</span><div className="rounded-lg bg-accent p-1.5 text-accent-foreground"><Icon className="h-4 w-4" /></div></div>
      <div className="mt-2 text-xl font-bold md:text-2xl">{value}</div>
      <div className={cn("mt-1 flex items-center gap-1 text-xs font-medium", good ? "text-success" : "text-danger")}>{trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{Math.abs(trend).toFixed(1)}% vs last period</div>
    </Card>
  );
}

const SEV: Record<Severity, { label: string; cls: string }> = {
  normal: { label: "Normal", cls: "bg-success/15 text-success" },
  suspicious: { label: "Suspicious Activity", cls: "bg-warning/15 text-warning" },
  high: { label: "Potential Theft", cls: "bg-danger/15 text-danger" },
};
export const SeverityBadge = ({ s }: { s: Severity }) => <span className={cn("whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold", SEV[s].cls)}>{SEV[s].label}</span>;
export const sevColor = (s: Severity) => (s === "high" ? "var(--danger)" : s === "suspicious" ? "var(--warning)" : "var(--success)");

export function ComingSoon({ title }: { title: string }) {
  return <Card className="mx-auto mt-10 max-w-md text-center"><Construction className="mx-auto h-10 w-10 text-primary" /><h1 className="mt-3 text-xl font-bold">{title}</h1><p className="mt-1 text-sm text-muted-foreground">Coming soon. This module isn't part of the demo yet.</p></Card>;
}
