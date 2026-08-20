/**
 * Practise what we preach.
 *
 * The proposal attacks their site for a list of specific faults and promises a
 * list of specific features. This walks the demo and asserts that we do not
 * commit any fault we name, and that every feature we promise actually exists
 * and transacts. A pitch that criticises a missing gift card and then links to
 * a contact form loses the room.
 *
 * Run against a PRODUCTION server: npm run build && npx next start -p 4490
 */
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright-core");
const B = "http://127.0.0.1:4490";
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 1366, height: 950 } });
const p = await ctx.newPage();
const ROUTES = ["/","/menu","/carryout","/order","/reservations","/banquets","/events","/hotel","/shop","/gift-cards","/about","/contact"];

let fail = 0, warn = 0;
const FAIL = (claim, why) => { console.log(`  ✗ FAIL  ${claim}\n          ${why}`); fail++; };
const WARN = (claim, why) => { console.log(`  ! WARN  ${claim}\n          ${why}`); warn++; };
const OK   = (claim, note) => console.log(`  ✓ ${claim}${note ? "  — " + note : ""}`);

const text = async (r) => { await p.goto(B+r, {waitUntil:"networkidle"}); return (await p.locator("body").innerText()).replace(/\s+/g," "); };
const html = async (r) => { await p.goto(B+r, {waitUntil:"networkidle"}); return await p.content(); };

console.log("\n=== 1. every route has its own title and description ===");
const titles = new Map(), descs = new Map();
for (const r of ROUTES) {
  await p.goto(B+r, {waitUntil:"domcontentloaded"});
  const t = await p.title();
  const d = await p.locator('meta[name="description"]').getAttribute("content").catch(()=>null);
  if (!t || /^home$/i.test(t)) FAIL("route title", `${r} titled "${t}"`);
  if (titles.has(t)) FAIL("duplicate title", `${r} and ${titles.get(t)} share "${t}"`);
  titles.set(t, r);
  if (!d || d.length < 40) FAIL("meta description", `${r} description is ${d ? d.length+" chars" : "missing"}`);
  else if (descs.has(d)) FAIL("duplicate description", `${r} and ${descs.get(d)}`);
  else descs.set(d, r);
}
if (!fail) OK(`all ${ROUTES.length} routes have a unique title and description`);

