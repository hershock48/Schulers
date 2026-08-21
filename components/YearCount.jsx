"use client";

import { useEffect, useRef } from "react";

/**
 * 1909 counting up to the present, under "and counting".
 *
 * This used to be scrubbed to scroll — `animation-timeline: view()` mapped the
 * count onto the number's pass through the viewport, the house pattern. That
 * reads well under a desktop wheel and badly under a thumb, and the reason is
 * arithmetic rather than taste.
 *
 * The count is 117 steps wide. The active band was 40% of `cover`, and the
 * number is only 57.6px tall at 390px wide, so `cover` is barely more than one
 * viewport: 902px, of which 40% is 361px. That is 3.08px of scroll per year.
 * A normal flick — roughly 900px in 450ms, decelerating — crosses the whole
 * band in about seven frames, so the count rendered EIGHT values and lurched
 * in twenty-year jumps:
 *
 *     1909 → 1922 → 1946 → 1967 → 1987 → 2005 → 2019 → 2026
 *
 * Widening the band does not rescue it; the full `cover` range still only buys
 * about fifteen values on the same flick. A ticker is time-based by nature.
 *
 * So the count now runs over a fixed duration once the number is properly in
 * frame. It reads identically on a slow desktop scroll and a fast thumb, it
 * cannot run backwards when the visitor scrolls up, and it no longer competes
 * with momentum scrolling for frames.
 *
 * One-shot on purpose: it fires once and disconnects. A number that re-counts
 * every time you pass it is a toy rather than a fact about the building.
 *
 * Two classes rather than one, to avoid a flash. `is-armed` goes on at mount
 * and holds 1909 while the number is still below the fold; `is-counting` goes
 * on when it arrives. Without that, the registered initial value (2026) would
 * be visible first and the number would snap backwards to 1909 before running.
 *
 * With no JavaScript, or under reduced motion, neither class is ever added and
 * the number sits at 2026 — the finished state and the true one, which is the
 * same fallback the scrolled version had wherever `view()` was unsupported.
 */
export default function YearCount() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.classList.add("is-armed");

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-counting");
        io.disconnect();
      },
      // Whole number visible AND up off the bottom edge. `threshold: 1` alone
      // is satisfied while it sits on the very bottom of the screen, which is
      // the readability problem the old `cover 34%` hold was written to solve.
      { threshold: 1, rootMargin: "0px 0px -15% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <span ref={ref} className="years" aria-hidden="true" />;
}
