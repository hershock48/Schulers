import Link from "next/link";
import { menu, money } from "@/lib/menu";
import { site, SITE_URL } from "@/lib/site";
import { Ornament } from "@/components/Ornament";

export const metadata = {
  title: "Menu",
  description:
    "The full Schuler's menu: prime rib in the English tradition, Winston's Pub favorites, Swiss onion soup, and the barbecue meatballs. Marshall, Michigan.",
  alternates: { canonical: "/menu" },
  // Overriding openGraph replaces the parent's block wholesale, image included,
  // so the image is restated here rather than inherited.
  openGraph: {
    title: "Menu | Schuler's Restaurant & Pub",
    description: "Prime rib, pub favorites and the Swiss onion soup. Marshall, Michigan, since 1909.",
    url: "/menu",
    images: [{ url: "/assets/schulers/food-primerib.webp", width: 426, height: 284, alt: "Schuler's roast prime rib of beef" }],
  },
};

/** Menu schema. Their live site publishes 43 indexable menu-item pages and none of this. */
function menuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${SITE_URL}/menu#menu`,
    name: `${site.name} Menu`,
    inLanguage: "en-US",
    hasMenuSection: menu.map((sec) => ({
      "@type": "MenuSection",
      name: sec.name,
      hasMenuItem: sec.items.map((it) => ({
        "@type": "MenuItem",
        name: it.name,
        ...(it.desc ? { description: it.desc } : {}),
        offers: { "@type": "Offer", price: it.price.toFixed(2), priceCurrency: "USD" },
      })),
    })),
  };
}

export default function MenuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema()) }} />

      <div className="banner">
        <div className="wrap">
          <p className="eyebrow on-dark">Served daily, 11:30am to 9:00pm</p>
          <h1>The Menu</h1>
          <p>
            The same kitchen cooks the dining room and the pub. Anything with a carryout price
            travels, and all of it can be ordered ahead.
          </p>
          <p style={{ marginTop: 24 }}>
            <Link className="btn on-dark" href="/order">Order Online</Link>
          </p>
        </div>
      </div>

      <nav className="menu-nav" aria-label="Menu sections">
        <ul>
          {menu.map((sec) => (
            <li key={sec.id}><a href={`#${sec.id}`}>{sec.name}</a></li>
          ))}
        </ul>
      </nav>

      <section>
        <div className="wrap narrow">
          {menu.map((sec) => (
            <div className="msec" id={sec.id} key={sec.id}>
              <div className="msec-head">
                <Ornament width={132} />
                <h2>{sec.name}</h2>
                {sec.blurb ? <p>{sec.blurb}</p> : null}
              </div>

              <div className="mlist">
                {sec.items.map((it) => (
                  <article className="mrow" key={it.id}>
                    <div className="mrow-top">
                      <h3 className="mrow-name">{it.name}</h3>
                      <span className="mrow-dots" aria-hidden="true" />
                      <span className="mrow-price">{money(it.price)}</span>
                    </div>
                    {it.unit ? <span className="mrow-unit">{it.unit}</span> : null}
                    {it.desc ? <p className="mrow-desc">{it.desc}</p> : null}
                    {it.carryout ? (
                      <p className="mrow-carry">
                        Carryout: {money(it.carryout.price)} per {it.carryout.unit}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ))}

          <div className="notice">
            Consuming raw or undercooked meats, poultry, seafood, shellfish or eggs may increase
            your risk of foodborne illness. Tell your server about any allergy and the kitchen will
            work with you.
          </div>
        </div>
      </section>

      <section className="cream tight">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px, 3.2vw, 34px)" }}>Take it with you</h2>
          <p style={{ margin: "14px auto 26px", maxWidth: 520, color: "var(--muted)" }}>
            Order any of it on your phone, pay before you leave, and pick a time.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn" href="/order">Order Online</Link>
            <Link className="btn ghost" href="/carryout">Carryout menu and prices</Link>
          </div>
        </div>
      </section>
    </>
  );
}
