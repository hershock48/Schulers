/**
 * Behaviour checks for the Schuler's build. Run against a PRODUCTION server:
 *   npm run build && npx next start -p 4490
 *   node tools/flow-checks.mjs
 *
 * playwright-core is resolved by path and taken off the DEFAULT export: the
 * package is CommonJS, so `import { chromium } from "playwright-core"` fails
 * with "Named export 'chromium' not found" even when the package is installed.
 */
import { createRequire } from "node:module";
const require_ = createRequire(import.meta.url);
const pkg = require_("playwright-core");
const { chromium } = pkg;
const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const B = "http://127.0.0.1:4490";
const ROUTES = ["/","/menu","/carryout","/order","/reservations","/banquets","/events","/hotel","/shop","/about","/contact"];
const b = await chromium.launch({ executablePath: EXE });
let fail = 0;
const bad = (m) => { console.log("  FAIL " + m); fail++; };

// --- 1. overflow at every width that matters
for (const w of [320, 360, 390, 768, 1024, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  for (const r of ROUTES) {
    await p.goto(B + r, { waitUntil: "networkidle" });
    await p.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
    await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,15));} });
    const o = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (o > 0) bad(`overflow ${o}px at ${w}px on ${r}`);
  }
  await p.close();
  console.log(`overflow @${w}px: checked ${ROUTES.length} routes`);
}

// --- 2. client-side navigation must not leave a blank page (reveal re-arm)
{
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(B + "/", { waitUntil: "networkidle" });
  for (const [link, expect] of [["Menu","The Menu"],["Banquets","Room for the whole party"],["About","Since 1909"],["Shop","The Shop"]]) {
    await p.click(`.hdr-nav a:has-text("${link}")`);
    await p.waitForLoadState("networkidle");
    await p.waitForTimeout(500);
    const h1 = p.locator("h1").first();
    const vis = await h1.isVisible();
    const op = await h1.evaluate(el => getComputedStyle(el).opacity);
    const txt = (await h1.textContent() || "").trim();
    if (!vis || Number(op) < 0.9) bad(`nav to ${link}: h1 not visible (opacity ${op})`);
    else console.log(`nav ${link}: h1 "${txt}" visible, opacity ${op}`);
    // every reveal element on the landed page must actually be visible
    const hidden = await p.evaluate(() => Array.from(document.querySelectorAll(".reveal")).filter(e => Number(getComputedStyle(e).opacity) < 0.9).length);
    if (hidden) bad(`nav to ${link}: ${hidden} .reveal elements still hidden`);
    await p.goto(B + "/", { waitUntil: "networkidle" });
  }
  await p.close();
}

// --- 3. the ordering flow
{
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  await p.goto(B + "/order", { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  const place = p.locator(".cart button.btn");
  if (!(await place.isDisabled())) bad("order: place button enabled with an empty cart");
  await p.locator(".oitem button:has-text('Add')").first().click();
  await p.waitForTimeout(150);
  const t1 = (await p.locator(".cart-totals .total .num").textContent()) || "";
  if (!/\$\d/.test(t1)) bad("order: no total after adding an item, got " + t1);
  if (!(await place.isDisabled())) bad("order: place enabled before a pickup time is chosen");
  const opts = await p.locator("#pickup-select option:not([disabled])").all();
  if (opts.length < 2) bad("order: no selectable pickup times");
  await p.selectOption("#pickup-select", await opts[1].getAttribute("value"));
  await p.waitForTimeout(120);
  if (await place.isDisabled()) bad("order: place still disabled with item + time");
  // fee must appear once and be labeled plainly
  const feeRows = await p.locator(".cart-totals div:has-text('Service fee')").count();
  if (feeRows !== 1) bad(`order: expected 1 service fee row, found ${feeRows}`);
  await place.click();
  await p.waitForTimeout(400);
  const confirm = (await p.locator("section .wrap h2").first().textContent()) || "";
  if (!/order would go in/i.test(confirm)) bad("order: confirmation screen wrong, got " + confirm);
  else console.log("order flow: add -> time -> place -> honest confirmation OK");
  await p.close();
}

// --- 4. reservations flow
{
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  await p.goto(B + "/reservations", { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  const submit = p.locator("form button[type=submit]");
  if (!(await submit.isDisabled())) bad("reservations: submit enabled before a time is picked");
  await p.locator(".slot:not([disabled])").first().click();
  await p.fill("#res-name", "Test Guest");
  await p.fill("#res-phone", "2695550101");
  await p.fill("#res-email", "test@example.com");
  if (await submit.isDisabled()) bad("reservations: submit still disabled after picking a time");
  await submit.click();
  await p.waitForTimeout(400);
  const msg = (await p.locator(".notice[role=status]").textContent()) || "";
  if (!/nothing was reserved/i.test(msg)) bad("reservations: confirmation does not disclose demo state");
  else console.log("reservations flow: pick -> fill -> submit -> honest confirmation OK");
  await p.close();
}

// --- 5. no-JS: page must be complete, not blank
{
  const ctx = await b.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  for (const r of ["/", "/menu", "/banquets"]) {
    await p.goto(B + r, { waitUntil: "domcontentloaded" });
    const hidden = await p.evaluate(() => Array.from(document.querySelectorAll(".reveal")).filter(e => Number(getComputedStyle(e).opacity) < 0.9).length);
    const h1 = await p.locator("h1").first().isVisible();
    if (hidden || !h1) bad(`no-JS ${r}: ${hidden} hidden reveals, h1 visible=${h1}`);
    else console.log(`no-JS ${r}: complete page`);
  }
  await ctx.close();
}

await b.close();
console.log(fail ? `\n${fail} FAILURE(S)` : "\nall checks passed");
process.exit(fail ? 1 : 0);
