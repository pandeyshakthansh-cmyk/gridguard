import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gg";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Consumption Analytics | Grid Guard" }, { name: "description", content: "Consumption Analytics module coming soon in Grid Guard." }, { property: "og:title", content: "Consumption Analytics | Grid Guard" }, { property: "og:description", content: "Consumption Analytics module coming soon in Grid Guard." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <ComingSoon title="Consumption Analytics" />,
});
