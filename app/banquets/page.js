import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { money } from "@/lib/menu";
import { Ornament } from "@/components/Ornament";
import BanquetInquiry from "@/components/BanquetInquiry";

export const metadata = {
  title: "Banquets and Events",
  description:
    "Private rooms in downtown Marshall for a table of eight up to 120, plus a 250-guest venue two blocks up: rehearsal dinners, receptions, showers and board lunches.",
  alternates: { canonical: "/banquets" },
  openGraph: {
    title: "Banquets and Events | Schuler's Restaurant & Pub",
    description: "Private rooms here, and a 250-guest venue two blocks up Eagle Street.",
    url: "/banquets",
    images: [{ url: "/assets/schulers/banquets-banner.webp", width: 1600, height: 635, alt: "A room set for a private event at Schuler's" }],
  },
};

export default function Banquets() {
  return (
    <>
      <div className="banner">
        <div className="wrap">
          <p className="eyebrow on-dark">Private events</p>
          <h1>Room for the whole party</h1>
          <p>
            Private rooms in this building for a table of eight up to {site.banquetMax}, and a{" "}
            {site.family.venue.capacity}-guest venue two blocks up Eagle Street.
          </p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="split">
            <div>
              <Image
                src="/assets/schulers/banquets-banner.webp"
                alt="A private event at Schuler's"
                width={1763} height={700}
                sizes="(max-width: 860px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="eyebrow">In this building</p>
              <h2>The private rooms</h2>
              <p>
                The Heritage rooms open into each other, so the same floor holds an intimate dinner
                for thirty or a reception for a hundred and twenty. The Signature Room is the one to
                ask for when everyone at the table should be able to hear each other.
              </p>
              {/* Only two of these five capacities are published anywhere. The rest
                  say so rather than carrying a plausible-looking invention, which is
                  how a guest plans a party around a number nobody checked. */}
              {/* Only two capacities are published anywhere, so only two rooms get
                  numbers, and the rest share one honest line instead of repeating
                  "ask us" three times like a form letter. */}
              <ul className="facts">
                {site.banquetRooms.filter((r) => r.seats).map((r) => (
                  <li key={r.name}>
                    <b>{r.name}</b>, {r.seats} guests{r.note ? `. ${r.note}` : ""}
                  </li>
                ))}
                <li>
                  <b>{site.banquetRooms.filter((r) => !r.seats).map((r) => r.name).join(", ")}</b>{" "}
                  round out the floor. Tell us your count and we will match the room.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cream">
        <div className="wrap">
          <div className="sec-head">
            <Ornament className="orn draw" />
            <h2>What it costs</h2>
            <p>
              Plated dinner, per guest, from the {site.banquets.packetDate} packet. A{" "}
              {site.banquets.serviceChargePct}% service charge is added to food and beverage on all
              private events.
            </p>
          </div>

          <div className="grid g3 stagger">
            {site.banquets.plated.map((t) => (
              <article className="card" key={t.tier}>
                <div className="card-body">
                  <p className="eyebrow">{t.tier}</p>
                  <p className="price-tag" style={{ marginTop: 8 }}>{money(t.price)}</p>
                  <p style={{ marginTop: 2 }}>per guest, plated</p>
                </div>
              </article>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: 30, color: "var(--muted)", fontSize: 15 }}>
            Breakfast from ${site.banquets.breakfastFrom}, lunch from ${site.banquets.lunchFrom},
            buffets and hors d&rsquo;oeuvres priced separately. Bar packages need a{" "}
            {site.banquets.barPackageMinGuests}-guest minimum.
          </p>
        </div>
      </section>

      <section className="dark">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="eyebrow on-dark">Two blocks up</p>
              <h2>{site.family.venue.name}</h2>
              <p>{site.family.venue.blurb}</p>
              <p>
                Seats {site.family.venue.capacity}. Two dressing suites, three hotel rooms upstairs,
                and every plate out of this kitchen. Venue fees run{" "}
                ${site.banquets.venueFee.sunThu.toLocaleString()} Sunday through Thursday,{" "}
                ${site.banquets.venueFee.fri.toLocaleString()} Friday and ${site.banquets.venueFee.sat.toLocaleString()} Saturday.
              </p>
              <p style={{ marginTop: 26 }}>
                <a className="btn ghost on-dark" href={site.family.venue.url}>Visit 19 Zero 9</a>
              </p>
            </div>
            <div>
              <Image
                src="/assets/schulers/venue-19zero9.webp"
                alt="The hall at Venue 19 Zero 9, tables set under the timber trusses"
                width={1100} height={734}
                sizes="(max-width: 860px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap narrow" style={{ textAlign: "center" }}>
          <Ornament className="orn draw" />
          <h2 style={{ fontSize: "clamp(26px, 3.4vw, 38px)", marginTop: 18 }}>Start a conversation</h2>
          <p style={{ marginTop: 16, color: "var(--muted)" }}>
            Tell us the date and roughly how many people, and Elizabeth will come back with the
            rooms that fit and what they cost.
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn" href="#enquire">Ask about a date</a>
            <a className="btn ghost" href={`tel:${site.salesPhone.tel}`}>{site.salesPhone.display}</a>
          </div>
        </div>
      </section>

      <section className="cream" id="enquire">
        <div className="wrap narrow">
          <div className="sec-head">
            <Ornament className="orn draw" />
            <h2>Tell us about it</h2>
            <p>The type, the date and the guest count are all we need to come back with rooms and a price.</p>
          </div>
          <BanquetInquiry />
        </div>
      </section>
    </>
  );
}
