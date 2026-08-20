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
| `/banquets` | Private rooms, plated tiers, 19 Zero 9 |
| `/events` | Dated events, filtered against today |
| `/hotel` | The Royal Hotel, eight rooms, the five room gallery |
| `/shop` | Chef's Salt, Take & Bake, gift cards, glassware |
| `/about` | 1909 to now |
| `/contact` | Hours, both phone numbers, a form |

Plus `/sitemap.xml`, `/robots.txt` and a branded 404.

## Deploying

```
Framework: Next.js   Build: next build
Env: NEXT_PUBLIC_SITE_ORIGIN=https://schulers.glazedweb.com  (pitch only, see .env.example)
```

1. Import into Vercel. The project exists: `schulers`,
   `prj_eBwLTdF25ufbI7YFSn6u5X96Gh0c`, on the GlazedWeb team.
2. **Add `schulers.glazedweb.com` to the project.** This is the step that was
   missed, and it is the whole reason the URL 404s: as of 20 Aug 2026 the
   project has only its three auto-generated `.vercel.app` domains attached,
   and no custom domain at all. Compare `cascarellis`, which has
   `cascarellis.glazedweb.com` on it. The subdomain form only, never a `www`
   variant, which would have no certificate.

   The host string has to match `PITCH_HOST` in `next.config.mjs` exactly or
   the rewrites never fire and the prospect lands on the demo instead of the
   pitch. Both are `schulers.glazedweb.com`, checked.
3. Set `NEXT_PUBLIC_SITE_ORIGIN=https://schulers.glazedweb.com`, or every
   `og:image` resolves to a domain that does not serve this build and the link
   preview is blank. Delete the variable on launch day.
4. Fetch `https://schulers.glazedweb.com/` and confirm it serves the proposal,
   not the site. Then fetch `/demo` and confirm the opposite.
5. Confirm `X-Robots-Tag` on both the pitch host and the `.vercel.app` host, and
   confirm `/pitch/schulers/index.html` 404s on the client host.

**Deployment protection is already right, leave it alone.** Vercel
Authentication is on with `all_except_custom_domains`, so the `.vercel.app`
URLs are SSO-gated and the custom domain will be public the moment it is
attached. That is the correct setting for a pitch: the prospect gets in, and a
stray preview URL does not leak.

**The framework preset must be Next.js, and `vercel.json` pins it.** This is
the trap that produced a 404 on a green, READY, correctly-aliased deployment,
and it is invisible from the build log because the build itself is fine.

When the project was imported, Vercel did not detect the framework and left the
preset unset (`"framework": null` on the project, against `"nextjs"` on
`cascarellis`). With no preset, Vercel treats the repo as "Other": it runs
`npm run build`, throws the Next.js output away, and serves `public/` as a
plain static directory. The symptom is very specific and worth recognizing:

| Path | Result |
|---|---|
| `/assets/schulers/logo.webp` | 200, because it is in `public/` |
| `/pitch/schulers/index.html` | 200, same reason |
| `/robots.txt` | 200, same reason |
| `/`, `/demo`, `/menu`, `/order` | **404 `x-vercel-error: NOT_FOUND`** |
| `/package.json`, `/README.md` | 404, so it is serving `public/`, not the root |

Static assets serving while every route 404s means the server was never
deployed. Note also that the 404 is `text/plain` from the platform, not the
branded `text/html` 404 this app renders. If you ever see that combination,
check the framework preset before anything else.

There was a second layer underneath it, left behind by the same mistake. This
project began as a static deploy whose `vercel.json` set
`"outputDirectory": "public"`. That file was deleted when the build became a
Next.js app, but **deleting the file does not clear the setting**: the value had
already been written into the project's dashboard settings at import and it
persisted. So the moment the framework preset was fixed, the Next builder ran
correctly and then died looking for the routing manifest in the wrong place:

```
Error: The file "/vercel/path0/public/routes-manifest.json" couldn't be found.
```

`vercel.json` now pins all three, so the whole build configuration travels with
the repo and no dashboard leftover can override it:

```json
{ "framework": "nextjs", "buildCommand": null, "outputDirectory": null }
```

