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
    images: [{ url: "/assets/schulers/building-front.webp", width: 1024, height: 865, alt: "Schuler's on Eagle Street in Marshall, Michigan" }],
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
          <ReservationForm />

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
