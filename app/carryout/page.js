import Link from "next/link";
import { menu, money } from "@/lib/menu";
import { site } from "@/lib/site";
import { Ornament } from "@/components/Ornament";

export const metadata = {
  title: "Carryout Menu",
  description:
    "Everything Schuler's sends out the door, with carryout prices. Soups by the pint, the full pub menu, prime rib and the barbecue meatballs. Marshall, Michigan.",
  alternates: { canonical: "/carryout" },
  openGraph: {
    title: "Carryout Menu | Schuler's Restaurant & Pub",
    description: "Everything that travels, with the prices it travels at.",
    url: "/carryout",
    images: [{ url: "/assets/schulers/food-brisket-mac.webp", width: 1000, height: 667, alt: "Carryout from Schuler's" }],
  },
};

export default function Carryout() {
  const sections = menu
    .map((s) => ({ ...s, items: s.items.filter((i) => i.orderable) }))
    .filter((s) => s.items.length);

  return (
    <>
      <div className="banner">
        <div className="wrap">
          <p className="eyebrow on-dark">Ready at the door</p>
          <h1>Carryout</h1>
          <p>
            Soups go by the pint, the meatballs go by the pint, and everything else goes the way it
            comes to the table. Order it online and pick a time.
          </p>
          <p style={{ marginTop: 24 }}>
            <Link className="btn on-dark" href="/order">Order Online</Link>
          </p>
        </div>
      </div>

      <section>
        <div className="wrap narrow">
          {sections.map((sec) => (
            <div className="msec" id={sec.id} key={sec.id}>
              <div className="msec-head">
                <Ornament width={132} />
                <h2>{sec.name}</h2>
              </div>
              <div className="mlist">
                {sec.items.map((it) => {
                  const price = it.carryout ? it.carryout.price : it.price;
                  const unit = it.carryout ? it.carryout.unit : it.unit;
                  return (
                    <article className="mrow" key={it.id}>
                      <div className="mrow-top">
                        <h3 className="mrow-name">{it.name}</h3>
                        <span className="mrow-dots" aria-hidden="true" />
                        <span className="mrow-price">{money(price)}</span>
                      </div>
                      {unit ? <span className="mrow-unit">{unit}</span> : null}
                      {it.desc ? <p className="mrow-desc">{it.desc}</p> : null}
                    </article>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="notice">
            Rather talk to somebody? Call <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>{" "}
            and the kitchen will take your order. {site.hoursShort}.
          </div>
        </div>
      </section>
    </>
  );
}
