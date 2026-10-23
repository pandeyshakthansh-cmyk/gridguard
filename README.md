grudgaurd

Build "Grid Guard" – a frontend-only electricity theft detection dashboard mockup (React + Tailwind + Recharts + Lucide icons). No backend, no APIs, no auth. All data is hardcoded sample data in one shared file, clearly labeled "Demo Data".

Design: Dark navy sidebar (collapsible), light-grey background, white rounded cards, electric-blue accents. Green = normal, amber = suspicious, red = high alert. Inter font, small shield/bolt logo, tagline "Detect. Monitor. Protect." Responsive.

Shared data: ~40 sample meters (ID, consumer ID, feeder, transformer, coordinates, previous/current reading, consumption, tariff, bill, severity, status). Every KPI, chart, table, and map marker must derive from this one dataset. Formulas: Consumption = current − previous; Unaccounted = supplied − accounted; Unaccounted % = unaccounted ÷ supplied × 100; Bill = units × tariff + charges. Guard against divide-by-zero.

Top bar: search, date range dropdown, notifications icon, "Demo Mode" badge, profile icon.

Pages (sidebar navigation must work):

Overview: 6 KPI cards (Supplied 12,840 kWh, Consumed 10,920 kWh, Unaccounted 1,920 kWh, Suspicious Meters 18, Revenue ₹1,28,400, Active Connections 1,248) with trend %. Below: consumption line chart, severity pie chart, recent alerts list, top-discrepancy meters table.

Theft Detection: Searchable, sortable table (Meter ID, Location, Expected, Actual, Unaccounted, Anomaly Type, Severity, Status). Severity filter. Row click opens a detail drawer (why flagged, readings, confidence score, recommended action). Buttons: Under Review / Resolved / Escalated that update instantly. Label as "Potential Theft" / "Suspicious Activity", never as proof.

Supply Distribution: Simple flow diagram Grid → Substation → Feeders → Transformers → Meters, with losses shown. Clicking a feeder shows its energy supplied, consumed, and discrepancy. Add a small energy-balance panel. Note that unaccounted ≠ theft.

Location Tracking: Schematic map-style view (SVG, no map API) with colored clickable markers (green/amber/red/blue for infrastructure). Marker click opens a side panel with meter details. Filter by severity and search by meter ID. Note: shows registered meter locations only.

Billing: Summary cards (units billed, revenue, collected, outstanding, value of unaccounted energy) plus an interactive bill calculator (previous reading, current reading, tariff, fixed charges, extra charges, tax %) that recalculates live in ₹ format.

Skip entirely (show "Coming soon" placeholder page only): Live Monitoring, Consumption Analytics, Alerts & Reports, Settings.

Rules: Single-page app, no localStorage, no CSV export, no login. Keep code compact and clean. Status changes only need to work in React state.


- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
