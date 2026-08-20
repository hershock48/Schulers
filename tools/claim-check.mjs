/**
 * The third pass. tools/practice-check.mjs tests claims someone remembered;
 * this one tests the ones the DOCUMENT makes, including the sub-promises buried
 * inside a build item that a hand-written list misses. It is how the host-stand
 * screen and the banquet enquiry fields were found missing.
 *
 * Run against a PRODUCTION server: npm run build && npx next start -p 4490
 */
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright-core");
const B = "http://127.0.0.1:4490";
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 1366, height: 950 } });
const p = await ctx.newPage();
let fail = 0;
const OK = (m) => console.log("  ✓ " + m);
const NO = (m) => { console.log("  ✗ " + m); fail++; };

const ROUTES = ["/","/menu","/carryout","/order","/reservations","/banquets","/events","/hotel","/shop","/gift-cards","/host","/about","/contact"];

console.log("\n=== every route's og:image actually resolves ===");
for (const r of ROUTES) {
  await p.goto(B+r, {waitUntil:"domcontentloaded"});
  const og = await p.locator('meta[property="og:image"]').getAttribute("content").catch(()=>null);
  if (!og) { NO(`${r} has no og:image`); continue; }
  const u = og.startsWith("http") ? og.replace(/^https?:\/\/[^/]+/, B) : B+og;
  const res = await ctx.request.get(u);
  res.ok() ? null : NO(`${r} og:image ${res.status()} ${og}`);
}
if (!fail) OK(`all ${ROUTES.length} og:images resolve`);

console.log("\n=== host stand screen ===");
await p.goto(B+"/host", {waitUntil:"networkidle"}); await p.waitForTimeout(400);
const covers = await p.locator(".hostbig").innerText().catch(()=>null);
const rows = await p.locator(".hostlist li").count();
const slots = await p.locator(".hostslot").count();
(rows > 5 && slots > 4) ? OK(`tonight's book renders — ${covers}, ${rows} bookings across ${slots} times`)
                        : NO(`host screen thin: ${rows} rows, ${slots} slots`);
await p.fill("#cap", "4"); await p.waitForTimeout(250);
const fullMarks = await p.locator(".hostslot-head.full").count();
fullMarks > 0 ? OK(`cover ceiling closes slots — ${fullMarks} marked full at 4 covers`)
              : NO("lowering the ceiling did not mark any slot full");

console.log("\n=== banquet enquiry carries type, date and guest count ===");
await p.goto(B+"/banquets", {waitUntil:"networkidle"});
const hasType = await p.locator("#bq-type").count();
const hasDate = await p.locator("#bq-date").count();
const hasGuests = await p.locator("#bq-guests").count();
(hasType && hasDate && hasGuests) ? OK("event type, date and guest count all present")
                                  : NO(`missing fields: type=${hasType} date=${hasDate} guests=${hasGuests}`);
await p.fill("#bq-guests", "40"); await p.waitForTimeout(250);
const fitTxt = await p.locator("form .notice").first().innerText().catch(()=>"");
/Rooms that fit 40/.test(fitTxt) ? OK("guest count picks the rooms that fit: " + fitTxt.slice(0,80))
                                 : NO("guest count did not narrow the rooms");
await p.fill("#bq-guests", "260"); await p.waitForTimeout(250);
const big = await p.locator("form .notice.warn").first().innerText().catch(()=>"");
/19 Zero 9/.test(big) ? OK("oversize party routed to 19 Zero 9") : NO("oversize party not routed");

await b.close();
console.log(fail ? `\n${fail} FAILURE(S)` : "\nall good");
process.exit(fail?1:0);