`null` means "use the framework default" rather than "unset", which is what
actually overrides a stale dashboard value. For a Next.js project the default
output directory is `.next` and it should never be stated explicitly.

**The general lesson: a Vercel project setting written at import outlives the
file that created it.** If a build behaves as though a `vercel.json` you deleted
is still in force, it is.

**Vercel refuses to deploy a vulnerable Next.js.** Two production deployments
sat in ERROR with `Vulnerable version of Next.js detected, please update
immediately` as the last line of the build log. The build itself compiled
cleanly both times and completed in 23 seconds; the platform rejected the
output afterwards. That was Next 15.5.4 carrying the React flight protocol RCE.
The upgrade to 16.3.1 fixed the deploy as a side effect of fixing the audit, so
if a deploy ever goes ERROR with a green build, read the last line of the log
before assuming it is the code.

---

## Verified state, 20 August 2026

Audited with `glaze/scripts/audit.mjs` against a **production** build served by
`next start`, never the dev server. Re-run in full after every correction below.

```
=== 12 route(s) at 390 and 1440px ===
axe violations total: 0
horizontal overflow:  none
console errors:       none
4xx/5xx:              none
```

Overflow separately checked on all 11 site routes plus the proposal at
**320, 360, 390, 768, 1024 and 1440**. All clean.

Behaviour checked, not assumed, by `tools/flow-checks.mjs`:

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
- **Keyboard:** the skip link is the first tab stop, becomes visible on focus,
  and its `#main` target exists. The mobile nav opens, reports `aria-expanded`,
  every one of its 7 links is hittable, and it closes on navigate.
- **The studio credit renders.** `.gw-plate` present, last child of `<footer>`,
  computed background `rgb(253,246,236)` matching the value `plate.mjs`
  computed, 15.54 against the footer above it.
- **Every route has a unique title, its own description, and an `og:image` that
  returns 200.**

### Faults found and fixed on the way

Recorded because the reasoning is what stops them coming back.

1. **Five photos were named `interior-*` and were hotel bedrooms.** The home
   hero, the OG image, the `Restaurant` schema image and three `alt` attributes
   all said "the dining room at Schuler's" over a picture of the Grand Suite.
   Caught by looking at the render rather than the filename. Files renamed to
   `room-eagle`, `room-mansion`, `room-grand-suite`, `room-hamilton`,
   `room-jefferson`, every reference repointed, and the hero is now the building
   on Eagle Street. **When a thing appears N times, check all N.**
2. **The studio credit was invisible.** `plate.mjs` said cream plate on this
   `#1E1E1E` footer, and the CSS said so, but the override was appended to
   `globals.css` *before* the stock `glazed-credit.css`, which ships the
   opposite pairing at the same specificity. Later wins, so the page rendered a
   chocolate `#201712` plate on a near-black footer: contrast **1.06**, a drip
   edge nobody could see. Moved to the end of the file, now **15.54**. This is
   the exact failure mode the house doc warns about, and it only surfaced
   because the plate was checked in a browser instead of assumed. The override
   block must stay last in `globals.css`.
3. **"No elevator in either building" was backwards.** royalhotelmarshall.com
   states elevator access from the Green Street entrance and an ADA-compliant
   Jefferson Room. Of every fact on this build that is the worst one to get
   wrong: a guest who needs the lift reads it and books somewhere else. Fixed,
   and the accessibility facts are now on the page as selling points.
4. **Nearly deleted five correct numbers.** A grep of the hotel site's raw HTML
   for "sq ft" returned nothing, so the room square footages looked invented and
   a retraction comment was written saying so. They are published: the room
   details render client side and a fetch strips them. Restored, with the
   reasoning in the file. **Markup is not enough for anything JavaScript
   injects** — read the page, not the source.
5. **The Model T was 1908.** The homepage said the dining room had been feeding
   the town "since the year the first Model T rolled off the line", next to 1909.
   Production started September 1908. The clause is gone.
