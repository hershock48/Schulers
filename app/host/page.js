import HostBook from "@/components/HostBook";

export const metadata = {
  title: "Tonight's Book",
  description:
    "The host stand view of tonight's reservations: covers by half hour, party sizes, notes, and the ceiling that closes a time to online booking.",
  alternates: { canonical: "/host" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Tonight's Book | Schuler's Restaurant & Pub",
    description: "The host stand view of tonight's reservations.",
    url: "/host",
    images: [{ url: "/assets/schulers/building-front.webp", width: 1024, height: 865, alt: "Schuler's on Eagle Street" }],
  },
};

export const dynamic = "force-dynamic";

export default function Host() {
  return (
    <>
      <div className="banner">
        <div className="wrap">
          <p className="eyebrow on-dark">Staff view</p>
          <h1>Tonight&rsquo;s Book</h1>
          <p>
            What the host stand sees. Works on a tablet at the podium or a phone in an apron.
          </p>
        </div>
      </div>
      <section>
        <div className="wrap narrow">
          <HostBook />
        </div>
      </section>
    </>
  );
}
