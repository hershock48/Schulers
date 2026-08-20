import Image from "next/image";
import { site } from "@/lib/site";
import { Ornament } from "@/components/Ornament";

export const metadata = {
  title: "The Royal Hotel",
  description:
    "Eight rooms in two restored buildings in downtown Marshall, above Schuler's and inside Venue 19 Zero 9. The first rooms upstairs in more than fifty years.",
  alternates: { canonical: "/hotel" },
  openGraph: {
    title: "The Royal Hotel | Schuler's Restaurant & Pub",
    description: "Eight rooms in downtown Marshall, upstairs from dinner.",
    url: "/hotel",
    images: [{ url: "/assets/schulers/hotel-suite.webp", width: 1200, height: 798, alt: "A guest room at The Royal Hotel" }],
  },
};

/* Room names and square footage are the hotel site's own, and the photographs
   are the ones their photographer shot: each frame is the room door with its
   name plate, which is why the captions can be trusted to match the pictures. */
const ROOMS = [
  { slug: "eagle", name: "Eagle", sqft: 309 },
  { slug: "mansion", name: "Mansion", sqft: 286 },
  { slug: "grand-suite", name: "Grand Suite", sqft: 366 },
  { slug: "hamilton", name: "Hamilton", sqft: 192 },
  { slug: "jefferson", name: "Jefferson", sqft: 340 },
];

export default function Hotel() {
  return (
    <>
      <div className="banner">
        <div className="wrap">
          <p className="eyebrow on-dark">Upstairs from dinner</p>
          <h1>The Royal Hotel</h1>
          <p>
            {site.family.hotel.rooms} rooms across two restored buildings a block apart. Five above
            the restaurant, three inside Venue 19 Zero 9.
          </p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="split">
            <div>
              <Image
                src="/assets/schulers/hotel-suite.webp"
                alt="A guest room at The Royal Hotel"
                width={1200} height={798}
                sizes="(max-width: 860px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2>Rooms above a hundred-year-old dining room</h2>
              <p>
                The Royal Hotel operated on this corner until the 1970s. The rooms came back in
                2023, restored rather than rebuilt, and they are still the shortest walk to a table
                in Marshall.
              </p>
              <ul className="facts">
                <li>Five rooms above Schuler&rsquo;s: Eagle, Mansion, Grand Suite, Hamilton and Jefferson</li>
                <li>Three more inside Venue 19 Zero 9, each with a kitchenette</li>
                <li>Two guests per room</li>
                <li>One flight of stairs, and no elevator in either building</li>
              </ul>
              <p style={{ marginTop: 28 }}>
                <a className="btn" href={site.family.hotel.url}>See rooms and rates</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cream">
        <div className="wrap">
          <div className="sec-head">
            <Ornament />
            <h2>The five above the restaurant</h2>
            <p>Each named for the building or the street it looks out on.</p>
          </div>
          <div className="gallery">
            {ROOMS.map((r) => (
              <figure key={r.slug} style={{ margin: 0 }}>
                <Image
                  src={`/assets/schulers/room-${r.slug}.webp`}
                  alt={`The ${r.name} room at The Royal Hotel`}
                  width={1600} height={1067}
                  sizes="(max-width: 760px) 50vw, 33vw"
                />
                <figcaption style={{ marginTop: 8, fontSize: 14, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--green)" }}>
                  {r.name} &middot; {r.sqft} sq ft
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="tight">
        <div className="wrap narrow" style={{ textAlign: "center" }}>
          <Ornament />
          <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", marginTop: 16 }}>Also in the family</h2>
          <p style={{ marginTop: 14, color: "var(--muted)" }}>
            {site.family.hydeAway.name}: {site.family.hydeAway.blurb.toLowerCase()}
          </p>
          <p style={{ marginTop: 22 }}>
            <a className="btn ghost" href={site.family.hydeAway.url}>See Hyde Away</a>
          </p>
        </div>
      </section>
    </>
  );
}