6. **Invented banquet capacities.** `lib/site.js` carried a seat count for all
   five private rooms. The April 2026 packet publishes exactly two of them
   (Heritage East 8-20, combined Heritage up to 120) and their site publishes
   none. `banquetMax` was also 250, which is Venue 19 Zero 9's number, not this
   building's. Corrected to the two real figures, the other three now say "ask us
   for the count", and breakfast/lunch went from an invented $15/$19 to the
   packet's $16/$21.
7. **OG images would have 404'd on the demo.** `metadataBase` was hardcoded to
   schulersrestaurant.com, which does not serve this build, so every absolute
   `og:image` pointed at a domain with nothing behind it. The link preview would
   have come back blank at the exact moment it matters. Now driven by
   `NEXT_PUBLIC_SITE_ORIGIN`; see `.env.example`.
8. **Two `h1` elements on `/order`.** The banner owns the h1 and the demo
   confirmation added a second. The confirmation is an `h2` now.
9. **Anchor jumps landed under two sticky bars.** `#pub` put the heading behind
   the header and the menu nav. Fixed with `scroll-margin-top` on `.msec`,
   measured at 176px clear of bars ending at 119px.
10. **320px overflow, 16px.** Long unbreakable tokens. Fixed with
    `overflow-wrap` on the text elements rather than on the one heading the
    measurement named, because there are a dozen more of those tokens here.
11. **A stale `next start` survived `pkill`** and served an old build that made a
    fixed test look still-broken. Killed by PID and the port confirmed free
    before re-testing.

### Second pass: the redesign, and what it cost

The first build was audited clean and was still, by the 2026 trend research,
wearing two of the most legible "template from 2019" tells. Both are gone.

12. **The hero was a full-bleed photograph with the headline on a dark scrim
    over it, and a ghost button.** That exact combination is named in the
    research as the single clearest dated pattern in restaurant web design.
    Rules of London uses a still photograph and real editorial copy; L'Enclume
    puts a full sentence where the two-word slogan usually goes. Rebuilt as a
    split: type on the page's own ground, one uncropped photograph beside it.
    Nothing sits on an image, so nothing needs a scrim.
13. **Three equal cards in a row.** Also named, verbatim, as generic. Replaced
    with asymmetric blocks where the dining room carries the weight and the pub
    and carryout stack beside it. The weighting is the argument.
14. **Bodoni Moda was wrong twice.** Historically: it is Neoclassical, c. 1790s,
    and Schuler's is 1909 Anglo-American, whose display types are Scotch Romans,
    Clarendons and fat faces. Commercially: it is the free Google font every
    "luxury" template reaches for, and a survey of Fonts In Use's hospitality
    and menu tags for 2024-2026 turns up no Bodoni at all. Replaced with
    Newsreader, which carries a real optical-size axis, over Archivo, with IBM
    Plex Mono for prices, hours, capacities and dates. That mono is the current
    hospitality formula's third piece and is absent from every competitor site
    in Marshall.
15. **12-24px rounded corners.** Read as SaaS card UI. Square now, with hairline
    rules, which is both more current and more period-correct.
16. **The reveal system was JavaScript.** Replaced with native CSS scroll-driven
    animation, which runs off the main thread. The `Reveal` component and its
    re-arm-on-navigation logic are deleted, and with them the entire class of
    bug where an observer queried once on mount hides every subsequent page.
17. **No persistent Reserve action on mobile**, which the research calls the one
    non-negotiable. Added as a fixed bar carrying Reserve, Menu and Call.
18. **`@property` silently ate a third of the stylesheet.** Declared partway
    down `globals.css`, the pipeline failed to parse it and dropped every rule
    after it: the years counter, the menu leaders and the reserve strip all
    vanished from the built CSS while `next build` reported success. Moved to
    the top of the file. **The built CSS is now grepped after every change**,
    because a green build proves syntax and nothing else.
19. **The studio credit was invisible.** Covered below; it was the same class of
    silent CSS failure.
20. **The prime rib is not carved at the table.** Kevin caught this: the hero
    headline made an operational claim about the dining room that is not true.
    Replaced with a line from their own menu, "End cuts may be available if your
    timing is right", which is theirs and is accurate.
