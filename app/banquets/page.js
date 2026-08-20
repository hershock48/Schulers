import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { money } from "@/lib/menu";
import { Ornament } from "@/components/Ornament";

export const metadata = {
  title: "Banquets and Events",
  description:
    "Private rooms for 30 to 250 guests in downtown Marshall: rehearsal dinners, receptions, showers and board lunches, catered by Schuler's kitchen.",
  alternates: { canonical: "/banquets" },
  openGraph: {
    title: "Banquets and Events | Schuler's Restaurant & Pub",
    description: "Five private rooms here, and a 250-guest venue two blocks up.",
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
            Five private rooms in this building for {site.banquetRooms[1].seats} to {site.banquetMax},
            and a {site.family.venue.capacity}-guest venue two blocks up Eagle Street.
          </p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="split">
            <div>
              <Image
                src="/assets/schulers/room-signature.webp"
                alt="The Signature Room set for a private dinner"
                width={600} height={400}
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
              <ul className="facts">
                {site.banquetRooms.map((r) => (
                  <li key={r.name}>
                    <b>{r.name}</b> &mdash; up to {r.seats} guests{r.note ? `. ${r.note}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cream">
        <div className="wrap">
          <div className="sec-head">
            <Ornament />
            <h2>What it costs</h2>
            <p>
              Plated dinner, per guest, from the {site.banquets.packetDate} packet. A{" "}
              {site.banquets.serviceChargePct}% service charge is added to food and beverage on all
              private events.
            </p>
          </div>

          <div className="grid g3">
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
            Breakfast from $15, lunch from $19, buffets and hors d&rsquo;oeuvres priced separately.
            Bar packages need a 75-guest minimum.
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
                {money(site.banquets.venueFee.sunThu)} Sunday through Thursday,{" "}
                {money(site.banquets.venueFee.fri)} Friday and {money(site.banquets.venueFee.sat)} Saturday.
              </p>
              <p style={{ marginTop: 26 }}>
                <a className="btn ghost on-dark" href={site.family.venue.url}>Visit 19 Zero 9</a>
              </p>
            </div>
            <div>
              <Image
                src="/assets/schulers/banquets-banner.webp"
                alt="Venue 19 Zero 9 set for a reception"
                width={1600} height={635}
                sizes="(max-width: 860px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap narrow" style={{ textAlign: "center" }}>
          <Ornament />
          <h2 style={{ fontSize: "clamp(26px, 3.4vw, 38px)", marginTop: 18 }}>Start a conversation</h2>
          <p style={{ marginTop: 16, color: "var(--muted)" }}>
            Tell us the date and roughly how many people, and Elizabeth will come back with the
            rooms that fit and what they cost.
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn" href="/contact?about=events">Ask about a date</Link>
            <a className="btn ghost" href={`tel:${site.salesPhone.tel}`}>{site.salesPhone.display}</a>
          </div>
        </div>
      </section>
    </>
  );
}
