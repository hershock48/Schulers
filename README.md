# Schuler's Restaurant & Pub

A Glazed Web pitch repo. **Prospect, not signed.** Two things live here: a
proposal, and a full concept rebuild of schulersrestaurant.com with online
ordering in it.

Read `glaze.md` in the `glazedweb` repo before touching this. The rules that
govern what is in here specifically are `glaze/proposal.md` (six sections, host
split), `glaze/link-cards.md` (the two cards), `glaze/brand.md` (the studio
palette and mark) and `glaze/launch.md` (definition of done).

---

## The host split

```
schulers.glazedweb.com/       ->  the proposal
schulers.glazedweb.com/demo   ->  this site
schulersrestaurant.com/       ->  this site, with no proposal anywhere
```

Three host-scoped rewrites in `next.config.mjs`, and **they are in
`beforeFiles`**. A plain `rewrites()` array is `afterFiles`, which only runs
once Next has failed to find a page, and `app/page.js` already answers `/`, so
the root rewrite would silently never fire and the prospect would land on the
demo instead of the pitch.

There is a fourth rule that is not in the house doc. The proposal file lives in
`public/`, which means it is a real URL on **every** host this project answers,
including the client's own domain once it is attached. So `/pitch/:path*` with
`missing: onPitchHost` sends it to the 404 page anywhere but the pitch host.
Verified both ways:

| Host | Path | Result |
|---|---|---|
| schulers.glazedweb.com | `/` | 200, the proposal |
| schulers.glazedweb.com | `/demo`, `/demo/menu` | 200, the site |
| schulersrestaurant.com | `/pitch/schulers/index.html` | **404** |
| schulersrestaurant.com | `/` | 200, the site |

`X-Robots-Tag: noindex, nofollow` goes out on every path on the pitch host and
on any `*.vercel.app` host, and is confirmed absent on the client host. The
preview host is indexable by default and is the same duplicate-content risk; the
demo is a full copy of their site and must never compete with them for their own
name.

One accepted wart: links are root-relative, so the `/demo` prefix drops off
after the first click. Nothing 404s.

**Delete the pitch file and the rewrites once they sign or pass.**

---

## Routes

| Route | What it is |
|---|---|
| `/` | Home |
| `/menu` | Full menu, dine-in prices, `Menu` schema |
| `/carryout` | Only what travels, at carryout prices |
| `/order` | **Jelly.** Cart, pickup time, totals, demo checkout |
| `/reservations` | Real-time booking, demo confirmation |
| `/banquets` | Five private rooms, plated tiers, 19 Zero 9 |
| `/events` | Dated events, filtered against today |
| `/hotel` | The Royal Hotel, eight rooms, the five room gallery |
| `/shop` | Chef's Salt, Take & Bake, gift cards, glassware |
| `/about` | 1909 to now |
| `/contact` | Hours, both phone numbers, a form |

Plus `/sitemap.xml`, `/robots.txt` and a branded 404.

## Deploying

```
Framework: Next.js   Build: next build   No env vars.
```

1. Import into Vercel.
2. Add **`schulers.glazedweb.com`**. Apex form only. Adding the `www` form
   leaves it without a certificate and that link fails when you send it.
3. Fetch `https://schulers.glazedweb.com/` and confirm it serves the proposal,
   not the site. Then fetch `/demo` and confirm the opposite.
4. Confirm `X-Robots-Tag` on both the pitch host and the `.vercel.app` host.

---

## Verified state, 20 August 2026

Audited with `glaze/scripts/audit.mjs` against a **production** build served by
`next start`, never the dev server.

```
=== 12 route(s) at 390 and 1440px ===
axe violations total: 0
horizontal overflow:  none
console errors:       none
4xx/5xx:              none
```

Overflow separately checked on all 11 site routes plus the proposal at
**320, 360, 390, 768, 1024 and 1440**. All clean.

Behaviour checked, not assumed, by `/tmp/flow.mjs` (reproduced in
`tools/flow-checks.mjs`):

- **Client-side navigation asserts visibility.** Menu, Banquets, About and Shop
  each land with the `h1` visible at opacity 1 and zero `.reveal` elements still
  hidden. A navigation test that does not assert visibility is not a navigation
  test: a reveal system queried once on mount hides the next page's elements
  forever, and the URL and nav highlight both still change correctly while the
  page sits blank.
