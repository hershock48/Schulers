import { Suspense } from "react";
import ReservationForm from "@/components/ReservationForm";
import { site } from "@/lib/site";

export const metadata = {
  title: "Reservations",
  description:
    "Book a table at Schuler's in Marshall, Michigan. Pick a date, a party size and a time, and get a confirmation straight away.",
  alternates: { canonical: "/reservations" },
  openGraph: {
    title: "Reservations | Schuler's Restaurant & Pub",
    description: "Book a table in about thirty seconds.",
    url: "/reservations",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Schuler's Restaurant & Pub, Marshall, Michigan, since 1909" }],
  },
};

export const dynamic = "force-dynamic";

export default function Reservations() {
  return (
    <>
      <div className="banner">
        <div className="wrap">
          <p className="eyebrow on-dark">{site.hoursShort}</p>
          <h1>Book a Table</h1>
          <p>Pick a time, leave with it confirmed. No form that disappears into an inbox.</p>
        </div>
      </div>

      <section>
        <div className="wrap narrow">
          <Suspense fallback={<p style={{ color: "var(--muted)" }}>Loading the book&hellip;</p>}>
            <ReservationForm />
          </Suspense>

          <div className="notice" style={{ marginTop: 34 }}>
            Prefer the phone, or booking for tonight in the next hour? Call{" "}
            <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a> and somebody in the building
            will answer.
          </div>
        </div>
      </section>
    </>
  );
}
