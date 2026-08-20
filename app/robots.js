import { SITE_URL } from "@/lib/site";

/**
 * Crawling is allowed on purpose, and the pitch host is kept out of the index
 * with a noindex HEADER instead (see next.config.mjs). They are different
 * switches: robots.txt governs fetching, and a crawler told not to fetch can
 * never see a noindex, so a URL discovered from a link elsewhere still gets
 * listed, with no title and no snippet.
 *
 * Their live robots.txt carries `Disallow: /*?`, which blocks every URL with a
 * query string sitewide, and no Sitemap line at all despite having a sitemap.
 */
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
