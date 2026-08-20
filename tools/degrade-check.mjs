/**
 * The crest must be a finished, lit sign with JavaScript off and under reduced
 * motion. Run against a production server.
 */
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright-core");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
let fail = 0; const bad = m => { console.log("  FAIL " + m); fail++; };

// JavaScript off: the crest must be finished, in colour, signature complete.
const nojs = await b.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
const p1 = await nojs.newPage();
await p1.goto("http://127.0.0.1:4490/", { waitUntil: "domcontentloaded" });
const r1 = await p1.evaluate(() => {
  const el = document.querySelector(".crest");
  const word = document.querySelector(".crest-word");
  const halo = document.querySelector(".crest-halo");
  return { run: el?.classList.contains("crest-run"),
           fill: getComputedStyle(word).fill,
           halo: getComputedStyle(halo).opacity };
});
if (r1.run) bad("no-JS: crest-run was applied without JS");
if (r1.fill !== "rgb(252, 246, 210)") bad("no-JS: script not at full cream, fill " + r1.fill);
if (parseFloat(r1.halo) !== 0) bad("no-JS: glow showing, opacity " + r1.halo);
if (!fail) console.log("  no-JS: crest lit, script at full cream, no glow");
await nojs.close();

// Reduced motion: class may be added, but nothing may animate or hide.
const rm = await b.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
const p2 = await rm.newPage();
await p2.goto("http://127.0.0.1:4490/", { waitUntil: "networkidle" });
await p2.waitForTimeout(900);
const r2 = await p2.evaluate(() => {
  const word = document.querySelector(".crest-word");
  const halo = document.querySelector(".crest-halo");
  return { fill: getComputedStyle(word).fill, halo: getComputedStyle(halo).opacity };
});
if (r2.fill !== "rgb(252, 246, 210)") bad("reduced-motion: script not lit, " + r2.fill);
if (parseFloat(r2.halo) !== 0) bad("reduced-motion: glow showing");
if (fail === 0) console.log("  reduced-motion: crest lit, nothing animating");
await rm.close();

// The mark must carry one accessible name, not two.
const p3 = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
await p3.goto("http://127.0.0.1:4490/", { waitUntil: "networkidle" });
const names = await p3.$$eval("[aria-label], img[alt]", els =>
  els.map(e => e.getAttribute("aria-label") || e.getAttribute("alt")).filter(t => /schuler/i.test(t || "")));
console.log("  accessible names mentioning Schuler's in the hero area:", JSON.stringify(names.slice(0,4)));
await b.close();
console.log(fail ? `\n${fail} FAILURE(S)` : "\nall degrade checks passed");
process.exit(fail?1:0);
