"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { money } from "@/lib/menu";

/**
 * Gift cards, emailed.
 *
 * The proposal attacks their mailed-only gift card, so this has to be a real
 * purchase flow rather than a link to a contact form. Everything here works
 * except taking the card: amount, recipient, sender, message, and a delivery
 * date are all collected and validated, which is the whole mechanism. Wiring
 * Stripe Checkout in front of it is the remaining step and it changes nothing
 * on this screen.
 *
 * A physical card stays available, because their existing customers buy those
 * and taking it away to prove a point would be a downgrade for the people who
 * want an envelope.
 */
const AMOUNTS = [25, 50, 100, 150, 250];

export default function GiftCardForm() {
  const [amount, setAmount] = useState(100);
  const [custom, setCustom] = useState("");
  const [when, setWhen] = useState("now");
  const [done, setDone] = useState(false);

  const value = custom !== "" ? Number(custom) : amount;
  const valid = value >= 10 && value <= 1000;

  if (done) {
    return (
      <div className="notice" role="status">
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>That would be on its way.</h2>
        <p>
          On the live site the card is emailed to your recipient in about ten seconds, with a copy
          of the receipt to you, and it is redeemable at the table or in the pub the moment it
          lands. This is a concept build, so no card was charged and nothing was sent.
        </p>
        <p style={{ marginTop: 14 }}>
          <button className="btn sm ghost" type="button" onClick={() => setDone(false)}>
            Try it again
          </button>
        </p>
      </div>
    );
  }

  return (
    <form className="form-grid" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
      <div className="demo-flag">
        <b>Concept build.</b> Everything here works except the card. Nothing is charged and no gift
        card is sent.
      </div>

      <fieldset style={{ border: 0 }}>
        <legend className="eyebrow" style={{ marginBottom: 10 }}>Amount</legend>
        <div className="slots">
          {AMOUNTS.map((a) => (
            <button
              key={a} type="button" className="slot"
              aria-pressed={custom === "" && amount === a}
              onClick={() => { setAmount(a); setCustom(""); }}
            >
              {money(a)}
            </button>
          ))}
        </div>
        <div className="field" style={{ marginTop: 14, maxWidth: 260 }}>
          <label htmlFor="gc-custom">Or another amount</label>
          <input
            id="gc-custom" type="number" min="10" max="1000" step="5" placeholder="$"
            value={custom} onChange={(e) => setCustom(e.target.value)}
          />
          {custom !== "" && !valid ? (
            <p className="hint" style={{ color: "var(--ox)" }}>Between $10 and $1,000.</p>
          ) : null}
        </div>
      </fieldset>

      <div className="form-row">
        <div className="field">
          <label htmlFor="gc-to">Recipient&rsquo;s name <span className="req" aria-hidden="true">*</span></label>
          <input id="gc-to" type="text" required autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="gc-to-email">Recipient&rsquo;s email <span className="req" aria-hidden="true">*</span></label>
          <input id="gc-to-email" type="email" required autoComplete="off" />
          <p className="hint">This is where the card arrives.</p>
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="gc-from">Your name <span className="req" aria-hidden="true">*</span></label>
          <input id="gc-from" type="text" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="gc-from-email">Your email <span className="req" aria-hidden="true">*</span></label>
          <input id="gc-from-email" type="email" required autoComplete="email" />
          <p className="hint">Your receipt comes here.</p>
        </div>
      </div>

      <div className="field">
        <label htmlFor="gc-msg">Message</label>
        <textarea id="gc-msg" rows={3} maxLength={300} placeholder="Happy birthday. Get the prime rib." />
      </div>

      <fieldset style={{ border: 0 }}>
        <legend className="eyebrow" style={{ marginBottom: 10 }}>When should it arrive?</legend>
        <div className="slots" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
          <button type="button" className="slot" aria-pressed={when === "now"} onClick={() => setWhen("now")}>
            Right away
          </button>
          <button type="button" className="slot" aria-pressed={when === "date"} onClick={() => setWhen("date")}>
            On a date
          </button>
        </div>
        {when === "date" ? (
          <div className="field" style={{ marginTop: 14, maxWidth: 260 }}>
            <label htmlFor="gc-date">Delivery date</label>
            <input id="gc-date" type="date" />
          </div>
        ) : null}
      </fieldset>

      <div>
        <button className="btn" type="submit" disabled={!valid}>
          Send a {money(valid ? value : 0)} gift card
        </button>
        <p className="hint" style={{ marginTop: 12 }}>
          Rather have a physical card in an envelope? Call{" "}
          <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a> and we will mail one.
        </p>
      </div>
    </form>
  );
}