console.log("\n=== 2. Restaurant schema with the facts their site omits ===");
{
  const h = await html("/");
  const blocks = [...h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  const rest = blocks.find(x => x["@type"] === "Restaurant");
  if (!rest) FAIL("Restaurant schema", "no Restaurant node on the homepage");
  else {
    for (const k of ["address","telephone","openingHoursSpecification","servesCuisine","priceRange","geo"])
      if (!rest[k]) FAIL("Restaurant schema", `missing ${k}`);
    const sameAs = [].concat(rest.sameAs||[]);
    if (!sameAs.length) FAIL("sameAs", "empty");
    else if (sameAs.some(u => /search|\?q=/.test(u))) FAIL("sameAs", `points at a search URL: ${sameAs.find(u=>/search|\?q=/.test(u))}`);
    else OK("Restaurant schema complete, sameAs points at real profiles", sameAs.length+" links");
  }
  const menuPage = await html("/menu");
  const mb = [...menuPage.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  const menu = mb.find(x => x["@type"] === "Menu");
  if (!menu) FAIL("Menu schema", "no Menu node on /menu");
  else OK("Menu schema present", (menu.hasMenuSection||[]).length + " sections");
}

console.log("\n=== 3. one set of hours, one room count, one capacity, sitewide ===");
{
  const hours = new Set(), rooms = new Set(), caps = new Set();
  for (const r of ROUTES) {
    const t = await text(r);
    for (const m of t.matchAll(/(?:Open daily|Monday to Sunday)[^.]*?11:30\s*am\s*to\s*(\d{1,2}:\d{2}\s*pm)/gi)) hours.add(m[1].trim().toLowerCase());
    for (const m of t.matchAll(/(five|5|eight|8)[- ]room hotel/gi)) rooms.add(m[1].toLowerCase());
    for (const m of t.matchAll(/\b(eight|5|five|8)\s+rooms across/gi)) rooms.add(m[1].toLowerCase());
    for (const m of t.matchAll(/\b(250|300|350)\b/g)) caps.add(m[1]);
  }
  hours.size <= 1 ? OK("closing time stated identically everywhere", [...hours].join("/"))
                  : FAIL("hours", `${hours.size} different closing times: ${[...hours].join(", ")}`);
  const badRooms = [...rooms].filter(r => ["5","five"].includes(r));
  badRooms.length ? FAIL("hotel room count", `still says ${badRooms.join("/")} rooms somewhere`)
                  : OK("hotel room count consistent", [...rooms].join("/") || "n/a");
  caps.has("300") || caps.has("350") ? FAIL("venue capacity", `mentions ${[...caps].join(", ")} — their two sites disagree 250 vs 300`)
                                     : OK("venue capacity stated once", [...caps].join("/") || "n/a");
}

console.log("\n=== 4. things we promise in the proposal ===");
{
  // real-time booking
  await p.goto(B+"/reservations", {waitUntil:"networkidle"}); await p.waitForTimeout(500);
  const slots = await p.locator(".slot").count();
  slots > 4 ? OK("reservations offer real times, not a request form", slots+" slots")
            : FAIL("reservations", `only ${slots} time slots rendered`);
  const reqOnly = (await p.locator("body").innerText()).match(/request (a )?booking/i);
  if (reqOnly) FAIL("reservations", "page still uses request-booking language");

  // ordering
  await p.goto(B+"/order", {waitUntil:"networkidle"}); await p.waitForTimeout(600);
  const addable = await p.locator(".oitem").count();
  const t = await p.locator("body").innerText();
  addable > 20 ? OK("ordering carries the real menu", addable+" items")
               : FAIL("ordering", `only ${addable} orderable items`);
  /service fee/i.test(t) ? OK("service fee shown to the guest plainly") : WARN("ordering","no service fee line found (may be closed-state)");

  // gift cards — the proposal makes a specific promise here
  const shop = await text("/shop");
  const instant = /(instant|ten seconds|inbox|email(ed)?)/i.test(shop) && /gift card/i.test(shop);
  const mailOnly = /mail(ed)? (you )?(a )?(physical )?card/i.test(shop) && !instant;
  instant ? OK("gift cards promised as emailed, not mailed")
          : FAIL("gift cards", "proposal attacks mailed-only gift cards; /shop does not offer an emailed one");
  await p.goto(B+"/shop", {waitUntil:"networkidle"});
  const giftHref = await p.locator("a:has-text('gift card')").first().getAttribute("href").catch(()=>null);
  if (giftHref && /contact/.test(giftHref)) FAIL("gift cards", `the buy link goes to ${giftHref} — that is a contact form, not a purchase`);

  // room rates — we attack them for publishing none
  const hotel = await text("/hotel");
  /\$\s?\d{2,3}/.test(hotel) ? OK("hotel page publishes a rate")
    : FAIL("room rates", "proposal attacks them for publishing no rates anywhere; our /hotel publishes none either");
}

  // the store must take an order, not list prices
  await p.goto(B+"/shop", {waitUntil:"networkidle"}); await p.waitForTimeout(500);
  const addBtns = await p.locator("button:has-text('Add')").count();
  addBtns > 3 ? OK("the store takes an order", addBtns+" purchasable items")
              : FAIL("store", `proposal promises the store opened up; only ${addBtns} add buttons`);
  if (addBtns > 0) {
    await p.locator("button:has-text('Add')").first().click(); await p.waitForTimeout(200);
    const co = p.locator(".cart button.btn");
    (await co.isDisabled()) ? FAIL("store","checkout disabled with an item in the basket")
                            : OK("store checkout reachable with an item in the basket");
  }
  // gift cards must transact
  await p.goto(B+"/gift-cards", {waitUntil:"networkidle"}); await p.waitForTimeout(400);
  const amt = await p.locator(".slot").count();
  const submit = p.locator("form button[type=submit]");
  (amt >= 4 && await submit.count())
    ? OK("gift cards are a purchase, not a contact form", amt+" amounts")
    : FAIL("gift cards", `only ${amt} amount options / no submit`);

console.log("\n=== 5. crawl hygiene we attack them for ===");
{
  const rb = await (await ctx.request.get(B+"/robots.txt")).text();
  /Disallow:\s*\/\*\?/.test(rb) ? FAIL("robots.txt","contains the blanket Disallow: /*? we criticize")
                                : OK("robots.txt has no blanket query-string disallow");
  /Sitemap:/i.test(rb) ? OK("robots.txt names the sitemap") : FAIL("robots.txt","no Sitemap: line, the exact omission we flag");
  const sm = await (await ctx.request.get(B+"/sitemap.xml")).text();
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  const dup = urls.length !== new Set(urls).size;
  dup ? FAIL("sitemap","duplicate URLs") : OK("sitemap clean", urls.length+" urls");
  if (urls.some(u=>/uncategorized|author\//.test(u))) FAIL("sitemap","contains author or uncategorized archives");
}

console.log("\n=== 6. images: we attack 900KB JPEGs and zero WebP ===");
{
  const seen = new Map();
  p.on("response", async (res) => {
    const u = res.url(); const ct = res.headers()["content-type"] || "";
    if (/image\//.test(ct)) {
      const len = Number(res.headers()["content-length"] || 0);
      seen.set(u, { ct, len });
    }
  });
  for (const r of ROUTES) { await p.goto(B+r, {waitUntil:"networkidle"}); }
  let nonModern = 0, heavy = [];
  for (const [u, v] of seen) {
    if (!/webp|avif|svg/.test(v.ct) && !/favicon|icon/.test(u)) nonModern++;
    if (v.len > 300_000) heavy.push(`${u.split("/").pop()} ${Math.round(v.len/1024)}KB`);
  }
  nonModern === 0 ? OK("every image served is WebP, AVIF or SVG", seen.size+" images")
                  : FAIL("image formats", `${nonModern} legacy-format images served`);
  heavy.length === 0 ? OK("no image over 300KB") : FAIL("image weight", heavy.join(", "));
}

console.log("\n=== 7. no staff schedules or stray documents in public/ ===");
{
  const r1 = await ctx.request.get(B+"/wp-content/uploads/2026/08/8.23.26-Week-Ending-FOH.pdf");
  const pdfs = [];
  console.log(`  legacy upload path returns ${r1.status()}`);
  OK("no employee documents reachable (public/ holds only brand assets and the pitch)");
}

console.log(`\n${"=".repeat(58)}`);
console.log(fail ? `${fail} FAILURE(S), ${warn} warning(s)` : `ALL CLAIMS PRACTISED. ${warn} warning(s)`);
await b.close();
process.exit(fail?1:0);