- **Ordering:** place is disabled on an empty cart, still disabled with items
  but no pickup time, enabled with both, exactly one service-fee row, and the
  confirmation says plainly that nothing was charged.
- **Reservations:** submit disabled until a time is picked, and the confirmation
  discloses that no table was held.
- **JavaScript off:** home, menu and banquets all arrive as complete pages with
  nothing hidden.

### Faults found and fixed on the way

Recorded because the reasoning is what stops them coming back.

1. **Five photos were named `interior-*` and were hotel bedrooms.** The home
   hero, the OG image, the `Restaurant` schema image and three `alt` attributes
   all said "the dining room at Schuler's" over a picture of the Grand Suite.
   Caught by looking at the render rather than the filename. Files renamed to
   `room-eagle`, `room-mansion`, `room-grand-suite`, `room-hamilton`,
   `room-jefferson`, every reference repointed, and the hero is now the building
   on Eagle Street. **When a thing appears N times, check all N.**
2. **Two `h1` elements on `/order`.** The banner owns the h1 and the demo
   confirmation added a second. The confirmation is an `h2` now.
3. **Anchor jumps landed under two sticky bars.** `#pub` put the heading behind
   the header and the menu nav. Fixed with `scroll-margin-top` on `.msec`.
4. **320px overflow, 16px.** Long unbreakable tokens. Fixed with
   `overflow-wrap` on the text elements rather than on the one heading the
   measurement named, because there are a dozen more of those tokens here.
5. **A stale `next start` survived `pkill`** and served an old build that made a
   fixed test look still-broken. Killed by PID and the port confirmed free
   before re-testing.

### Not measured

**No page speed score.** Google's PageSpeed API returned HTTP 429 on every
attempt across two sessions. There is no performance number in the proposal and
none was estimated. First Load JS is 102 to 111 kB per route from the build
report, which is inside the 150 kB budget, but that is a build figure and not a
field measurement.

To re-run the audit:

```bash
npm install axe-core playwright-core --no-save
npm run build && npx next start -p 4490
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
  node ../glazedweb/glaze/scripts/audit.mjs --base http://127.0.0.1:4490 \
  --routes /,/menu,/carryout,/order,/reservations,/banquets,/events,/hotel,/shop,/about,/contact
node tools/flow-checks.mjs
```

---

## Where the content came from

Nothing on this site is invented copy about their business.

- **Menu**, `lib/menu.js` — names and descriptions from their own
  `/wp-json/wp/v2/fdm-menu-item` records, prices scraped from the rendered
  `/menu/` and `/our-carryout-menu/` pages, 20 August 2026. Where an item is
  priced by the pint for carryout and by the plate in the dining room, both
  numbers are kept, because they really are two products.
- **Facts**, `lib/site.js` — hours, address, both phone numbers, banquet room
  capacities, the April 2026 packet's plated tiers and venue fees.
- **Photography** — theirs, with permission. Downloaded from their media
  library and converted: **17.7 MB of JPEG became 2.3 MB of WebP, 87% smaller**,
  at sane render widths. Their live site serves zero WebP and has no image
  optimizer installed, which is one of the audit findings, so shipping 900 KB
  hero JPEGs here would have been indefensible.
- **Ornaments**, `components/Ornament.jsx` — their own filigree from
  `wp-content/uploads/2022/05/schuler-ornament.svg`, lifted rather than redrawn.
  The only change is the hardcoded print gray becoming `currentColor` so the
  same mark works on cream and on the dark bands. Every coordinate is untouched.
- **Palette** — pixel-sampled from their own logo, which is 19.6% cream
  `#FCF6D2`, 18.9% oxblood `#8A1E00`, 9.7% ink `#1E1E1E` and 5.7% forest green
  `#18542A` by area. Contrast computed, not judged: on the page ground, oxblood
  8.88, green 8.60, ink 15.97, muted 7.65, cream on oxblood 8.49.

**Their site is full of stock photography.** 51 of the images in their media
library are Shutterstock files, including ones on the homepage. None of them are
in this build. Everything here is a photograph of their building, their rooms,
their food or their products.

---

## Traps

**Facts live in `lib/site.js`.** Their live site publishes the hotel as five
rooms on one domain and eight on another, the venue as 250 guests in one place
and 300 in another, and four contradictory sets of opening hours across pages
that are all still live. Every one of those is the same failure: a fact typed
into a page instead of read from somewhere. Do not reintroduce it. The surfaces
that cannot read from that file are the proposal, which is deliberately
standalone, and the OG images, which are pixels.

