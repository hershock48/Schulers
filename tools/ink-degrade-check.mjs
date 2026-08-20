/**
 * The hero drawing must be complete and unmasked with JavaScript off and under
 * reduced motion, and the header must not grow to fit the cord.
 */
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright-core");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
let fail=0; const bad=m=>{console.log("  FAIL "+m);fail++;};
const nojs = await b.newContext({ javaScriptEnabled:false, viewport:{width:1280,height:900} });
const p1 = await nojs.newPage(); await p1.goto("http://127.0.0.1:4490/", {waitUntil:"domcontentloaded"});
const r1 = await p1.evaluate(() => {
  const f=document.querySelector(".ink"); const art=document.querySelector(".ink-art");
  const g=document.querySelector(".ink-g");
  return { run:f?.classList.contains("ink-run"), mask:getComputedStyle(art).mask||getComputedStyle(art).webkitMask, op:getComputedStyle(g).opacity };
});
if (r1.run) bad("no-JS: ink-run applied without JS");
if (/inkMask/.test(r1.mask||"")) bad("no-JS: drawing is masked, mask "+r1.mask);
if (!fail) console.log("  no-JS: drawing complete, unmasked");
await nojs.close();
const rm = await b.newContext({ reducedMotion:"reduce", viewport:{width:1280,height:900} });
const p2 = await rm.newPage(); await p2.goto("http://127.0.0.1:4490/", {waitUntil:"networkidle"}); await p2.waitForTimeout(900);
const r2 = await p2.evaluate(() => {
  const art=document.querySelector(".ink-art"); const g=document.querySelector(".ink-g");
  return { mask:getComputedStyle(art).mask||"", op:getComputedStyle(g).opacity };
});
if (/inkMask/.test(r2.mask)) bad("reduced-motion: still masked");
if (parseFloat(r2.op) !== 1) bad("reduced-motion: strokes hidden, opacity "+r2.op);
if (!fail) console.log("  reduced-motion: drawing complete, nothing animating");
await rm.close();
// header must not have grown
const p3 = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p3.goto("http://127.0.0.1:4490/", {waitUntil:"networkidle"});
const hh = await p3.evaluate(() => Math.round(document.querySelector(".site-header").getBoundingClientRect().height));
console.log("  header height:", hh + "px");
if (hh > 140) bad("header grew to "+hh+"px; the cord should hang inside it");
await b.close();
console.log(fail?`\n${fail} FAILURE(S)`:"\nall good");
process.exit(fail?1:0);
