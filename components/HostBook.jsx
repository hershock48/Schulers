"use client";

import { useMemo, useState } from "react";
import { site } from "@/lib/site";

/**
 * The host stand screen.
 *
 * The proposal promises "your host stand gets a screen showing tonight's covers
 * on any tablet or phone", and Sue's first question about online booking will be
 * "what does my team actually see?". A promise with nothing behind it is the
 * thing that loses the room, so this is that screen.
 *
 * The bookings are demo data and the page says so. What is real is the shape:
 * covers by half hour against a configurable ceiling, party size, contact,
 * notes, and the two states a host actually needs, which are "who is coming"
 * and "am I full".
 */
const SEED = [
  { t: "17:00", name: "Ferris", size: 2, phone: "(269) 555-0148", note: "" },
  { t: "17:30", name: "Okonkwo", size: 4, phone: "(269) 555-0132", note: "Wheelchair, please seat near the door" },
  { t: "18:00", name: "Vandermolen", size: 6, phone: "(517) 555-0119", note: "Anniversary, 40th" },
  { t: "18:00", name: "Reyes", size: 2, phone: "(269) 555-0177", note: "" },
  { t: "18:30", name: "Blackwood", size: 8, phone: "(616) 555-0103", note: "One high chair" },
  { t: "18:30", name: "Hilliard", size: 2, phone: "(269) 555-0190", note: "Nut allergy" },
  { t: "19:00", name: "Chen", size: 4, phone: "(734) 555-0166", note: "" },
  { t: "19:00", name: "Duquette", size: 5, phone: "(269) 555-0154", note: "Quiet corner if you have one" },
  { t: "19:30", name: "Abernathy", size: 2, phone: "(269) 555-0121", note: "" },
  { t: "20:00", name: "Straub", size: 3, phone: "(517) 555-0187", note: "Running ten late, called ahead" },
];

const SLOTS = ["17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30"];
const pretty = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")}${h >= 12 ? "pm" : "am"}`;
};

export default function HostBook() {
  const [cap, setCap] = useState(14);
  const [seated, setSeated] = useState({});

  const bySlot = useMemo(() => {
    const m = new Map(SLOTS.map((s) => [s, []]));
    SEED.forEach((b, i) => m.get(b.t)?.push({ ...b, i }));
    return m;
  }, []);

  const covers = (s) => (bySlot.get(s) || []).reduce((a, b) => a + b.size, 0);
  const total = SEED.reduce((a, b) => a + b.size, 0);

  return (
    <>
      <div className="demo-flag">
        <b>Concept build.</b> These bookings are made up so the screen has something in it. The
        layout, the cover counts and the full-slot behaviour are the real thing.
      </div>

      <div className="hostbar">
        <div>
          <p className="eyebrow">Tonight</p>
          <p className="hostbig">{total} covers</p>
          <p className="hostsub">{SEED.length} reservations &middot; {site.hoursShort}</p>
        </div>
        <div className="field" style={{ maxWidth: 200 }}>
          <label htmlFor="cap">Covers per half hour</label>
          <input
            id="cap" type="number" min="2" max="60" value={cap}
            onChange={(e) => setCap(Math.max(2, Number(e.target.value) || 2))}
          />
          <p className="hint">The site stops offering a time once it is full.</p>
        </div>
      </div>

      {SLOTS.map((s) => {
        const rows = bySlot.get(s) || [];
        const c = covers(s);
        const full = c >= cap;
        return (
          <section key={s} className="hostslot">
            <header className={full ? "hostslot-head full" : "hostslot-head"}>
              <h2>{pretty(s)}</h2>
              <span>
                {c} / {cap} covers{full ? " — full, no longer bookable online" : ""}
              </span>
            </header>
            {rows.length === 0 ? (
              <p className="hostempty">Nothing booked.</p>
            ) : (
              <ul className="hostlist">
                {rows.map((b) => (
                  <li key={b.i} className={seated[b.i] ? "seated" : ""}>
                    <span className="hostparty">{b.size}</span>
                    <span className="hostname">
                      <b>{b.name}</b>
                      <span>{b.phone}</span>
                      {b.note ? <em>{b.note}</em> : null}
                    </span>
                    <button
                      type="button"
                      className="btn sm ghost"
                      aria-pressed={!!seated[b.i]}
                      onClick={() => setSeated((v) => ({ ...v, [b.i]: !v[b.i] }))}
                    >
                      {seated[b.i] ? "Seated" : "Seat"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </>
  );
}
