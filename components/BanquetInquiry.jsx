"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/**
 * The banquet inquiry the proposal promises: "reaches the right inbox with the
 * event type, date and guest count already sorted."
 *
 * Before this, /banquets sent people to the general contact form, which asked
 * for a name and a message. That is the same shape as their current form and it
 * would have been a claim with nothing behind it.
 *
 * The guest count picks the rooms that fit, from lib/site.js, so the enquiry
 * arrives already narrowed and nobody has to look a capacity up.
 */
const TYPES = ["Rehearsal dinner", "Wedding reception", "Shower", "Business lunch", "Board meeting", "Celebration of life", "Birthday or anniversary", "Something else"];

export default function BanquetInquiry() {
  const [type, setType] = useState("");
  const [guests, setGuests] = useState("");
  const [done, setDone] = useState(false);

  const n = Number(guests) || 0;

  /* seats is not a number. The packet only publishes a range for Heritage East
     ("8 to 20") and a ceiling for the combined room ("up to 120"); the other
     three rooms have no published capacity and are null on purpose. Comparing a
     guest count against that string silently matched nothing, which is exactly
     the kind of quiet wrong answer this form must not give. Parse the largest
     number out of whatever is there, and treat null as unknown rather than as
     "does not fit". */
  const ceiling = (v) => {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const nums = v.match(/\d+/g);
      if (nums) return Math.max(...nums.map(Number));
    }
    return null;
  };
  const known = site.banquetRooms.filter((r) => ceiling(r.seats) !== null);
  const fits = known.filter((r) => n > 0 && n <= ceiling(r.seats));
  const unpublished = site.banquetRooms.length - known.length;
  const overHouse = n > site.banquetMax;

  if (done) {
    return (
      <div className="notice" role="status">
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>That would be with Elizabeth.</h2>
        <p>
          On the live site this lands in the events inbox with the type, the date and the guest
          count already on it, and the rooms that fit already worked out. Nothing was sent, because
          this is a concept build.
        </p>
        <p style={{ marginTop: 14 }}>
          <button className="btn sm ghost" type="button" onClick={() => setDone(false)}>Try it again</button>
        </p>
      </div>
    );
  }

  return (
    <form className="form-grid" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
      <div className="demo-flag">
        <b>Concept build.</b> On the live site this reaches the events inbox. Here it goes nowhere.
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="bq-type">What kind of event? <span className="req" aria-hidden="true">*</span></label>
          <select id="bq-type" required value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Choose one</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="bq-date">Date, or roughly when <span className="req" aria-hidden="true">*</span></label>
          <input id="bq-date" type="date" required />
        </div>
      </div>

      <div className="field" style={{ maxWidth: 260 }}>
        <label htmlFor="bq-guests">How many guests? <span className="req" aria-hidden="true">*</span></label>
        <input id="bq-guests" type="number" min="2" max="300" required value={guests}
               onChange={(e) => setGuests(e.target.value)} />
      </div>

      {n > 0 ? (
        <div className={overHouse ? "notice warn" : "notice"}>
          {overHouse ? (
            <>
              <b>{n} guests is bigger than this building.</b> That is {site.family.venue.name} two
              blocks up, which seats {site.family.venue.capacity} and is catered by this kitchen.
            </>
          ) : fits.length ? (
            <>
              <b>Rooms that fit {n}:</b> {fits.map((r) => `${r.name} (${r.seats})`).join(", ")}.
              {unpublished > 0 ? ` ${unpublished} more rooms may also work; we will confirm.` : ""}
            </>
          ) : (
            <>
              <b>{n} guests is more than our published rooms take on their own.</b> The Heritage
              rooms open into each other, so tell us the date and we will work out the combination.
            </>
          )}
        </div>
      ) : null}

      <div className="form-row">
        <div className="field">
          <label htmlFor="bq-name">Your name <span className="req" aria-hidden="true">*</span></label>
          <input id="bq-name" type="text" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="bq-email">Email <span className="req" aria-hidden="true">*</span></label>
          <input id="bq-email" type="email" required autoComplete="email" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="bq-phone">Phone</label>
        <input id="bq-phone" type="tel" autoComplete="tel" />
      </div>

      <div className="field">
        <label htmlFor="bq-notes">Anything else?</label>
        <textarea id="bq-notes" rows={3} placeholder="A bar package, a head table, a projector, dietary needs." />
      </div>

      <div>
        <button className="btn" type="submit">Send the enquiry</button>
        <p className="hint" style={{ marginTop: 12 }}>
          Or call the events office on <a href={`tel:${site.salesPhone.tel}`}>{site.salesPhone.display}</a>.
        </p>
      </div>
    </form>
  );
}
