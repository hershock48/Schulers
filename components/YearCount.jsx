"use client";

import { useEffect, useRef } from "react";

/**
 * 1909 counting up to the present, under "and counting".
 *
 * TWO THINGS HAVE TO BE TRUE AT ONCE and each previous version held only one.
 *
 *   1. The count must not be driven by scroll POSITION. The number is 57.6px
 *      tall at 390px wide, so its `cover` distance is barely one viewport and
 *      the old `cover 34%`–`74%` band was 361px: 3.08px per year across 117
 *      years. A flick crosses that in about seven frames, so the count showed
 *      EIGHT values and lurched in twenty-year jumps.
 *
 *   2. The count must only SPEND ITSELF WHILE THE NUMBER IS ON SCREEN. This is
 *      the part a plain timer throws away, and it is the whole virtue of
 *      scrubbing. Measured on a Pixel 7 profile with a normal flick, a
 *      fire-once 2.4s timer ran with the element at top: -283px for every
 *      frame of the count — zero frames where a mid-count year was visible.
 *      The visitor saw nothing at all, then 2026 forever after, which is worse
 *      than the lurch it replaced.
 *
 * So: time drives the count, and visibility gates the clock. The animation is
 * paused whenever the number is off screen and runs whenever it is on, which
 * means every year it passes through is a year somebody could actually see. A
 * visitor who flicks past mid-count finds it exactly where they left it when
 * they come back, rather than finished.
 *
 * Three states, in the order they arrive:
 *   is-armed     first pixel of it is visible  -> hold 1909
 *   is-counting  90% of it is visible          -> start the clock, once
 *   is-onscreen  any part visible              -> clock runs; absent = paused
 *
 * Arming on first intersection rather than on mount matters: if the number is
 * never scrolled to, no class is ever added and it sits at its registered
 * initial value of 2026 — the finished state and the true one. Arming at mount
 * would strand it on 1909 for anyone whose scroll never reached it.
 *
 * With no JavaScript, or under reduced motion, the same is true for everyone.
 */
export default function YearCount() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let started = false;

    // ARMING runs on a root stretched 400px past the bottom edge, so 1909 is
    // in place BEFORE the number is ever on screen. Arming on real
    // intersection instead put a frame or two of 2026 at the bottom of the
    // screen before it snapped back to 1909 — measured, not theorised.
    const arm = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-armed");
        arm.disconnect();
      },
      { rootMargin: "0px 0px 400px 0px" }
    );

    // THE GATE runs on the real viewport and never disconnects: it has to keep
    // pausing and resuming for as long as the page is scrollable.
    const gate = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle("is-onscreen", entry.isIntersecting);
        if (!started && entry.intersectionRatio >= 0.9) {
          started = true;
          el.classList.add("is-counting");
        }
      },
      // 0 for the on/off gate, 0.9 to start. Not 1: a fractional device pixel
      // or a sub-pixel layout can hold the ratio just under 1 forever, and the
      // count would then never begin at all.
      { threshold: [0, 0.9] }
    );

    arm.observe(el);
    gate.observe(el);
    return () => { arm.disconnect(); gate.disconnect(); };
  }, []);

  return <span ref={ref} className="years" aria-hidden="true" />;
}
