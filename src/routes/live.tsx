import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gg";

export const Route = createFileRoute("/live")({
  head: () => ({ meta: [{ title: "Live Monitoring | Grid Guard" }, { name: "description", content: "Live Monitoring module coming soon in Grid Guard." }, { property: "og:title", content: "Live Monitoring | Grid Guard" }, { property: "og:description", content: "Live Monitoring module coming soon in Grid Guard." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <ComingSoon title="Live Monitoring" />,
});
