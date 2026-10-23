import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gg";

import { SHARE_IMAGE } from "@/lib/brand";
export const Route = createFileRoute("/live")({
  head: () => ({ meta: [{ title: "Live Monitoring | Grid Guard" }, { name: "description", content: "Live Monitoring module coming soon in Grid Guard." }, { property: "og:title", content: "Live Monitoring | Grid Guard" }, { property: "og:description", content: "Live Monitoring module coming soon in Grid Guard." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { property: "og:image", content: SHARE_IMAGE }, { name: "twitter:image", content: SHARE_IMAGE }] }),
  component: () => <ComingSoon title="Live Monitoring" />,
});
