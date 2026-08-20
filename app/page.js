import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { Ornament } from "@/components/Ornament";
import OpenNow from "@/components/OpenNow";
import ReserveStrip from "@/components/ReserveStrip";
import CrestSignature from "@/components/CrestSignature";
import HistoryTicker from "@/components/HistoryTicker";

export const metadata = {
  title: "Schuler's Restaurant & Pub | Marshall, Michigan since 1909",
  description:
    "Prime rib in the English tradition, Winston's Pub, private events and eight rooms upstairs. Downtown Marshall, Michigan, serving since 1909.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Schuler's Restaurant & Pub",
    description: "Prime rib in the English tradition. Marshall, Michigan, since 1909.",
    url: "/",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Schuler's Restaurant & Pub, Marshall, Michigan, since 1909" }],
  },
};

export default function Home() {
  return (
    <>
      {/* The crest is the hero. Their mark is the strongest thing they own and
          the previous build had it at 130px in the header while a phone
          snapshot of the building -- blown sky, parked cars, a utility pole --
          carried the page. See components/CrestSignature.jsx. */}
      <section className="hero hero-crest">
        <div className="hero-inner">
          <p className="eyebrow">Marshall, Michigan &middot; Est. {site.since}</p>

          <CrestSignature priority />

          <h1>Come early if you want <em>the end cut.</em></h1>
          <p className="lede">
            Prime rib in the English tradition, from a family that has been feeding this town
            since 1909. A dining room that has outlasted two world wars, Prohibition and every
            restaurant that ever opened across the street.
          </p>
          {/* Ordering leads. It is the larger behaviour and the one that moves
              money, so it takes the solid button and the first position;
              booking follows in the outline. */}
          <div className="cta-row">
            <Link className="btn" href="/order">Order Carryout</Link>
            <Link className="btn ghost" href="/reservations">Book a Table</Link>
          </div>
          <OpenNow />
        </div>
      </section>

      <HistoryTicker />

      <ReserveStrip />

      <section className="tight">
        <div className="wrap">
          <div className="sec-head">
            <Ornament className="orn draw" />
            <h2>Three rooms, one kitchen</h2>
            <p>
              The dining room for an occasion, the pub for a Tuesday, and the whole menu boxed and
              waiting when you have twenty minutes and a drive ahead of you.
            </p>
          </div>

          {/* Asymmetric on purpose: the dining room carries the weight, the pub
              and carryout stack beside it. A row of three equal cards is the
              other generic tell, after the scrim hero. */}
          <div className="rooms stagger">
            <Link className="room room-lead reveal-img" href="/menu">
              <figure>
                <Image src="/assets/schulers/food-primerib.webp" alt="Schuler's roast prime rib of beef" width={426} height={284} sizes="(max-width: 860px) 100vw, 55vw" />
              </figure>
              <div className="room-body">
                <h3>The Dining Room</h3>
                <p>
                  Prime rib in the English tradition, cut the Schuler way at twelve ounces. Filet,
                  halibut with cherries, the Florentine chicken, and a Swiss onion soup people order
                  before they have taken their coats off.
                </p>
                <span className="go">See the menu &rarr;</span>
              </div>
            </Link>

            <Link className="room reveal-img" href="/menu#pub">
              <figure>
                <Image src="/assets/schulers/food-burger.webp" alt="The Winston Burger" width={426} height={284} sizes="(max-width: 860px) 100vw, 42vw" />
              </figure>
              <div className="room-body">
                <h3>Winston&rsquo;s Pub</h3>
                <p>Same kitchen, shorter sleeves. The Winston Burger, the two napkin brisket, fish and chips.</p>
                <span className="go">Pub favorites &rarr;</span>
              </div>
            </Link>

            <Link className="room reveal-img" href="/order">
              <figure>
                <Image src="/assets/schulers/food-brisket-mac.webp" alt="Carryout from Schuler's, boxed and ready" width={1000} height={667} sizes="(max-width: 860px) 100vw, 42vw" />
              </figure>
              <div className="room-body">
                <h3>Carryout</h3>
                <p>Order it on your phone, pay before you leave, pick a time. No calling and holding.</p>
                <span className="go">Order online &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="dark">
        <div className="wrap">
          <div className="split">
            <div className="reveal">
              <p className="eyebrow on-dark">Since {site.since}</p>
              <span className="years" aria-hidden="true" />
              <span className="years-label">years feeding Marshall, and counting</span>
              <h2 style={{ marginTop: 30 }}>It started as a cigar store.</h2>
              <p>
                Albert Schuler bought a small shop on Eagle Street in {site.since} and started
                serving food to the people already standing in it. His son Win turned it into a
                restaurant people drove across the state for. Four generations later the prime rib
                is still cut in the English tradition and the room is still full on a Saturday.
              </p>
              <p>
                Sue Damron runs it now, after more than twenty years in the building. The recipes
                did not change hands. The keys did.
              </p>
              <p style={{ marginTop: 26 }}>
                <Link className="btn ghost on-dark" href="/about">Read the history</Link>
              </p>
            </div>
            <div className="reveal">
              <Image
                src="/assets/schulers/historical.webp"
                alt="The Royal Hotel and Schuler's on Eagle Street, early twentieth century"
                width={1080}
                height={837}
                sizes="(max-width: 860px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="cream">
        <div className="wrap">
          <div className="split">
            <div className="reveal">
              <Image src="/assets/schulers/takeandbake-spread.webp" alt="A Take and Bake family meal laid out: salad, a pan of enchiladas, chips and salsa" width={1200} height={874} sizes="(max-width: 860px) 100vw, 50vw" style={{ borderRadius: "var(--radius)" }} />
            </div>
            <div className="reveal">
              <p className="eyebrow">Every Wednesday</p>
              <h2>Take &amp; Bake</h2>
              <p>
                One family meal a week, made here and finished in your oven. It serves {site.takeAndBake.serves},
                it costs ${site.takeAndBake.price}, and it changes every week.
              </p>
              <ul className="facts">
                <li>Order by {site.takeAndBake.orderBy}</li>
                <li>Pick up {site.takeAndBake.window}</li>
                <li>Free delivery in {site.takeAndBake.deliveryTowns.join(", ")}</li>
              </ul>
              <p style={{ marginTop: 26 }}>
                <Link className="btn" href="/shop">See this week&rsquo;s meal</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head">
            <Ornament className="orn draw" />
            <h2>Room for the whole party</h2>
            <p>
              Private rooms in this building, a {site.family.venue.capacity}-guest venue two
              blocks up, and {site.family.hotel.rooms} rooms for the people who should not drive.
            </p>
          </div>

          <div className="grid g3 stagger">
            <article className="card reveal">
              <div className="card-img reveal-img">
                <Image src="/assets/schulers/room-signature.webp" alt="The Signature Room set for a private dinner" width={600} height={400} sizes="(max-width: 620px) 100vw, 33vw" />
              </div>
              <div className="card-body">
                <h3>Banquets and Events</h3>
                <p>
                  Rehearsal dinners, board lunches, showers and receptions, from a table of eight
                  up to {site.banquetMax} in the Heritage Room.
                </p>
                <p className="card-link"><Link href="/banquets">Plan an event</Link></p>
              </div>
            </article>

            <article className="card reveal">
              <div className="card-img reveal-img">
                <Image src="/assets/schulers/hotel-suite.webp" alt="A guest room at The Royal Hotel" width={1200} height={798} sizes="(max-width: 620px) 100vw, 33vw" />
              </div>
              <div className="card-body">
                <h3>The Royal Hotel</h3>
                <p>
                  {site.family.hotel.rooms} rooms across two restored buildings, the first overnight
                  rooms above Schuler&rsquo;s in more than fifty years.
                </p>
                <p className="card-link"><Link href="/hotel">Stay the night</Link></p>
              </div>
            </article>

            <article className="card reveal">
              <div className="card-img reveal-img">
                <Image src="/assets/schulers/banquets-banner.webp" alt="Venue 19 Zero 9 set for a reception" width={1600} height={635} sizes="(max-width: 620px) 100vw, 33vw" />
              </div>
              <div className="card-body">
                <h3>Venue 19 Zero 9</h3>
                <p>
                  A restored 1880s building two blocks up Eagle Street, seating {site.family.venue.capacity},
                  catered by this kitchen.
                </p>
                <p className="card-link"><a href={site.family.venue.url}>Visit 19 Zero 9</a></p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="ox tight">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}>Come for dinner.</h2>
          <p style={{ margin: "16px auto 28px", maxWidth: 520 }}>
            Reserve a table in about thirty seconds, or call the restaurant and we will find you
            something.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn on-dark" href="/reservations">Book a Table</Link>
            <a className="btn ghost on-dark" href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
          </div>
        </div>
      </section>
    </>
  );
}
