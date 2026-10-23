import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gg";

import { SHARE_IMAGE } from "@/lib/brand";
export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings | Grid Guard" }, { name: "description", content: "Settings module coming soon in Grid Guard." }, { property: "og:title", content: "Settings | Grid Guard" }, { property: "og:description", content: "Settings module coming soon in Grid Guard." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { property: "og:image", content: SHARE_IMAGE }, { name: "twitter:image", content: SHARE_IMAGE }] }),
  component: () => <ComingSoon title="Settings" />,
});
