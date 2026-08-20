"use client";

import { useEffect, useMemo, useState } from "react";
import { site } from "@/lib/site";

/**
 * Real-time reservations, the thing their live site does not have.
 *
 * Their current page takes a name and a party size and tells you somebody will
 * get back to you, and same-day guests are told to phone instead. This is the
 * same information collected in the same order, except the guest leaves knowing
 * whether they have a table.
 *
 * AVAILABILITY IS NOT SOLVED HERE AND THE PAGE SAYS SO. A hand-written slot
 * list does not know what is already booked. On the live build this reads the
 * restaurant's own book; in this concept it is a fixed pattern with a couple of
 * peak times held back so the sold-out state is visible. That seam is named
 * rather than implied away.
 */

const TIMES = [
  "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
];

// Demo only: the Friday and Saturday prime slots read as taken so the
// unavailable state is visible. Replace with the real book.
const HELD = new Set(["18:00", "18:30", "19:00"]);

const pretty = (t) => {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")}${ampm}`;
};

export default function ReservationForm() {
  const [today, setToday] = useState("");
  const [date, setDate] = useState("");
  const [party, setParty] = useState("2");
  const [time, setTime] = useState(null);
  const [done, setDone] = useState(false);

  // Browser-side, so a statically generated page cannot freeze "today" at the
  // moment of the last deploy.
  useEffect(() => {
    const d = new Date();
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    setToday(iso);
    setDate((v) => v || iso);
  }, []);

  const weekend = useMemo(() => {
    if (!date) return false;
    const day = new Date(`${date}T12:00:00`).getDay();
    return day === 5 || day === 6;
  }, [date]);

  const isTaken = (t) => weekend && HELD.has(t) && Number(party) > 4;

  if (done) {
    return (
      <div className="notice" role="status">
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>That would be booked.</h2>
        <p>
          On the live site this confirms the table, emails you the details, and puts it straight
          into the book at the host stand. This is a concept build, so nothing was reserved.
        </p>
        <p style={{ marginTop: 14 }}>
          <button className="btn sm ghost" type="button" onClick={() => { setDone(false); setTime(null); }}>
            Try it again
          </button>
        </p>
      </div>
    );
  }

  return (
    <form
      className="form-grid"
      onSubmit={(e) => { e.preventDefault(); setDone(true); }}
    >
      <div className="demo-flag">
        <b>Concept build.</b> The booking works except for the last step. No table is held and
        nothing is emailed.
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="res-date">Date <span className="req" aria-hidden="true">*</span></label>
          <input
            id="res-date" type="date" required
            value={date} min={today}
            onChange={(e) => { setDate(e.target.value); setTime(null); }}
          />
        </div>
        <div className="field">
          <label htmlFor="res-party">Guests <span className="req" aria-hidden="true">*</span></label>
          <select id="res-party" value={party} onChange={(e) => { setParty(e.target.value); setTime(null); }}>
            {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
            ))}
            <option value="17">17 or more</option>
          </select>
          <p className="hint">
            More than sixteen is a private room. <a href="/banquets">Ask about banquets.</a>
          </p>
        </div>
      </div>

      {party === "17" ? (
        <div className="notice warn">
          For a party that size the private rooms are the answer, and they are booked through the
          events office. <a href="/banquets">See the rooms</a> or call{" "}
          <a href={`tel:${site.salesPhone.tel}`}>{site.salesPhone.display}</a>.
        </div>
      ) : (
        <fieldset style={{ border: 0 }}>
          <legend className="eyebrow" style={{ marginBottom: 10 }}>Available times</legend>
          <div className="slots">
            {TIMES.map((t) => {
              const taken = isTaken(t);
              return (
                <button
                  key={t} type="button" className="slot"
                  aria-pressed={time === t} disabled={taken}
                  onClick={() => setTime(t)}
                  title={taken ? "Fully booked" : undefined}
                >
                  {pretty(t)}
                </button>
              );
            })}
          </div>
          <p className="hint" style={{ marginTop: 10 }}>
            Struck-through times are full. The kitchen serves {site.hours[0].open} to {site.hours[0].close} every day.
          </p>
        </fieldset>
      )}

      <div className="form-row">
        <div className="field">
          <label htmlFor="res-name">Name <span className="req" aria-hidden="true">*</span></label>
          <input id="res-name" type="text" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="res-phone">Phone <span className="req" aria-hidden="true">*</span></label>
          <input id="res-phone" type="tel" required autoComplete="tel" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="res-email">Email <span className="req" aria-hidden="true">*</span></label>
        <input id="res-email" type="email" required autoComplete="email" />
        <p className="hint">Your confirmation goes here.</p>
      </div>

      <div className="field">
        <label htmlFor="res-notes">Anything we should know?</label>
        <textarea id="res-notes" rows={3} placeholder="Allergies, a birthday, a wheelchair, a quiet corner." />
      </div>

      <div>
        <button className="btn" type="submit" disabled={party !== "17" && !time}>
          {party !== "17" && !time ? "Choose a time" : "Book the table"}
        </button>
      </div>
    </form>
  );
}
