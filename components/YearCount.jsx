"use client";

import { useEffect, useRef } from "react";

const FROM = 1909;
const TO = 2026;
const DURATION = 1800;

/**
 * 1909 counting up to the present, under "and counting".
 *
 * THE NUMBER IS TEXT, WRITTEN BY THIS COMPONENT. It used to be a CSS counter
 * printing an animated registered custom property: `@property --year`, then
 * `counter-reset: yr var(--year)` and `content: counter(yr)`. That is a lovely
 * mechanism and it is not one iOS Safari can be trusted with -- WebKit
 * resolves counters at style time and does not reliably re-resolve generated
 * content when the custom property feeding it is animated, so on an iPhone the
 * number simply sat still. It sat on 2026, which reads as the finished state,
 * so nobody caught it; then a change that pre-set 1909 made it sit on 1909
 * instead, which reads as broken, which is how it finally got noticed.
 *
 * Writing textContent from a rAF loop has no such question hanging over it. It
 * is the same number on every engine, and it is inspectable: `textContent` is
 * the value, so a harness reads what the visitor reads rather than reading a
 * custom property and hoping it got painted.
 *
 * THE CLOCK IS GATED ON VISIBILITY, which is the part that took two attempts.
 * Scrubbing to scroll failed because 117 years across a 361px band is 3.08px
 * per year, and a flick renders eight of them. A fire-once timer failed worse:
 * measured on a phone profile, the whole count ran with the element at
 * top:-283px, so ZERO mid-count years were ever on screen. Scroll position
 * driving an animation at least GUARANTEES the element is in frame while it
 * animates; dropping it dropped that guarantee, and nothing replaced it.
 *
 * So time advances the count and visibility decides whether time is passing.
 * Elapsed milliseconds accumulate only while the number is on screen, which
 * means every year it passes through is a year somebody could have seen, and
 * somebody who flicks past mid-count finds it where they left it.
 *
 * Server-rendered and reduced-motion output is 2026: the finished state, and
 * the true one.
 */
export default function YearCount() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let armed = false;      // 1909 is showing
    let eligible = false;   // has been properly in frame at least once
    let onScreen = false;
    let elapsed = 0;
    let last = null;
    let raf = null;
    let done = false;

    // CSS ease-out is cubic-bezier(0, 0, .58, 1), and it was chosen by
    // measuring: across four quarters it covers 44, 36, 26 and 11 years, so
    // it is still visibly ticking as it lands. Curves that front-load harder
    // read as a lurch and then a stall.
    //
    // Solved rather than approximated. The obvious stand-in, 1 - (1-t)^3,
    // spends 68 years on its first quarter, which is the shape this curve was
    // picked over -- so using it here would have quietly thrown the choice
    // away and left the numbers in this comment lying.
    const ease = (t) => {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      // x(u) for cubic-bezier(0, 0, .58, 1): P1x = 0, P2x = .58.
      const xOf = (u) => 3 * (1 - u) * u * u * 0.58 + u * u * u;
      // x is monotonic in u, so bisect. 24 halvings is far past a pixel.
      let lo = 0;
      let hi = 1;
      let u = t;
      for (let i = 0; i < 24; i++) {
        if (xOf(u) < t) lo = u;
        else hi = u;
        u = (lo + hi) / 2;
      }
      // y(u): P1y = 0, P2y = 1.
      return 3 * (1 - u) * u * u + u * u * u;
    };

    const frame = (now) => {
      if (last !== null) elapsed += now - last;
      last = now;
      const t = Math.min(1, elapsed / DURATION);
      el.textContent = String(Math.round(FROM + (TO - FROM) * ease(t)));
      if (t >= 1) {
        done = true;
        raf = null;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const run = () => {
      if (done || raf !== null || !onScreen || !eligible || document.hidden) return;
      last = null;                       // do not bill the paused stretch
      raf = requestAnimationFrame(frame);
    };
    const halt = () => {
      if (raf === null) return;
      cancelAnimationFrame(raf);
      raf = null;
      last = null;
    };

    // Arm on a root stretched past the bottom edge, so 1909 is in place before
    // the number is ever on screen rather than a frame or two after.
    const arm = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        armed = true;
        if (!done) el.textContent = String(FROM);
        arm.disconnect();
      },
      { rootMargin: "0px 0px 400px 0px" }
    );

    // The gate runs on the real viewport and never disconnects: it has to keep
    // starting and stopping the clock for as long as the page is scrollable.
    // 0.9 rather than 1 to become eligible, because a fractional device pixel
    // can hold the ratio just under 1 forever and the count would never begin.
    const gate = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (entry.intersectionRatio >= 0.9) eligible = true;
        if (onScreen && armed) run();
        else halt();
      },
      { threshold: [0, 0.9] }
    );

    const onVisibility = () => (document.hidden ? halt() : run());
    document.addEventListener("visibilitychange", onVisibility);

    arm.observe(el);
    gate.observe(el);

    return () => {
      arm.disconnect();
      gate.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      halt();
    };
  }, []);

  return (
    <span ref={ref} className="years" aria-hidden="true">
      {TO}
    </span>
  );
}