21. **Ordering had no after-hours state.** Past the last pickup window the page
    showed a time picker where every option was disabled and a button reading
    "Choose a pickup time" forever. It now says the kitchen has finished, gives
    tomorrow's first slot, and offers a table instead.

### The three signature effects

Motion here is the client's own object doing something specific, scrubbed to
scroll so the visitor drives it. That is the house pattern: Chism drops eggs,
Be A Number rolls a shirt number, the studio's own menu prices melt from market
rate. None of these would suit another restaurant.

- **The signature writes itself.** Their script is lifted out of `logo.webp`
  (the band at x 17.0-86.5%, y 25.5-65.0%, upscaled 6x and thresholded on
  luminance to separate the cream glyphs from the oxblood stripe behind them),
  then wiped left to right in ink before the full colour lockup blooms up
  underneath and the ink hands over. Black and white, written, then alive. Every
  curve is the curve on their sign; nothing was redrawn. Registration was
  verified by overlaying both layers at half opacity.
- **The years count.** 1909 ticks to the present as the history block passes.
  No JavaScript: `--year` is a registered integer so it can be interpolated and
  a CSS counter prints it. Measured mid-scroll at 1943.
- **The leaders set.** Each menu row's dotted leader draws left to right as the
  row arrives, the way a bill of fare is typeset. Sequencing is free because
  `view()` is per element. The leader is painted as a repeating background, not
  a border, because a border-bottom cannot be partially drawn.

Support: Chrome 115+, Safari 26+. **Firefox does not ship scroll-driven
animations**, which is why the cascade is inverted: the finished state is the
default and the motion is added only inside
`@supports (animation-timeline: view())`. Written the ordinary way, an
unsupported browser falls back to a *time* based timeline and everything below
the fold finishes animating before the reader arrives.

### Findings retracted from the proposal, 20 August 2026

Their live site changed between the research pass and the build. Every finding
was re-verified by hand before sending; **five of thirteen did not survive.**
Kept here rather than quietly deleted, because a claim that was wrong is what
stops the next person re-deriving it.

| Claim | Status now |
|---|---|
| An older version of the site is still live underneath | **Dead.** `/banquets-catering/`, `/about/history/` and `/menus/` all 404 |
| Four contradictory sets of opening hours | **Dead.** Three of the four lived on those legacy pages |
| The Royal Hotel is three rooms smaller on the restaurant site | **Dead.** `/the-royal-hotel/` 301s to royalhotelmarshall.com |
| Events opens to a Thanksgiving page | **Wrong.** It shows a July Take & Bake, listed twice under two dates. Replaced with that |
| 19zero9.com never links back to Schuler's | **Wrong.** Clickable links exist in the body of `/about/` and `/preferred-vendors/`. Rewritten around the competing-hotels list, which is true |

What survived, re-verified with quotes: the staff schedules (**worse than
stated** — 60 PDFs, back to mid-July, weekly), reservations as a request form
("Request Booking", "For same day reservations, please call the restaurant"),
no ordering path at all (the carryout page's only phone number is labeled
"FOR RESERVATIONS CALL"), gift cards mailed, 250 vs 300 on the venue, the 2024
banquet packet still live, no `Restaurant` schema anywhere, the homepage titled
`Home - Schuler's`, no published room rates, and one review on The Knot dated
August 2025.

One finding got **stronger**: The Knot listing advertises a "$4,000 starting
price", which is the superseded 2024 Sunday-to-Thursday venue fee. It is $4,500
in the current packet. The stale pricing is not only in a PDF, it is on a
listing they pay for.

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
- [ ] **Three banquet room capacities.** The April 2026 packet publishes only
      Heritage East (8 to 20) and the combined Heritage Room (up to 120). The
      Signature Room, Heritage West and Heritage Center are marked
      `PLACEHOLDER: capacity not published` in `lib/site.js` and render as "ask
      us for the count" rather than carrying an invented number.
- [ ] **Form destinations.** Neither the contact form nor the booking form has a
      real destination or a confirmed inbox, which are two different things.
      Both say so on the page and the contact form hands off to `mailto:` with
      every field prefilled rather than pretending to send.
