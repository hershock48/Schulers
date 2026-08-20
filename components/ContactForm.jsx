"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/**
 * A form needs a real destination and a confirmed inbox, and those are two
 * different things. Neither exists on a concept build, so this does not claim
 * to send. It says what it is and it hands the message off to the guest's own
 * mail client with every field already filled in, which is the honest fallback.
 */
export default function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", subject: "General", message: "" });
  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));

  const mailto =
    `mailto:${site.email}` +
    `?subject=${encodeURIComponent(`${f.subject} enquiry from the website`)}` +
    `&body=${encodeURIComponent(`${f.message}\n\n${f.name}\n${f.email}`)}`;

  return (
    <div>
      <h2>Send a note</h2>
      <div className="demo-flag" style={{ marginTop: 16 }}>
        <b>Concept build.</b> On the live site this posts straight to the office inbox. Here it
        opens your own mail app with everything filled in.
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="c-name">Name</label>
          <input id="c-name" type="text" autoComplete="name" value={f.name} onChange={set("name")} />
        </div>
        <div className="field">
          <label htmlFor="c-email">Email</label>
          <input id="c-email" type="email" autoComplete="email" value={f.email} onChange={set("email")} />
        </div>
        <div className="field">
          <label htmlFor="c-subject">What is it about?</label>
          <select id="c-subject" value={f.subject} onChange={set("subject")}>
            <option>General</option>
            <option>Reservations</option>
            <option>Events and banquets</option>
            <option>Gift cards</option>
            <option>The Royal Hotel</option>
            <option>Wine dinner list</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="c-message">Message</label>
          <textarea id="c-message" rows={5} value={f.message} onChange={set("message")} />
        </div>
        <div>
          <a className="btn" href={mailto}>Send it</a>
        </div>
      </div>
    </div>
  );
}
