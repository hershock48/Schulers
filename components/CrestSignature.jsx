"use client";

import { useEffect, useRef } from "react";

/**
 * The Schuler's crest, signed.
 *
 * Their mark is the best asset they own and on the old site it renders at 130px
 * in a corner. Here it is the hero, and it does the one thing a hundred-year-old
 * engraved sign should do: it gets signed, and then it comes to life.
 *
 * The sequence is an engraved plate first (fully desaturated), then the script
 * writes itself on, then colour floods the whole crest half a beat after the pen
 * lifts, so the colour reads as caused by the signature rather than scheduled
 * next to it.
 *
 * HOW THE WRITE-ON WORKS. The crest ships as two files, cut out of their single
 * logo PNG by a script in harvest/:
 *
 *   crest-base.webp   the crest with the script REMOVED and the engraved hatch
 *                     rebuilt behind it. The hatch is horizontal, so each row
 *                     was refilled with that row's own median colour: the
 *                     texture is reconstructed exactly rather than smeared.
 *   crest-word.webp   the script alone, on transparency.
 *
 * The word is then revealed through a mask containing ONE thick stroked path
 * whose dash offset animates. That path is the script's own skeleton, computed
 * from the glyphs and smoothed, so the reveal edge travels along the spine of
 * the handwriting and tilts with it. A plain left-to-right wipe was the
 * alternative and it reads as a curtain, not a hand.
 *
 * THE UN-ANIMATED STATE IS THE FINISHED STATE. Default CSS paints the crest in
 * full colour with the signature complete and the dash offset at 0. Everything
 * that hides something is applied by the `.sig-run` class, which only this
 * component adds, and only after checking reduced-motion. Script blocked, JS
 * off, or reduce-motion set, and the visitor gets the finished crest.
 */
export default function CrestSignature({ priority = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const path = el.querySelector(".crest-pen");
    if (!path) return;

    // Measured, not guessed: a hand-written dasharray that is shorter than the
    // real path leaves the last letters permanently hidden.
    const len = path.getTotalLength();
    el.style.setProperty("--crest-len", String(len));

    // Only animate once it is actually on screen, so a visitor who lands
    // further down does not miss the whole thing.
    const start = () => el.classList.add("crest-run");
    if (!("IntersectionObserver" in window)) { start(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { start(); io.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="crest" ref={ref}>
      <svg
        className="crest-svg"
        viewBox="0 0 614 316"
        role="img"
        aria-label="Schuler's Restaurant and Pub, Marshall Michigan, since 1909"
      >
        <defs>
          <mask id="crestMask" maskUnits="userSpaceOnUse" x="0" y="0" width="614" height="316">
            <rect x="0" y="0" width="614" height="316" fill="black" />
            <g transform="translate(0.10749e2 0.25633e2) scale(1.000004 0.999989)">
              <path
                className="crest-pen"
                d="M5.0,99.7C6.7,100.0 11.7,101.3 15.0,101.5C18.3,101.7 21.7,102.7 25.0,100.8C28.3,99.0 31.7,93.6 35.0,90.4C38.3,87.2 41.7,82.5 45.0,81.6C48.3,80.7 51.7,83.9 55.0,84.9C58.3,85.9 61.7,87.2 65.0,87.7C68.3,88.2 71.7,87.7 75.0,87.7C78.3,87.7 81.7,88.6 85.0,87.7C88.3,86.7 91.7,84.0 95.0,82.0C98.3,79.9 101.7,78.9 105.0,75.5C108.3,72.2 111.7,66.1 115.0,61.9C118.3,57.6 121.7,51.0 125.0,50.0C128.3,48.9 131.7,54.7 135.0,55.6C138.3,56.5 141.7,56.5 145.0,55.4C148.3,54.3 151.7,46.2 155.0,49.1C158.3,52.0 161.7,66.3 165.0,72.8C168.3,79.4 171.7,87.7 175.0,88.5C178.3,89.2 181.7,81.0 185.0,77.1C188.3,73.2 191.7,67.2 195.0,65.2C198.3,63.2 201.7,65.8 205.0,65.1C208.3,64.4 211.7,64.0 215.0,61.0C218.3,57.9 221.7,50.8 225.0,46.8C228.3,42.7 231.7,35.7 235.0,36.9C238.3,38.0 241.7,47.4 245.0,53.8C248.3,60.1 251.7,69.5 255.0,74.9C258.3,80.2 261.7,82.6 265.0,85.6C268.3,88.7 271.7,93.2 275.0,93.3C278.3,93.3 281.7,87.9 285.0,85.9C288.3,84.0 291.7,81.4 295.0,81.4C298.3,81.4 301.7,86.0 305.0,85.9C308.3,85.8 311.7,83.9 315.0,81.0C318.3,78.2 321.7,70.9 325.0,68.6C328.3,66.2 331.7,67.2 335.0,67.0C338.3,66.7 341.7,68.1 345.0,67.1C348.3,66.1 351.7,62.8 355.0,61.0C358.3,59.1 361.7,54.5 365.0,55.9C368.3,57.2 371.7,64.8 375.0,68.9C378.3,72.9 381.7,78.5 385.0,80.1C388.3,81.7 391.7,78.5 395.0,78.5C398.3,78.6 401.7,79.6 405.0,80.5C408.3,81.3 411.7,83.5 415.0,83.7C418.3,83.9 421.7,83.4 425.0,81.8C428.3,80.2 431.7,73.6 435.0,74.0C438.3,74.4 441.7,81.1 445.0,84.2C448.3,87.2 451.7,92.0 455.0,92.4C458.3,92.7 462.3,88.0 465.0,86.2C467.7,84.5 470.0,82.5 471.0,81.8"
                fill="none"
                stroke="white"
                strokeWidth="168"
                strokeLinecap="butt"
                strokeLinejoin="round"
              />
            </g>
          </mask>
        </defs>

        <image
          className="crest-plate"
          href="/assets/schulers/crest-base.webp"
          x="0" y="0" width="614" height="316"
        />
        <image
          className="crest-word"
          href="/assets/schulers/crest-word.webp"
          x="66.0" y="81.0"
          width="474.0" height="115.0"
          mask="url(#crestMask)"
        />
        <rect className="crest-sheen" x="0" y="0" width="614" height="316" fill="url(#crestGrad)" />
        <defs>
          <linearGradient id="crestGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="46%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.17" />
            <stop offset="54%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
