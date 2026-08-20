import { SITE_URL } from "@/lib/site";

const routes = ["", "/menu", "/carryout", "/order", "/reservations", "/banquets", "/events", "/hotel", "/shop", "/gift-cards", "/about", "/contact"];

export default function sitemap() {
  return routes.map((r) => ({
    url: `${SITE_URL}${r}`,
    changeFrequency: r === "/events" || r === "/order" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
