# Schuler's Restaurant & Pub

A Glazed Web pitch repo. **Prospect, not signed.** Nothing here is a client build
yet.

Read `glaze.md` in the `glazedweb` repo before touching this. The house rules for
what is in here specifically are `glaze/proposal.md` (the six sections and the
host split), `glaze/link-cards.md` (the two cards), and `glaze/brand.md` (the
palette and the mark).

---

## What this is

| Path | What it is |
|---|---|
| `public/pitch/schulers/index.html` | The proposal. One self-contained file, no build step, so it can be hand-edited on a phone if a call goes sideways. |
| `public/pitch/schulers/og.jpg` | The proposal's link card. 1200x630, 48KB. |
| `tools/og-card.html` | The page the card is rendered from. Not deployed content, but it is what you edit if the card changes. |
| `public/robots.txt` | Allows crawling on purpose. `noindex` is handled by the header, not by `Disallow`. |
| `vercel.json` | Static output from `public/`, root rewritten to the proposal, `X-Robots-Tag: noindex, nofollow` on every path. |

## Deploying

Static. No framework, no build, no dependencies.

1. Import the repo into Vercel. It will detect no framework, which is correct.
2. Add the domain **`schulers.glazedweb.com`**. Apex form only. Adding the `www`
   form leaves it without a certificate, and that link fails when you send it.
3. Confirm `https://schulers.glazedweb.com/` serves the proposal and not a
   directory listing.
4. Confirm the response carries `X-Robots-Tag: noindex, nofollow`. Check the
   `.vercel.app` host too. It is indexable by default and is the same
   duplicate-content risk.

## Before you send it

- [ ] Every audit finding links to the page that proves it. **Done**, and the
      one thing that could not be verified is named on the page rather than
      dropped: there is no page speed score in this proposal because Google's
      API rate limited every attempt.
- [ ] Proposal card renders. Paste the URL into Messages **and** one non-Apple
      surface and look at it.
- [ ] The pitch host and the `.vercel.app` host are both `noindex`.
- [ ] The price is a number. **$4,500 build, $250 a month.**
- [ ] Read it once as Sue Damron, not as the builder. Cut any sentence that is
      about Glazed Web rather than about Schuler's.
- [ ] **Re-check the staff schedule finding on the day you send it.** It is the
      opening item and the strongest thing in the document, and if they have
      already deleted the files the claim has to change. One fetch of the URL in
      the card settles it.
- [ ] **`kevin@glazedweb.com` is the address on the CTA button.** Confirm that
      mailbox exists and is watched, or change it before sending.

## No demo yet

There is no `/demo` on this host, because there is no concept build. That is a
deliberate scope call, not an omission. When one gets built, this repo converts
to Next.js and the three host-scoped rewrites in `glaze/proposal.md` go into
`next.config`, in `beforeFiles`. A plain `rewrites()` array is `afterFiles` and
the root rewrite silently never fires.

The proposal never claims a demo exists. Do not add a link to one until it does.

## Verified state, August 20 2026

Audited with `glaze/scripts/audit.mjs` against the served file:

```
axe violations total: 0
horizontal overflow:  none
console errors:       none
4xx/5xx:              none
```

Overflow separately checked at **320, 360, 390, 768, 1024 and 1440**. All clean.
320 was the one that broke, as it always is: long unbreakable tokens
(`schulersrestaurant.com` in a 30px heading, the upload path in the first
finding) pushed the page 16px wide. Fixed with `overflow-wrap: break-word` on the
text elements rather than on the one heading the measurement named, because there
are a dozen more of those tokens in the findings.

One contrast violation was found and fixed: `.after`, the line under the CTA
button, was a softened white at 4.27 on the deep pink band. Full white is 4.78.
Same fault and same fix as the band's own paragraph in `globals.css`.

To re-run it:

```bash
npm install axe-core playwright-core --no-save
(cd public && python3 -m http.server 4490 --bind 127.0.0.1 &)
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
  node ../glazedweb/glaze/scripts/audit.mjs \
  --base http://127.0.0.1:4490 --routes /pitch/schulers/
```

`node_modules` is gitignored. Those two packages are audit tooling, not
dependencies of the page, which is why there is no `package.json`.

## Traps in this file

**The mark is lifted, not redrawn.** The gradients and the `#mark` symbol are
copied verbatim from `components/Logo.jsx` in the `glazedweb` repo, and the
`viewBox` is cropped to `46 16 110 186`, the mark's real painted bounds. No
coordinate moves. If you redraw it, it is not Kevin's donut.

**Three pinks, on purpose.** `--raspberry` is accents only. `--raspberry-deep`
carries white text. `--raspberry-ink` is link text. Using the wrong one
reintroduces a contrast fault that took a full audit to find.

**The reveal class is added by script.** With JavaScript off nothing is ever
hidden and the page is complete on arrival. Do not move `.reveal`'s opacity out
from under the `.js` selector.

**The card's safe area is the centre 630x630 band**, x 285 to x 915. iOS crops
link previews toward square. The headline was 74px and ran edge to edge in that
crop; it is 66px now. If you change the wording, re-render and look at the crop.

## Facts behind the findings

The full research this proposal was cut down from covers fourteen findings, the
Aloha contract situation, and the Win Schuler's trademark problem, which matters
because the restaurant sold the packaged-food brand to Vlasic in 1982 and cannot
sell Bar Scheeze online. It is not in this repo. Ask Kevin for
`schulers-prospect-research.md`.

Two things in it that should shape any conversation with them:

- **Do not pitch Bar Scheeze e-commerce.** They do not own it. Chef's Salt is the
  clean product and is already shippable.
- **Warn them before they call NCR about online ordering.** The published Aloha
  agreement is a 36 month term with CPI+5% annual increases and a termination fee
  of 100% of remaining fees. Telling them that first is worth more than a mockup.
