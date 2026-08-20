"use client";

import { useEffect, useRef } from "react";

/**
 * The Schuler's crest, signed.
 *
 * WHY THE FIRST VERSION LOOKED WRONG. It used one path taking the median y of
 * each column of the script's skeleton. That is monotonic in x by construction,
 * which is the definition of a wipe, and it was stroked at 168px when the ink on
 * their sign is 15.6px thick. A brush ten times wider than the letters, moving
 * strictly left to right, uncovers whole chunks of word at once. It read as a
 * slide transition because that is what it was.
 *
 * WHAT IT DOES NOW. The script's skeleton is treated as a graph and walked with
 * a DFS that covers every edge, so the pen retraces to close a loop exactly the
 * way a hand does: the three strokes carry 301, 907 and 18 leftward moves
 * between them, against zero for a wipe. Each of the three separate pen strokes
 * of the script -- the capital S, the connected body, the apostrophe -- is its
 * own path, revealed in writing order with the pen lifting between them. The
 * stroke width is measured from the artwork: the 88th percentile of the ink's
 * half-thickness, doubled. The pen is now the width of the pen.
 *
 * Everything is measured from their own logo. harvest/ cuts crest-base.webp (the
 * crest with the script removed and the engraved hatch rebuilt row by row from
 * each row's own median colour) and crest-word.webp (the script alone).
 *
 * THE UN-ANIMATED STATE IS THE FINISHED STATE. Default CSS paints the crest in
 * full colour, signature complete, dash offset 0. Everything that hides is under
 * .crest-run, which this component adds only after checking reduced motion.
 */
