import shareAsset from "@/assets/og.jpg.asset.json";

/** Canonical origin used to turn the CDN-relative share photo into a full URL. */
const SITE_ORIGIN = "https://iloveshriyasboobies.lovable.app";

/** Absolute URL of the photo shown when someone shares a link. */
export const SHARE_IMAGE = `${SITE_ORIGIN}${shareAsset.url}`;
