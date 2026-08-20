"use client";

import { useState } from "react";
import Image from "next/image";
import { money } from "@/lib/menu";
import { site } from "@/lib/site";

/**
 * The store, actually open.
 *
 * The proposal promises "the store, opened up" and their real constraint is
 * that Chef's Salt is theirs, keeps on a shelf, and already ships. So this has
 * to take an order, not list prices next to a phone number. Everything works
 * except the card: line items, quantities, ship-or-collect, a shipping line,
 * tax and a total.
 *
 * Prices and stock are their live WooCommerce values, read from their own
 * store API on 20 August 2026. The two items their shop lists as out of stock
 * are out of stock here too, because a store that sells you something the
 * kitchen cannot post is worse than one that says so.
 */
const GOODS = [
  { id: "salt16", name: "Chef's Salt, 16 oz", price: 10, img: "/assets/schulers/product-chefs-salt.webp",
    desc: "Kosher salt, black pepper, ground rosemary, garlic and celery seed. Sold nowhere else." },
  { id: "salt8", name: "Chef's Salt, 8 oz", price: 6, desc: "The same blend, half the tub." },
  { id: "snifter", name: "Winston's Snifter", price: 14, img: "/assets/schulers/shop-snifter.webp",
    desc: "Sixteen ounces, with the Winston's Pub mark." },
  { id: "opener", name: "Bottle Opener", price: 20, img: "/assets/schulers/shop-opener.webp",
    desc: "Cast, heavy, and older-looking than it is." },
  { id: "mug", name: "Schuler Stoneware Coffee Mug", price: 12, img: "/assets/schulers/shop-mug.webp",
    desc: "The mug the coffee comes in downstairs." },
  { id: "royalmug", name: "Royal Hotel Coffee Mug", price: 12, desc: "For the room upstairs." },
  { id: "rocks", name: "Rocks Glass", price: 8, desc: "Heavy base, short pour." },
  { id: "pewter", name: "Pewter Mug", price: 49.95, desc: "Out of stock on their shelf today.", oos: true },
  { id: "saltbox", name: "Bamboo Salt Box", price: 25, desc: "Arrives filled with Chef's Salt. Out of stock today.", oos: true },
];

const SHIP = 8.5;

export default function ShopClient() {
  const [cart, setCart] = useState({});
  const [method, setMethod] = useState("ship");
  const [done, setDone] = useState(false);

  const lines = Object.entries(cart).filter(([, q]) => q > 0)
    .map(([id, qty]) => ({ ...GOODS.find((g) => g.id === id), qty }));
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = method === "ship" && lines.length ? SHIP : 0;
  const tax = subtotal * site.ordering.taxRate;
  const total = subtotal + shipping + tax;

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));

  if (done) {
    return (
      <div className="notice" role="status">
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>That would be boxed and gone.</h2>
        <p>
          On the live site this charges the card, emails a receipt, and prints a packing slip.
          Nothing was charged and nothing was shipped, because this is a concept build.
        </p>
        <p style={{ marginTop: 14 }}>
          <button className="btn sm ghost" type="button" onClick={() => { setDone(false); setCart({}); }}>
            Start over
          </button>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="demo-flag">
        <b>Concept build.</b> The store works end to end except for the card. Prices and stock are
        their real ones, read from their shop on 20 August 2026.
      </div>

      <div className="order-layout">
        <div>
          <div className="grid g2">
            {GOODS.map((g) => (
              <article className="card" key={g.id}>
                {g.img ? (
                  <div className="card-img">
                    <Image src={g.img} alt={g.name} width={800} height={800} sizes="(max-width: 620px) 100vw, 300px" />
                  </div>
                ) : null}
                <div className="card-body">
                  <h3 style={{ fontSize: 19 }}>{g.name}</h3>
                  <p>{g.desc}</p>
                  <div className="card-link" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <span className="mrow-price">{money(g.price)}</span>
                    {g.oos ? (
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Out of stock</span>
                    ) : cart[g.id] ? (
                      <span className="qty">
                        <button type="button" onClick={() => dec(g.id)} aria-label={`Remove one ${g.name}`}>&minus;</button>
                        <span aria-live="polite">{cart[g.id]}</span>
                        <button type="button" onClick={() => add(g.id)} aria-label={`Add another ${g.name}`}>+</button>
                      </span>
                    ) : (
                      <button className="btn sm ghost" type="button" onClick={() => add(g.id)}>
                        Add<span className="sr-only"> {g.name}</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="cart" aria-label="Your basket">
          <h2>Your basket</h2>
          {!lines.length ? (
            <p className="empty">Nothing in it yet.</p>
          ) : (
            <>
              {lines.map((l) => (
                <div className="cart-line" key={l.id}>
                  <span className="cl-name">{l.qty} &times; {l.name}</span>
                  <span className="cl-price">{money(l.price * l.qty)}</span>
                </div>
              ))}
              <div style={{ marginTop: 14 }}>
                <p className="eyebrow" style={{ marginBottom: 8 }}>How should it get there?</p>
                <div className="slots" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <button type="button" className="slot" aria-pressed={method === "ship"} onClick={() => setMethod("ship")}>Ship it</button>
                  <button type="button" className="slot" aria-pressed={method === "pickup"} onClick={() => setMethod("pickup")}>Collect</button>
                </div>
              </div>
              <div className="cart-totals">
                <div><span>Subtotal</span><span className="num">{money(subtotal)}</span></div>
                <div><span>{method === "ship" ? "Shipping" : "Collection"}</span><span className="num">{shipping ? money(shipping) : "Free"}</span></div>
                <div><span>Sales tax</span><span className="num">{money(tax)}</span></div>
                <div className="total"><span>Total</span><span className="num">{money(total)}</span></div>
              </div>
            </>
          )}
          <button className="btn" type="button" disabled={!lines.length} onClick={() => setDone(true)}>
            Check out
          </button>
          <p className="cart-note">
            {method === "ship"
              ? "Ships anywhere in the continental United States, usually the next morning."
              : `Collect at ${site.address.street}, ${site.address.city}.`}
          </p>
        </aside>
      </div>
    </>
  );
}