export default function CrestSignature({ priority = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pens = [...el.querySelectorAll(".crest-pen")];
    if (!pens.length) return;

    // Measured, not guessed. A hand-written dasharray shorter than the real path
    // leaves the tail of the word permanently hidden.
    const lens = pens.map((p) => p.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0);

    // 2.05s of actual writing, split across the strokes in proportion to how far
    // the pen travels, plus a short lift between them. Slow enough to watch.
    const WRITE = 2050, LIFT = 110, START = 380;
    let t = START;
    pens.forEach((p, i) => {
      const dur = (lens[i] / total) * WRITE;
      p.style.setProperty("--len", String(lens[i]));
      p.style.setProperty("--dur", `${Math.round(dur)}ms`);
      p.style.setProperty("--delay", `${Math.round(t)}ms`);
      t += dur + LIFT;
    });
    el.style.setProperty("--ink-done", `${Math.round(t)}ms`);

    const start = () => el.classList.add("crest-run");
    if (!("IntersectionObserver" in window)) { start(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { start(); io.disconnect(); } });
    }, { threshold: 0.3 });
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
            <g transform="translate(66.0 81.0) scale(1.0000 1.0000)">
              <path className="crest-pen" data-i="0" d="M5,97L5,99L10,102L24,102L33,99L40,92L40,85L38,79L39,65L46,56L53,53L57,53L67,57L70,61L70,67L69,59L57,53L50,54L41,61L38,70L38,79L40,85L40,93L39,93L41,93L40,92L51,97L61,88L81,79L103,65L111,62L115,63L119,57L120,51L124,46L123,42L126,31L136,14L141,9L149,5L154,5L158,8L159,11L158,17L153,25L140,38L129,46L126,44L127,42L128,43L124,45L126,44L127,45L126,45L127,44L124,46L128,43L127,42L126,44L129,46L140,38L153,25L159,13L158,8L156,6L149,5L141,9L136,14L126,31L123,42L124,46L119,53L118,59L115,64L114,63L115,64L114,70L110,79L95,95L90,98L77,102L63,103L55,101L52,97L53,96L53,98L52,97L55,101L63,103L77,102L90,98L95,95L110,79L114,70L115,63L113,62L107,63L81,79L61,88L52,97L47,96L40,92L33,99L24,102L10,102L7,101L5,97" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" data-i="1" d="M133,90L136,79L141,70L147,64L154,60L164,59L167,62L167,64L161,71L167,64L167,62L164,59L154,60L147,64L141,70L135,82L133,96L139,103L153,101L167,94L172,96L179,87L187,73L191,69L195,59L200,54L202,48L208,39L233,12L242,8L247,10L246,15L239,26L218,47L209,54L206,56L204,55L201,56L200,54L199,55L204,57L205,56L204,57L203,56L204,55L206,56L213,51L243,21L246,15L247,10L246,9L242,8L233,12L208,39L202,48L200,54L195,59L192,68L191,68L193,68L192,67L200,68L212,59L217,59L219,62L218,70L210,81L207,88L205,97L207,101L213,101L223,97L244,70L255,60L261,60L263,63L263,67L250,86L247,97L248,101L255,101L269,94L277,98L282,83L292,68L301,61L303,61L296,64L292,68L282,83L278,97L277,99L276,98L279,101L287,101L294,98L302,90L306,91L309,94L311,91L312,83L323,61L339,36L356,17L365,12L367,12L370,15L369,20L359,37L344,55L327,71L325,70L322,71L320,69L325,72L326,71L325,72L324,71L325,70L327,71L351,47L359,37L369,20L370,15L367,12L360,14L351,22L339,36L327,54L327,56L323,61L312,83L311,91L309,94L309,99L311,101L323,99L333,91L340,93L342,91L344,78L348,71L355,63L366,58L372,59L374,63L373,69L367,76L354,83L344,83L343,82L344,83L343,84L344,83L354,83L359,81L371,72L374,65L373,60L370,58L366,58L355,63L348,71L344,78L342,91L340,93L341,94L341,93L343,100L347,103L352,103L363,100L371,94L382,82L393,67L400,61L402,54L400,60L401,61L400,61L406,64L413,65L423,61L416,63L412,66L411,65L412,66L411,73L405,79L397,91L394,101L396,104L407,102L420,92L421,87L435,69L440,65L441,57L446,51L442,55L440,60L441,69L446,83L432,85L425,89L421,87L422,88L420,90L421,91L422,90L421,89L422,90L423,89L420,92L421,88L425,89L432,85L446,84L446,83L446,85L445,84L447,87L447,96L448,96L447,95L450,97L455,97L471,79L455,97L447,96L436,107L432,108L423,107L419,103L418,98L415,96L418,97L419,96L418,93L419,94L419,93L419,96L418,98L417,97L419,103L423,107L428,108L438,106L447,96L447,87L445,84L446,82L440,65L435,69L421,87L419,93L416,94L412,99L407,102L396,104L394,101L397,91L405,79L411,73L413,65L406,64L400,60L393,67L377,88L366,98L360,101L347,103L343,100L340,93L341,92L338,93L336,91L331,92L328,96L323,99L311,101L309,99L309,94L306,91L302,92L301,91L302,92L303,91L302,90L294,98L287,101L279,101L273,95L269,96L268,95L269,96L270,95L269,94L261,99L255,101L248,101L247,97L250,86L263,67L263,63L261,60L255,60L244,70L223,97L217,100L207,101L205,99L207,88L219,67L218,60L212,59L200,68L197,69L196,68L197,69L198,68L197,67L191,69L192,67L187,73L177,90L171,96L171,100L168,105L162,109L160,109L168,105L172,96L170,95L167,96L166,95L167,96L168,95L167,94L153,101L139,103L133,96L133,90" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" data-i="2" d="M419,50L431,44L434,38L434,34L437,30L434,34L434,38L431,44L419,50" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </mask>
          <linearGradient id="crestGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="46%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="54%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <image className="crest-plate" href="/assets/schulers/crest-base.webp"
               x="0" y="0" width="614" height="316" />
        <image className="crest-word" href="/assets/schulers/crest-word.webp"
               x="66.0" y="81.0"
               width="474.0" height="115.0"
               mask="url(#crestMask)" />
        <rect className="crest-sheen" x="0" y="0" width="614" height="316" fill="url(#crestGrad)" />
      </svg>
    </div>
  );
}
