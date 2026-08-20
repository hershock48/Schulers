import { site } from "@/lib/site";
import ContactForm from "@/components/ContactForm";
import { Ornament } from "@/components/Ornament";

export const metadata = {
  title: "Contact",
  description:
    "Schuler's Restaurant & Pub, 115 S. Eagle Street, Marshall, Michigan. Hours, phone, directions and the events office.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Schuler's Restaurant & Pub",
    description: "115 S. Eagle Street, Marshall, Michigan. Open daily.",
    url: "/contact",
    images: [{ url: "/assets/schulers/building-front.webp", width: 1024, height: 865, alt: "Schuler's on Eagle Street" }],
  },
};

export default function Contact() {
  return (
    <>
      <div className="banner">
        <div className="wrap">
          <p className="eyebrow on-dark">{site.address.city}, {site.address.region}</p>
          <h1>Find Us</h1>
          <p>{site.address.street}, on the corner, with the sign you cannot miss.</p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="split">
            <div>
              <h2>The restaurant</h2>
              <ul className="facts">
                <li>{site.address.street}, {site.address.city}, {site.address.region} {site.address.postal}</li>
                <li><a href={`tel:${site.phone.tel}`}>{site.phone.display}</a> for reservations and carryout</li>
                <li>{site.hoursShort}</li>
              </ul>

              <h2 style={{ marginTop: 40 }}>Events and banquets</h2>
              <ul className="facts">
                <li><a href={`tel:${site.salesPhone.tel}`}>{site.salesPhone.display}</a></li>
                <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              </ul>

              <p style={{ marginTop: 34 }}>
                <a
                  className="btn ghost"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${site.name}, ${site.address.street}, ${site.address.city}, ${site.address.region}`
                  )}`}
                >
                  Get directions
                </a>
              </p>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="cream tight">
        <div className="wrap" style={{ textAlign: "center" }}>
          <Ornament className="orn draw" />
        </div>
      </section>
    </>
  );
}
