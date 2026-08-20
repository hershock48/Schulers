import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { Ornament } from "@/components/Ornament";

export const metadata = {
  title: "Our History",
  description:
    "A cigar store in 1909, a restaurant people drove across Michigan for, and four generations on Eagle Street in Marshall. The story of Schuler's.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Our History | Schuler's Restaurant & Pub",
    description: "A cigar store in 1909, and four generations on Eagle Street since.",
    url: "/about",
    images: [{ url: "/assets/schulers/historical.webp", width: 1080, height: 837, alt: "Schuler's on Eagle Street, early twentieth century" }],
  },
};

export default function About() {
  return (
    <>
      <div className="banner">
        <div className="wrap">
          <p className="eyebrow on-dark">Marshall, Michigan</p>
          <h1>Since {site.since}</h1>
          <p>One family, one street corner, and a hundred and seventeen years of dinner.</p>
        </div>
      </div>

      <section>
        <div className="wrap narrow">
          <p style={{ fontSize: 20, lineHeight: 1.65 }}>
            Albert Schuler bought a small shop on Eagle Street in {site.since}. It sold cigars. It
            also sold food to the people who were already standing in it, and that turned out to be
            the better business.
          </p>
          <p style={{ marginTop: 20, color: "var(--muted)" }}>
            In 1924 the family took over the Royal Hotel and restaurant next door and put their name
            on it. Albert&rsquo;s son Win ran it for most of the century that followed and made it the
            kind of place people drove across the state for, on a reputation built on prime rib, a
            cheese spread, and knowing everybody&rsquo;s name. Win&rsquo;s son Hans took it on in his turn,
            started here at eight years old, and was named National Restaurateur of the Year in 2012.
          </p>
          <p style={{ marginTop: 20, color: "var(--muted)" }}>
            Hans handed the business to Sue Damron in 2019, after she had already spent more than
            twenty years in the building. It was the first time in a century the name over the door
            and the name on the deed were different. The recipes did not change hands. The keys did.
          </p>

          <div style={{ margin: "44px 0" }}>
            <Ornament className="orn draw" />
          </div>

          <Image
            src="/assets/schulers/historical.webp"
            alt="The Royal Hotel and Schuler's on Eagle Street in the early twentieth century"
            width={1080}
            height={837}
            sizes="(max-width: 800px) 100vw, 760px"
            style={{ borderRadius: "var(--radius)" }}
          />
          <p style={{ marginTop: 12, fontSize: 14, color: "var(--muted)" }}>
            The Royal Hotel and Schuler&rsquo;s, Eagle Street, Marshall.
          </p>
        </div>
      </section>

      <section className="dark">
        <div className="wrap narrow">
          <p className="eyebrow on-dark">What stayed</p>
          <h2 style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 14 }}>
            The prime rib is still cut in the English tradition.
          </h2>
          <ul className="facts" style={{ marginTop: 26 }}>
            <li>The barbecue meatballs, which people still order by the pint to take home.</li>
            <li>Swiss onion soup with dark beer, Swiss and Parmesan.</li>
            <li>The Schuler Salad, unchanged, with the creamy garlic dressing.</li>
            <li>The Pecan Ball, which is vanilla ice cream, roasted pecans and hot fudge, and which nobody has been allowed to take off the menu.</li>
          </ul>
        </div>
      </section>

      <section className="cream">
        <div className="wrap">
          <div className="sec-head">
            <Ornament className="orn draw" />
            <h2>What grew</h2>
            <p>
              The block did not stay one building. Four places now, all run out of the same kitchen.
            </p>
          </div>
          <div className="grid g3 stagger">
            <article className="card">
              <div className="card-body">
                <h3>{site.family.hotel.name}</h3>
                <p>{site.family.hotel.blurb}</p>
                <p className="card-link"><Link href="/hotel">Stay the night</Link></p>
              </div>
            </article>
            <article className="card">
              <div className="card-body">
                <h3>{site.family.venue.name}</h3>
                <p>{site.family.venue.blurb}</p>
                <p className="card-link"><a href={site.family.venue.url}>Visit 19 Zero 9</a></p>
              </div>
            </article>
            <article className="card">
              <div className="card-body">
                <h3>{site.family.hydeAway.name}</h3>
                <p>{site.family.hydeAway.blurb}</p>
                <p className="card-link"><a href={site.family.hydeAway.url}>See Hyde Away</a></p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
