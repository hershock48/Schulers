"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/**
 * The homepage booking entry. It does not book; it carries the guest's choices
 * into /reservations with them so they land on a form already filled in.
 *
 * That is the honest version of the inline widget every good restaurant site
 * now has. Pretending to check availability here, with no book behind it, would
 * be the "Thanks, we got it" stub that sends nowhere.
 */
export default function ReserveStrip() {
  const router = useRouter();
  const [today, setToday] = useState("");
  const [date, setDate] = useState("");
  const [party, setParty] = useState("2");

  useEffect(() => {
    const d = new Date();
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    setToday(iso);
    setDate((v) => v || iso);
  }, []);

  return (
    <section className="reserve-strip">
      <div className="inner">
        <div className="rs-copy">
          <h2>A table for tonight</h2>
          <p>Pick a date and a party size. You will know in about thirty seconds.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/reservations?date=${encodeURIComponent(date)}&party=${encodeURIComponent(party)}`);
          }}
        >
          <div>
            <label htmlFor="rs-date">Date</label>
            <input id="rs-date" type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="rs-party">Guests</label>
            <select id="rs-party" value={party} onChange={(e) => setParty(e.target.value)}>
              {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
              ))}
            </select>
          </div>
          <button className="btn" type="submit">Find a table</button>
        </form>
      </div>
    </section>
  );
}
