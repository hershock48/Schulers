import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import GlazedPlate from "@/components/GlazedPlate";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-logo">
              <Image src="/assets/schulers/logo.webp" alt="" width={336} height={173} sizes="168px" />
            </div>
            <p className="foot-blurb">
              Serving Marshall since {site.since}. Prime rib in the English tradition, Winston&rsquo;s
              Pub, and a room upstairs when you would rather not drive home.
            </p>
          </div>

          <div>
            <h3>Visit</h3>
            <ul>
              <li>{site.address.street}</li>
              <li>{site.address.city}, {site.address.region} {site.address.postal}</li>
              <li><a href={`tel:${site.phone.tel}`}>{site.phone.display}</a></li>
              <li>{site.hoursShort}</li>
            </ul>
          </div>

          <div>
            <h3>Eat and Drink</h3>
            <ul>
              <li><Link href="/menu">Menu</Link></li>
              <li><Link href="/carryout">Carryout</Link></li>
              <li><Link href="/order">Order Online</Link></li>
              <li><Link href="/reservations">Reservations</Link></li>
              <li><Link href="/shop">Shop</Link></li>
            </ul>
          </div>

          <div>
            <h3>The Family</h3>
            <ul>
              <li><Link href="/banquets">Banquets and Events</Link></li>
              <li><Link href="/hotel">The Royal Hotel</Link></li>
              <li><a href={site.family.venue.url}>Venue 19 Zero 9</a></li>
              <li><a href={site.family.hydeAway.url}>Hyde Away</a></li>
              <li><a href={site.social.facebook}>Facebook</a></li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <span>&copy; {site.since}&ndash;2026 {site.name}. All rights reserved.</span>
          <span>
            <Link href="/contact">Contact</Link> &nbsp;&middot;&nbsp; <a href={`tel:${site.salesPhone.tel}`}>Events: {site.salesPhone.display}</a>
          </span>
        </div>
      </div>
      {/* "Double Dipped by" is the house default. brand.md reserves "Concept build
          by" for a spec build that has not been bought, which this is, but Kevin
          has overridden that line twice now (True North was the first), so the
          doc is what needs correcting, not this footer. */}
      <GlazedPlate line="Double Dipped by" />
    </footer>
  );
}
