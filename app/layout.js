import { Newsreader, Archivo, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ActionBar from "@/components/ActionBar";
import { site, SITE_URL } from "@/lib/site";
import "./globals.css";

/**
 * Self-hosted at build time. next/font/google downloads the files during the
 * build and serves them from this site's own origin, so there is no runtime
 * request to Google and nothing breaks if Google does. A runtime <link> to a
 * font CDN would be a third-party dependency the client did not choose.
 *
 * WHY NOT BODONI. The first build used Bodoni Moda, and it was wrong twice.
 *
 * Wrong historically: Bodoni is Neoclassical, c. 1790s, and reads French and
 * Italian fashion. Schuler's is 1909. The display types of Anglo-American
 * commercial and menu printing in that era are Scotch Romans, Clarendons and
 * fat faces, not didones. Bodoni is a full generation early for the room.
 *
 * Wrong commercially: Bodoni Moda is the free Google font every Squarespace and
 * Canva "luxury" template reaches for. A 117-year-old institution should not
 * open with the typeface of a template. A survey of Fonts In Use's hospitality
 * and menu tags for 2024-2026 turns up no Bodoni at all.
 *
 * Newsreader is a Scotch-adjacent face with a real optical-size axis, so the
 * headline weight and the 15px caption are drawn differently rather than
 * scaled. Archivo is the plain neo-grotesque underneath it, which is the
 * current hospitality formula: one characterful serif, one neutral sans.
 *
 * The mono is the third piece of that formula and the cheapest signal that this
 * site was built in 2026 rather than 2019: prices, hours, capacities and
 * allergen keys are set in it, the way a kitchen ticket or a ledger sets them.
 */
const display = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const body = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
});

/**
 * Absolute-URL base for canonicals and OG images.
 *
 * Defaults to their real domain, which is correct the day this launches:
 * pointing metadataBase at a preview host makes every canonical advertise a
 * duplicate of the site as the original.
 *
 * While this is a pitch it is served from schulers.glazedweb.com/demo, and a
 * metadataBase of schulersrestaurant.com makes every og:image an absolute URL
 * on a domain that does not serve this build. The images 404 and the link
 * preview comes back blank, which is exactly the moment it matters.
 *
 * So: set NEXT_PUBLIC_SITE_ORIGIN=https://schulers.glazedweb.com in Vercel for
 * the pitch, and DELETE it on launch day. Everything on the pitch host is
 * noindex, so a canonical pointing there costs nothing while it is set.
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
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema()) }}
        />
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ActionBar />
      </body>
    </html>
  );
}
