import Link from "next/link";
import { events } from "@/lib/events";
import { site } from "@/lib/site";
import { Ornament } from "@/components/Ornament";

export const metadata = {
  title: "Events",
  description:
    "Wine dinners, holiday service and Home Tour weekend at Schuler's in Marshall, Michigan. What is coming up and how to get a seat.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Events | Schuler's Restaurant & Pub",
    description: "Wine dinners, holiday service and Home Tour weekend.",
    url: "/events",
    images: [{ url: "/assets/schulers/room-signature.webp", width: 600, height: 400, alt: "A private room set for dinner at Schuler's" }],
  },
};

/* Content depends on today's date, so it renders per request. A page like this
   cannot be statically generated or revalidated on a timer: regeneration is
   request-triggered, so on a quiet week the cached page ages indefinitely and
   starts advertising an event that already happened. */
export const dynamic = "force-dynamic";

export default function Events() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <div className="banner">
        <div className="wrap">
          <p className="eyebrow on-dark">What is coming up</p>
          <h1>Events</h1>
          <p>Wine dinners, holiday service, and the weekend the whole town fills up.</p>
        </div>
      </div>

      <section>
        <div className="wrap narrow">
          {upcoming.length === 0 ? (
            <div className="notice">
              Nothing on the calendar this minute. The next one usually goes up a few weeks out, and
              it always reaches <a href={site.social.facebook}>Facebook</a> first.
            </div>
          ) : (
            upcoming.map((e) => (
              <article key={e.id} style={{ padding: "30px 0", borderBottom: "1px solid var(--line)" }}>
                <p className="eyebrow">{e.dateLabel}</p>
                <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", marginTop: 10 }}>{e.title}</h2>
                <p style={{ marginTop: 12, color: "var(--muted)" }}>{e.blurb}</p>
                <p style={{ marginTop: 18 }}>
                  <Link className="btn sm ghost" href={e.cta.href}>{e.cta.label}</Link>
                </p>
              </article>
            ))
          )}

          <div className="notice" style={{ marginTop: 40 }}>
            Private party, rehearsal dinner or a room for twenty? That is the{" "}
            <Link href="/banquets">banquets</Link> side of the house.
          </div>
        </div>
      </section>

      <section className="cream tight">
        <div className="wrap narrow" style={{ textAlign: "center" }}>
          <Ornament className="orn draw" />
          <p style={{ marginTop: 18, color: "var(--muted)" }}>
            Wine dinners fill from the mailing list. Ask a server to put you on it, or send us a
            note and we will.
          </p>
          <p style={{ marginTop: 22 }}>
            <Link className="btn" href="/contact">Get on the list</Link>
          </p>
        </div>
      </section>
    </>
  );
}