- [ ] **Ordering payment.** Nothing takes a card. The service fee shown is the
      99 cent guest fee.
- [ ] **Photo permission is granted** (Kevin, Aug 2026), but confirm it covers
      the Royal Hotel room photography, which was shot for the hotel site.
- [ ] **Set `NEXT_PUBLIC_SITE_ORIGIN`** to the pitch host in Vercel while this is
      a pitch, and delete it on launch day. Without it the demo's link previews
      are blank.

## Checked against the house docs

Worked line by line through `launch.md`, `link-cards.md`, `brand.md` and
`proposal.md`, not just `glaze.md`. What that turned up:

| Doc | Item | Result |
|---|---|---|
| launch.md | 0 axe violations, 0 console errors, 0 4xx | pass, 11 routes |
| launch.md | every route its own title and description | pass, 11 unique each |
| launch.md | canonical on the client's real domain | pass |
| launch.md | LocalBusiness data with hours and address | pass, as `Restaurant`, a LocalBusiness subtype |
| launch.md | sitemap + robots, preview host noindex | pass |
| launch.md | `npm audit` reviewed | **was 1 critical + 2 high.** Next 15.5.4 carried an RCE in the React flight protocol plus 25 other advisories. Upgraded to Next 16.3.1 / React 19.2.8 rather than documenting them. Now 0 |
| launch.md | no secret in the repo | pass |
| launch.md | studio credit, plate ground computed | pass, and the plate bug in the log below |
| link-cards.md | two different cards, demo card is theirs | pass |
| link-cards.md | centre 630x630 crop still carries the point | **failed, fixed.** See the log below |
| link-cards.md | no text under 28px at 1200 wide | **failed, fixed.** The meta line was 23px |
| link-cards.md | contrast measured against the real pixels | pass at 6.44 worst case |
| brand.md | the real mark, never redrawn | **failed, fixed.** The proposal favicon was a hand-drawn donut |
| brand.md | "Concept build by" on an unbought spec build | pass |
| proposal.md | the six sections in order | pass |
| proposal.md | the price is a number | pass, $4,500 and $250 |
| glaze.md | no em dashes in rendered copy | **failed, fixed.** 5 in the banquet room list |
| glaze.md | American spelling | pass, 0 British spellings |
| glaze.md | antithesis rationed | pass, 0 instances |

**Two items cannot be ticked from here.** The link cards have not been pasted
into Messages and a non-Apple surface and looked at, which `link-cards.md`
requires; and nothing has been opened on a real iOS device, which `launch.md`
requires for anything visually unusual. The signature animation is the unusual
thing on this build and it should be looked at on a real phone before this goes
to the client.

## Before you send it

- [x] Every audit finding links to the page that proves it, the unverifiable one
      is named, and **all eleven were re-checked by hand on 20 August 2026**. The
      proposal says so on the page and names the three findings that were already
      fixed before it was sent.
- [ ] The demo is deployed and every route loads.
- [x] Proposal card and demo card exist, are different files, and both render.
      `public/pitch/schulers/og.jpg` is the proposal's (Glazed Web's voice);
      `public/og.jpg` is the demo's, built from their logo, their building and
      their green, 1200x630. Different files, as the house doc requires.
- [ ] The pitch host and the `.vercel.app` host are both `noindex`.
- [ ] The price is a number. **$4,500 build, $250 a month, ordering included.**
- [ ] Read it once as Sue Damron, not as the builder.
- [ ] **Re-check the staff schedule finding the day you send it.** It is the
      opening item and the strongest thing in the document. One fetch settles it.
- [ ] **`kevin@glazedweb.com` is the only action in the proposal.** Confirm that
      mailbox exists and is watched.

## Practise what we preach

`tools/practice-check.mjs` walks the demo and asserts that we do not commit any
fault the proposal names, and that every feature it promises actually exists and
transacts. Run it before sending anything. It found six real failures the first
time, and every one of them would have been found by Sue instead:

