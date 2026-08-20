"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { orderableItems, money } from "@/lib/menu";
import { site } from "@/lib/site";

/**
 * Jelly, the ordering system, running in demo mode.
 *
 * Two rules govern everything on this screen.
 *
 * 1. A guest-facing ordering page never carries the business model. There is no
 *    fee-split story here, nothing about who the middleman is, nothing about
 *    what this saves the restaurant. A guest gets a menu, a pickup time, and a
 *    plainly labeled fee, the same as any checkout they have ever used. That
 *    argument belongs in the owner's proposal and nowhere else.
 *
 * 2. It does not pretend. Nothing here takes a card or sends an order, so it
 *    says so once, plainly, at the top. A stub that waits half a second and
 *    says "Thanks, we got it" while sending nowhere is the one behaviour that
 *    is not acceptable.
 *
 * Times are computed in the browser after mount rather than on the server. A
 * page whose content depends on the current time cannot be statically
 * generated: `new Date()` at build time freezes, and it would offer a pickup
 * slot from whenever the deploy ran.
 */

const pad = (n) => String(n).padStart(2, "0");
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const label = (mins) => {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h24 >= 12 ? "pm" : "am";
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${pad(m)}${ampm}`;
};

function buildSlots() {
  const { firstSlot, lastSlot, intervalMinutes } = site.pickup;
  const out = [];
  for (let t = toMinutes(firstSlot); t <= toMinutes(lastSlot); t += intervalMinutes) out.push(t);
  return out;
}

export default function OrderClient() {
  const all = useMemo(() => orderableItems(), []);
  const sections = useMemo(() => {
    const map = new Map();
    for (const it of all) {
      if (!map.has(it.sectionId)) map.set(it.sectionId, { id: it.sectionId, name: it.section, items: [] });
      map.get(it.sectionId).items.push(it);
    }
    return Array.from(map.values());
  }, [all]);

  const [cart, setCart] = useState({});      // id -> qty
  const [slot, setSlot] = useState(null);    // minutes past midnight
  const [nowMins, setNowMins] = useState(null);
  const [placed, setPlaced] = useState(false);

  // Runs only in the browser, so the rendered markup matches on both sides and
  // the earliest slot is relative to when the guest is actually standing there.
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNowMins(d.getHours() * 60 + d.getMinutes());
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const slots = useMemo(buildSlots, []);
  const earliest = nowMins === null ? null : nowMins + site.pickup.leadMinutes;

  const lines = Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => {
      const item = all.find((i) => i.id === id);
      return item ? { ...item, qty } : null;
    })
    .filter(Boolean);

  const subtotal = lines.reduce((s, l) => s + l.orderPrice * l.qty, 0);
  const tax = subtotal * site.ordering.taxRate;
  const fee = lines.length ? site.ordering.serviceFee : 0;
  const total = subtotal + tax + fee;

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));

  if (placed) {
    return (
      <section>
        <div className="wrap narrow" style={{ textAlign: "center", paddingTop: 20 }}>
          <p className="eyebrow">Demo only</p>
          {/* h2, not h1. The page banner above this already owns the h1, and two
              of them on one document is a worse outline than a smaller heading. */}
          <h2 style={{ fontSize: "clamp(30px, 4vw, 44px)", marginTop: 14 }}>
            This is where the order would go in.
          </h2>
          <p style={{ marginTop: 18, color: "var(--muted)" }}>
            On the live site this screen confirms the order, emails a receipt, and prints the
            ticket on the kitchen printer with the pickup time on it. Nothing was charged and
            nothing was sent, because this is a concept build.
          </p>
          <div style={{ marginTop: 30, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn" type="button" onClick={() => { setPlaced(false); setCart({}); setSlot(null); }}>
              Start over
            </button>
            <Link className="btn ghost" href="/menu">Back to the menu</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="wrap">
        <div className="demo-flag">
          <b>Concept build.</b> The ordering below works end to end except for the card. Nothing is
          charged, and no order reaches the kitchen.
        </div>

        <div className="order-layout">
          <div>
            <div className="pickup">
              <label id="pickup-label" htmlFor="pickup-select">Pickup time</label>
              {nowMins === null ? (
                <p style={{ fontSize: 15, color: "var(--muted)" }}>
                  Pickup times load in a moment. If they do not, call{" "}
                  <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a> and the kitchen will
                  take the order.
                </p>
              ) : (
                <>
                  <select
                    id="pickup-select"
                    value={slot ?? ""}
                    onChange={(e) => setSlot(e.target.value === "" ? null : Number(e.target.value))}
                  >
                    <option value="">Choose a time</option>
                    {slots.map((t) => (
                      <option key={t} value={t} disabled={t < earliest}>
                        {label(t)}{t < earliest ? " (too soon)" : ""}
                      </option>
                    ))}
                  </select>
                  <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 9 }}>
                    The kitchen needs about {site.pickup.leadMinutes} minutes. Everything on this
                    page is available today.
                  </p>
                </>
              )}
            </div>

            {sections.map((sec) => (
              <div key={sec.id} style={{ marginBottom: 34 }}>
                <h2 style={{ fontSize: 26, marginBottom: 6 }}>{sec.name}</h2>
                {sec.items.map((it) => (
                  <article className="oitem" key={it.id}>
                    <div className="oitem-main">
                      <h3>{it.name}</h3>
                      {it.desc ? <p>{it.desc}</p> : null}
                      {it.orderUnit ? (
                        <p style={{ fontSize: 13, color: "var(--green)", fontWeight: 700 }}>
                          {it.orderUnit}
                        </p>
                      ) : null}
                    </div>
                    <div className="oitem-add">
                      <span className="oitem-price">{money(it.orderPrice)}</span>
                      {cart[it.id] ? (
                        <span className="qty">
                          <button type="button" onClick={() => dec(it.id)} aria-label={`Remove one ${it.name}`}>&minus;</button>
                          <span aria-live="polite" aria-label={`${cart[it.id]} in order`}>{cart[it.id]}</span>
                          <button type="button" onClick={() => add(it.id)} aria-label={`Add another ${it.name}`}>+</button>
                        </span>
                      ) : (
                        <button className="btn sm ghost" type="button" onClick={() => add(it.id)}>
                          Add<span className="sr-only"> {it.name}</span>
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>

          <aside className="cart" aria-label="Your order">
            <h2>Your order</h2>
            {!lines.length ? (
              <p className="empty">Nothing in it yet. Add something from the menu.</p>
            ) : (
              <>
                <div>
                  {lines.map((l) => (
                    <div className="cart-line" key={l.id}>
                      <span className="cl-name">
                        {l.qty} &times; {l.name}
                        {l.orderUnit ? <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{l.orderUnit}</span> : null}
                      </span>
                      <span className="cl-price">{money(l.orderPrice * l.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="cart-totals">
                  <div><span>Subtotal</span><span className="num">{money(subtotal)}</span></div>
                  <div><span>Sales tax</span><span className="num">{money(tax)}</span></div>
                  <div><span>Service fee</span><span className="num">{money(fee)}</span></div>
                  <div className="total"><span>Total</span><span className="num">{money(total)}</span></div>
                </div>
              </>
            )}

            <button
              className="btn"
              type="button"
              disabled={!lines.length || slot === null}
              onClick={() => setPlaced(true)}
            >
              {slot === null && lines.length ? "Choose a pickup time" : "Place the order"}
            </button>

            <p className="cart-note">
              {slot !== null && lines.length
                ? `Ready at ${label(slot)} at ${site.address.street}.`
                : `Pickup at ${site.address.street}, ${site.address.city}.`}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
