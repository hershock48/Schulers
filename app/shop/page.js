import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { money } from "@/lib/menu";
import { Ornament } from "@/components/Ornament";

export const metadata = {
  title: "Shop",
  description:
    "Chef's Salt, the weekly Take & Bake family meal, gift cards and Schuler's glassware, shipped anywhere in the continental United States.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop | Schuler's Restaurant & Pub",
    description: "Chef's Salt, Take & Bake, gift cards and glassware.",
    url: "/shop",
    images: [{ url: "/assets/schulers/takeandbake-spread.webp", width: 1200, height: 874, alt: "A Take and Bake family meal laid out" }],
  },
};

const goods = [
  { name: "Chef's Salt, 16 oz", price: 10, img: "/assets/schulers/product-chefs-salt.webp", alt: "A tub of Schuler's Chef's Salt", desc: "Kosher salt, black pepper, ground rosemary, garlic and celery seed. The only place on earth it is sold." },
  { name: "Chef's Salt, 8 oz", price: 6, img: null, desc: "The same blend, half the tub." },
  { name: "Winston's Snifter", price: 14, img: "/assets/schulers/shop-snifter.webp", alt: "A Winston's Pub snifter", desc: "Sixteen ounces, with the Winston's Pub mark." },
  { name: "Bottle Opener", price: 20, img: "/assets/schulers/shop-opener.webp", alt: "A Schuler's bottle opener", desc: "Cast, heavy, and older-looking than it is." },
  { name: "Stoneware Coffee Mug", price: 12, img: "/assets/schulers/shop-mug.webp", alt: "A Schuler's stoneware coffee mug", desc: "The mug the coffee comes in downstairs." },
  { name: "Schuler Pint Glass", price: 10, img: null, desc: "For the pub side of the house." },
  { name: "Rocks Glass", price: 8, img: null, desc: "Heavy base, short pour." },
  { name: "Michigan Oven Mitt", price: 14, img: null, desc: "The mitt, in the shape of the state." },
];

export default function Shop() {
  return (
    <>
      <div className="banner">
        <div className="wrap">
          <p className="eyebrow on-dark">Shipped anywhere in the lower forty-eight</p>
          <h1>The Shop</h1>
          <p>
            The Chef&rsquo;s Salt, the Wednesday family meal, a gift card, and the glass you drank
            out of last time.
          </p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="split">
            <div>
              <Image
                src="/assets/schulers/takeandbake-spread.webp"
                alt="A Take and Bake family meal laid out: salad, a pan of enchiladas, chips and salsa"
                width={1200} height={874}
                sizes="(max-width: 860px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="eyebrow">Every Wednesday</p>
              <h2>Take &amp; Bake</h2>
              <p>
                One family meal a week, made here and finished in your oven. Serves{" "}
                {site.takeAndBake.serves}, changes every week, and costs {money(site.takeAndBake.price)}.
              </p>
              <ul className="facts">
                <li>Order by {site.takeAndBake.orderBy}</li>
                <li>Pick it up {site.takeAndBake.window}</li>
                <li>Free delivery in {site.takeAndBake.deliveryTowns.join(", ")}</li>
              </ul>
              {/* PLACEHOLDER — this week's menu is written by the kitchen every
                  Monday and is not in the concept build. */}
              <div className="notice" style={{ marginTop: 24 }}>
                <b>This week:</b> the kitchen posts the menu on Monday. In the live build it lands
                here and in the same edit reaches the email list.
              </div>
              <p style={{ marginTop: 24 }}>
                <Link className="btn" href="/order">Add it to an order</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cream">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="eyebrow">Any amount</p>
              <h2>Gift cards, in the inbox</h2>
              <p>
                Bought here, delivered to whoever it is for in about ten seconds, and good at the
                table or in the pub. If you would rather send a real card in an envelope, we will
                still mail one.
              </p>
              <p style={{ marginTop: 26 }}>
                <Link className="btn" href="/contact?about=gift-card">Buy a gift card</Link>
              </p>
            </div>
            <div>
              <Image
                src="/assets/schulers/giftcards.webp"
                alt="Schuler's gift cards"
                width={1000} height={1000}
                sizes="(max-width: 860px) 100vw, 50vw"
                style={{ borderRadius: "var(--radius)" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head">
            <Ornament className="orn draw" />
            <h2>From the shelf</h2>
            <p>Ships anywhere in the continental United States, usually the next morning.</p>
          </div>

          <div className="grid g4 stagger">
            {goods.map((g) => (
              <article className="card" key={g.name}>
                {g.img ? (
                  <div className="card-img reveal-img">
                    <Image src={g.img} alt={g.alt || ""} width={800} height={800} sizes="(max-width: 620px) 100vw, 25vw" />
                  </div>
                ) : null}
                <div className="card-body">
                  <h3 style={{ fontSize: 19 }}>{g.name}</h3>
                  <p>{g.desc}</p>
                  <p className="price-tag" style={{ fontSize: 26, marginTop: 14 }}>{money(g.price)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
