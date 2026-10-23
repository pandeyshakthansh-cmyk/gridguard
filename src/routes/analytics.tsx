import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gg";

import { SHARE_IMAGE } from "@/lib/brand";
export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Consumption Analytics | Grid Guard" }, { name: "description", content: "Consumption Analytics module coming soon in Grid Guard." }, { property: "og:title", content: "Consumption Analytics | Grid Guard" }, { property: "og:description", content: "Consumption Analytics module coming soon in Grid Guard." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { property: "og:image", content: SHARE_IMAGE }, { name: "twitter:image", content: SHARE_IMAGE }] }),
  component: () => <ComingSoon title="Consumption Analytics" />,
});
