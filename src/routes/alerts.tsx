import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gg";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts & Reports | Grid Guard" }, { name: "description", content: "Alerts & Reports module coming soon in Grid Guard." }, { property: "og:title", content: "Alerts & Reports | Grid Guard" }, { property: "og:description", content: "Alerts & Reports module coming soon in Grid Guard." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <ComingSoon title="Alerts & Reports" />,
});