| What the proposal says | What the demo did | Fixed |
|---|---|---|
| Attacks mailed-only gift cards, promises emailed ones | The buy button went to a **contact form** | Real `/gift-cards` purchase flow: amount, recipient, sender, message, delivery date |
| "Nowhere on any of your three sites is a room rate" | `/hotel` published **no rate either** | Rate table on `/hotel`, marked PLACEHOLDER on the page and in `lib/site.js` |
| Flags their robots.txt for having no `Sitemap:` line | Ours **had no `Sitemap:` line** | A leftover static `public/robots.txt` was shadowing `app/robots.js`. Deleted |
| "The store, opened up" | `/shop` **sold nothing**, it listed prices | Real basket, ship or collect, their live prices and stock |
| Attacks contradictory facts across their pages | My own rates section said "no elevator" while the page above said there is one | Corrected |
| Sitemap hygiene | `/gift-cards` was **missing from the sitemap** | Added |

Two flagged items were false positives worth recording so nobody re-fixes them:
"five rooms above Schuler's" is correct, because five sit above the restaurant
and three more are inside 19 Zero 9; and the Thanksgiving 6:00pm close is a
special-day time, not a contradiction of the standing 9:00pm.

The one remaining warning is expected: the service fee line does not render when
the kitchen is closed, because the cart is in its after-hours state. Verified
with the clock pinned to a Friday at 6pm, the cart shows subtotal, sales tax,
a 99 cent service fee and a total.

### Third pass: claims extracted from the document, not from memory

`tools/practice-check.mjs` tests the claims someone remembered. `tools/claim-check.mjs`
parses the proposal itself and tests the sub-promises buried inside each build
item, which a hand-written list misses. It found three more:

| Promise in the document | State | Now |
|---|---|---|
| "your host stand gets a screen showing tonight's covers on any tablet or phone" | **Nothing behind it** | `/host` — tonight's book, covers by half hour, party sizes, notes, seat toggles, and a cover ceiling that marks a slot full |
| "a banquet inquiry form that reaches the right inbox with the event type, date and guest count already sorted" | `/banquets` sent people to the **general contact form** | `BanquetInquiry` with type, date and guest count, which narrows to the rooms that fit and routes an oversize party to 19 Zero 9 |
| "your link, when somebody texts it, showing your photograph" | Untested | All 13 `og:image`s verified to return 200 |

**A live bug the third pass caught.** `banquetRooms[].seats` is not a number.
The packet publishes a range for Heritage East ("8 to 20") and a ceiling for the
combined room ("up to 120"), and the other three rooms have no published
capacity and are `null` on purpose. The first version of the enquiry compared a
guest count against that string, matched nothing, and told every enquirer "tell
us the count and we will find the room" — a quiet wrong answer, which is the
worst kind. It now parses a ceiling out of whatever is there and treats an
unpublished capacity as unknown rather than as "does not fit".

### Promised for the build, not demonstrable in a demo

State these as build promises in the room, not as things to click:

- The confirmation **email** on a booking or a gift card. No mail is configured;
  every confirmation screen says outright that nothing was sent.
- The **ticket reaching the kitchen** by printer or line screen. That is
  hardware in their building, and the proposal now says we would watch a dinner
  service before choosing between printer, screen and host stand.
- **Booking notifications** to an inbox or phone.
- The **events editor**. `/events` reads `lib/events.js`; the one-minute edit is
  a build promise.

## For the room, not for the document

Two things Kevin should know and the proposal should not say. Both were in the
proposal at one point and both were cut, because a sales document that spends
three paragraphs qualifying itself immediately before naming a price reads as
doubt.

**There is no page speed number.** Google's API rate limited every attempt
across three sessions. The proposal makes no speed claim, so there is nothing to
disclaim, and a paragraph explaining a measurement nobody asked for is a
paragraph about us. If Sue asks, it takes a minute with a key.

**No guest is complaining.** Their recent reviews contain nothing about the
website, booking, or ordering; the ratings are strong and they are first in
Marshall. Do not let this be a surprise in the room. It is also not a weakness
in the pitch, and the proposal now says so in the wedge instead of in a caveat
box: the table that did not get booked at eleven at night does not leave a
review. The damage is invisible by nature, which is exactly why it has gone
unaddressed.

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
