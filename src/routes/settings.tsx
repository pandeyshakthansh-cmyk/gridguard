import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gg";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings | Grid Guard" }, { name: "description", content: "Settings module coming soon in Grid Guard." }, { property: "og:title", content: "Settings | Grid Guard" }, { property: "og:description", content: "Settings module coming soon in Grid Guard." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <ComingSoon title="Settings" />,
});
