import { Bodoni_Moda, Karla } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { site, SITE_URL } from "@/lib/site";
import "./globals.css";

/**
 * Self-hosted at build time. next/font/google downloads the files during the
 * build and serves them from this site's own origin, so there is no runtime
 * request to Google and nothing breaks if Google does. A runtime <link> to a
 * font CDN would be a third-party dependency the client did not choose.
 *
 * Bodoni Moda is a didone, which is the letterform on nearly every American
 * bill of fare printed the decade Schuler's opened. Karla underneath it keeps
 * the small text legible, which a didone at 15px does not.
 */
const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const body = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-body",
});

/**
 * Absolute-URL base for canonicals and OG images.
 *
 * It defaults to their real domain, which is correct the day this launches:
 * pointing metadataBase at a preview host makes every canonical advertise a
 * duplicate of the site as the original.
 *
 * But while this is a pitch it is served from schulers.glazedweb.com/demo, and
 * a metadataBase of schulersrestaurant.com makes every og:image an absolute URL
 * on a domain that does not serve this build. The images 404 and the link
 * preview comes back blank, which is exactly the moment it matters: when Kevin
 * texts the link to an owner.
 *
 * So: set NEXT_PUBLIC_SITE_ORIGIN=https://schulers.glazedweb.com in Vercel for
 * the pitch, and DELETE that variable on launch day. Everything on the pitch
 * host is noindex, so a canonical pointing at the pitch host costs nothing
 * while it is set.
 */
const ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || SITE_URL;

export const metadata = {
  metadataBase: new URL(ORIGIN),
  title: {
    default: "Schuler's Restaurant & Pub | Marshall, Michigan since 1909",
    template: "%s | Schuler's Restaurant & Pub",
  },
  description:
    "Prime rib in the English tradition, Winston's Pub, and private events in downtown Marshall, Michigan. Serving since 1909. Book a table or order ahead.",
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: "/",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Schuler's Restaurant & Pub, Marshall, Michigan, since 1909" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/assets/schulers/favicon-180.png", apple: "/assets/schulers/favicon-180.png" },
};

export const viewport = { themeColor: "#8A1E00" };

/**
 * Restaurant schema, which their live site has none of. Their own contact page
 * publishes the address, the phone and the hours as plain text; this is the
 * same facts where a search engine can read them, generated from lib/site.js so
 * it cannot drift from the page.
 */
function schema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: site.name,
    url: SITE_URL,
    telephone: site.phone.display,
    email: site.email,
    servesCuisine: ["American", "Steakhouse", "Seafood"],
    priceRange: "$$$",
    foundingDate: String(site.since),
    image: `${SITE_URL}/assets/schulers/building-front.webp`,
    logo: `${SITE_URL}/assets/schulers/logo.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postal,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.address.lat, longitude: site.address.lng },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "11:30",
        closes: "21:00",
      },
    ],
    acceptsReservations: `${SITE_URL}/reservations`,
    hasMenu: `${SITE_URL}/menu`,
    sameAs: [site.social.facebook, site.social.instagram],
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema()) }}
        />
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Reveal />
      </body>
    </html>
  );
}