**The reveal class is added by script**, and the effect re-arms on `usePathname`
change. With JavaScript off nothing is ever hidden. Do not move `.reveal`'s
opacity out from under the `.js` selector, and do not drop `path` from that
effect's dependency array.

**`/order` and `/events` are `force-dynamic` on purpose.** Both depend on the
current time. A page like that cannot be statically generated or revalidated on
a timer: `new Date()` at build time freezes, and regeneration is
request-triggered, so on a quiet week a cached page ages indefinitely and starts
advertising an event that already happened.

**The guest-facing ordering page carries no business model.** No fee-split
story, no anti-Toast copy, nothing about middlemen. A guest gets a menu, a
pickup time and a plainly labeled service fee. That argument lives in the
owner's proposal and nowhere else.

**Availability is not solved.** The reservation slots are a fixed pattern with a
couple of peak times held back so the sold-out state is visible, and the code
says so. It is a named seam, not a solved problem.

---

## PLACEHOLDER — must be resolved before launch

Every one of these is a real fact we do not have. Silence about a placeholder
reads as "this number is real."

- [ ] **Pickup window and lead time.** `site.pickup` uses 11:45am to 8:30pm at
      15-minute intervals with 25 minutes of lead. Modeled on posted kitchen
      hours, not confirmed with the kitchen.
- [ ] **Every event in `lib/events.js`.** Shaped from the kinds of events they
      really run, with plausible 2026 dates. None confirmed. All four are
      flagged `placeholder: true`.
- [ ] **This week's Take & Bake menu** on `/shop`, which the kitchen writes
      every Monday.
- [ ] **Real-time reservation availability**, which needs their book.
- [ ] **Form destinations.** Neither the contact form nor the booking form has a
      real destination or a confirmed inbox, which are two different things.
      Both say so on the page and the contact form hands off to `mailto:` with
      every field prefilled rather than pretending to send.
- [ ] **Ordering payment.** Nothing takes a card. The service fee shown is the
      99 cent guest fee.
- [ ] **Photo permission is granted** (Kevin, Aug 2026), but confirm it covers
      the Royal Hotel room photography, which was shot for the hotel site.

## Before you send it

- [ ] Every audit finding in the proposal links to the page that proves it, and
      the one thing that could not be verified is named on the page. **Done.**
- [ ] The demo is deployed and every route loads.
- [ ] Proposal card and demo card exist, are different files, and both render.
      **The demo card does not exist yet.** `public/pitch/schulers/og.jpg` is the
      proposal card; the demo currently has no `og.jpg` of its own, so a
      forwarded `/demo` link falls back to per-page images. Make one before this
      gets forwarded.
- [ ] The pitch host and the `.vercel.app` host are both `noindex`.
- [ ] The price is a number. **$4,500 build, $250 a month, ordering included.**
- [ ] Read it once as Sue Damron, not as the builder.
- [ ] **Re-check the staff schedule finding the day you send it.** It is the
      opening item and the strongest thing in the document. One fetch settles it.
- [ ] **`kevin@glazedweb.com` is the only action in the proposal.** Confirm that
      mailbox exists and is watched.

## Two traps that would cost the account

Both are in the research doc; repeated here because they are easy to walk into.

**Do not pitch Bar Scheeze e-commerce.** They sold the packaged-food brand to
Vlasic, a Campbell division, in 1982, recipe and name included. It is why the
restaurant serves "Heritage Cheese Spread" now. The live USPTO mark covering
cheese spread belongs to Win Schuler Foods, Inc. of Southfield, a separate
company. Every trademark Schuler's Inc. holds is Class 043, restaurant services
only. Chef's Salt is the clean product, and it is the one on `/shop`.

**Warn them before they call NCR.** Their POS is Aloha. Aloha Digital Ordering
needs a separately licensed Aloha Takeout plus an interface server underneath
it, and NCR's published SMB agreement is a 36-month term with 90 days' notice,
CPI+5% annual increases, and termination for convenience costing 100% of
remaining fees. That agreement also forbids interfacing Aloha with third-party
applications without NCR authorization, which is why `/order` runs alongside
Aloha and never touches it.

The full research this was cut down from is not in this repo. Ask Kevin for
`schulers-prospect-research.md`.
