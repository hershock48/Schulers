"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/**
 * Today's hours, and whether the kitchen is open right now.
 *
 * The 2026 restaurant-UX convention is that a visitor should answer hours,
 * location, menu, booking and price range in about three seconds. Printed hours
 * make them do the arithmetic; this does it for them.
 *
 * Computed in the browser after mount, never on the server. A page whose
 * content depends on the current time cannot be statically generated: a
 * `new Date()` evaluated at build time freezes, and this would tell a Tuesday
 * visitor whether the restaurant was open on the day of the last deploy.
 *
 * The un-rendered state is the honest one: until it mounts it shows the posted
 * hours with no open/closed claim, which is what the page would say anyway.
 */
export default function OpenNow() {
  const [state, setState] = useState(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      const open = 11 * 60 + 30;
      const close = 21 * 60;
      setState({ isOpen: mins >= open && mins < close, mins, open, close });
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const fmt = (m) => {
    const h = Math.floor(m / 60), mm = m % 60;
    const ampm = h >= 12 ? "pm" : "am";
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}${mm ? ":" + String(mm).padStart(2, "0") : ""}${ampm}`;
  };

  return (
    <p className="openline">
      <span>
        {state ? (
          state.isOpen ? (
            <>
              <span className="dot" aria-hidden="true" />
              <b>Open now</b> until {fmt(state.close)}
            </>
          ) : (
            <>
              <b>Closed</b>
              {state.mins < state.open ? ` until ${fmt(state.open)} today` : ` until ${fmt(state.open)} tomorrow`}
            </>
          )
        ) : (
          <b>Open daily, {fmt(11 * 60 + 30)} to {fmt(21 * 60)}</b>
        )}
      </span>
      <span>{site.address.street}, {site.address.city}</span>
      <span><a href={`tel:${site.phone.tel}`}>{site.phone.display}</a></span>
    </p>
  );
}
