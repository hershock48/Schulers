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
 * STROKE ORDER. The segments are ordered by where they sit in the word, not by
 * which is nearest the pen. Nearest-neighbour let the pen hop about inside a
 * letter, so the h of "Sch" landed after the u and the l and the word read
 * "Scnul" halfway through. Ordered by position it now reads Sc, Sch, Schu,
 * Schule, Schuler's, and no segment starts more than 12px left of the one
 * before it.
 *
 * WHY IT STALLED. The covering DFS retraced its own path to reach every branch,
 * and a retrace costs animation time while revealing no new ink. Measured on the
 * render, the reveal rate was +72px in one 150ms frame and +4356px in another:
 * the pen visibly froze, then lurched. The skeleton is now cut at every junction
 * into branch-free segments, ordered the way a hand would take them, and emitted
 * as separate subpaths of one path. Dash offset runs continuously across
 * subpaths and the jumps between them have no length, so every millisecond of
 * the animation lays down new ink.
 *
 * SMOOTHNESS. Three things were making it jerk. The path was an M/L polyline,
 * so the pen crossed a curved script as a chain of straight facets; the
 * skeleton carried little barbs at stroke ends that the covering walk dutifully
 * flicked into and back out of; and the walk's raw spacing made the pen race
 * through sparse stretches and crawl through dense ones. So spurs thinner than
 * the local ink are shaved first, the walk is averaged along its length to
 * soften the retrace reversals, resampled to even arc length so the speed is
 * constant, then fitted as Catmull-Rom cubics. Sharp direction changes fell
 * from 34, 124 and 1 per stroke to 3, 8 and 1.
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

    // ONE PATH WITH MANY SUBPATHS DOES NOT WORK. An SVG dash pattern RESTARTS at
    // every subpath, so a single dasharray/dashoffset made all 32 segments
    // reveal at once and the whole word landed in a single 450ms burst. They
    // have to be separate elements with their own dash and their own delay.
    const lens = pens.map((q) => q.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0);

    // Delay each segment by how far the pen has already travelled, so the ink
    // rate is constant end to end instead of stalling and lurching.
    const WRITE = 2200, START = 360;
    let run = 0;
    pens.forEach((q, i) => {
      q.style.setProperty("--len", String(lens[i]));
      q.style.setProperty("--dur", `${Math.max(40, Math.round((lens[i] / total) * WRITE))}ms`);
      q.style.setProperty("--delay", `${Math.round(START + (run / total) * WRITE)}ms`);
      run += lens[i];
    });
    el.style.setProperty("--ink-done", `${START + WRITE}ms`);

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
              <path className="crest-pen" d="M12,102C12,102 13,102 15,102C16,102 18,102 20,102C21,102 23,102 25,101C26,101 28,100 29,100C31,99 33,98 34,97C35,97 36,96 36,95" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M40,89C40,89 40,88 40,86C39,85 39,83 39,81C39,80 38,78 38,76C38,75 38,73 38,71C39,70 39,68 39,67C40,65 41,63 41,62C42,61 43,59 44,58C46,57 47,56 48,56C50,55 51,54 53,54C55,54 56,54 58,54C59,54 61,55 63,56C64,56 65,57 66,57" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M51,97C50,96 47,95 46,95" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M55,94C55,94 56,93 57,92C59,91 60,90 61,89C63,88 64,87 66,86C67,85 69,85 70,84C72,83 73,83 75,82C76,81 78,80 79,80C81,79 82,78 84,77C85,76 86,75 88,75C89,74 91,73 92,72C94,71 95,70 96,70C98,69 99,68 101,67C102,66 104,65 105,65C106,64 108,63 108,63" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M114,66C114,67 114,68 113,70C113,71 112,73 112,74C111,76 110,77 109,79C109,80 108,82 107,83C106,84 105,85 103,87C102,88 101,89 100,90C99,91 97,92 96,93C95,94 93,95 92,96C91,97 89,98 88,98C86,99 84,100 83,100C81,101 80,101 78,101C76,102 75,102 73,102C71,102 70,102 68,103C67,103 65,103 63,102C62,102 60,102 59,101C57,101 56,100 55,100" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M116,61C117,60 117,59 118,58C118,56 119,54 120,53C120,52 121,51 121,50" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M123,43C123,43 124,42 124,40C124,39 125,37 125,35C126,34 126,32 127,31C127,29 128,28 129,26C130,25 130,23 131,22C132,20 133,19 134,18C135,16 136,15 137,14C138,13 139,11 141,10C142,9 143,8 145,8C146,7 148,6 149,6C151,6 153,6 154,7C155,7 156,8 157,9C157,11 158,12 158,14C158,15 157,17 157,18C156,20 155,21 154,23C153,24 152,25 151,27C150,28 149,29 148,30C147,31 145,33 144,34C143,35 142,36 140,37C139,38 138,39 137,40C135,41 134,42 133,43C131,44 130,45 130,45" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M169,95C168,95 167,96 165,96C164,96 162,97 161,97C159,98 158,99 156,99C155,100 153,100 152,101C150,101 148,102 147,102C145,102 143,102 142,102C140,102 139,101 138,100C137,100 135,98 135,97C134,96 134,94 134,92C134,91 134,89 134,88C134,86 135,84 135,83C136,81 136,80 137,78C138,77 139,75 139,74C140,72 141,71 142,70C143,68 144,67 146,66C147,65 148,64 150,63C151,62 152,61 154,61C156,60 157,60 159,60C160,60 162,60 163,61C164,61 165,62 165,62" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M168,105C168,104 170,102 170,101" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M189,71C189,72 188,73 187,74C186,75 185,77 184,78C183,79 183,81 182,82C181,84 180,85 179,86C178,88 177,89 176,90C175,92 175,93 174,93" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M197,57C197,58 196,59 196,60C195,61 194,62 194,63" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M202,56C203,56 204,55 205,55C207,54 208,54 210,53C211,52 212,51 214,50C215,49 216,48 218,47C219,46 220,45 221,43C223,42 224,41 225,40C226,39 227,38 229,36C230,35 231,34 232,33C233,32 234,31 236,29C237,28 238,27 239,26C240,24 241,23 242,22C243,20 244,19 244,17C245,16 245,14 245,13C245,12 244,11 243,10C242,10 240,10 239,10C238,10 236,11 235,12C233,13 232,14 231,15C229,16 228,17 227,18C226,19 225,21 224,22C222,23 221,24 220,25C219,27 218,28 217,29C216,30 215,32 213,33C212,34 211,35 210,37C209,38 208,39 207,41C206,42 205,44 204,45C204,46 203,47 203,48" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M194,68C195,68 196,68 198,68C199,67 201,67 202,66C203,65 205,64 206,63C208,62 209,61 210,61C212,60 213,60 215,61C216,61 217,62 217,63C218,64 218,66 218,67C218,69 217,70 216,72C215,73 214,75 214,76C213,78 212,79 211,80C210,82 210,83 209,85C208,86 208,88 207,90C207,91 206,93 206,94C207,96 207,97 208,98C208,99 209,100 211,100C212,100 214,100 215,100C217,99 219,99 220,98C221,97 223,96 224,95C225,94 226,93 228,92C229,90 230,89 231,88C232,86 233,85 234,84C235,82 236,81 237,80C238,78 239,77 240,76C241,74 242,73 243,72C244,71 245,69 246,68C247,67 248,66 250,65C251,64 252,63 254,62C255,61 257,61 258,61C259,62 260,62 261,63C261,64 262,66 261,67C261,69 260,70 260,72C259,73 258,74 257,76C256,77 255,79 254,80C253,81 252,83 252,84C251,86 250,87 250,89C249,90 249,92 248,94C248,95 248,97 249,98C250,99 251,100 252,100C253,100 255,100 256,100C258,100 259,99 261,98C262,98 264,97 265,96C267,96 269,96 270,96C271,96 272,96 273,96" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M278,96C278,95 279,94 279,92C279,91 280,89 281,88C281,86 282,85 283,83C284,82 284,80 285,79C286,78 287,76 288,75C289,73 290,72 291,71C292,69 292,68 293,68" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M307,92C306,92 305,92 304,92C302,92 301,93 299,93C298,94 297,95 295,96C294,97 293,98 291,99C290,99 288,100 287,100C285,101 284,101 283,101" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M318,71C318,72 317,73 317,74C316,75 315,77 315,79C314,80 313,82 313,83C312,85 312,87 311,88C311,89 310,91 310,91" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M309,96C310,97 311,98 311,98C312,99 314,100 315,100C316,100 318,100 320,99C321,99 323,98 324,97C326,97 327,95 328,95C330,94 332,93 333,93C334,92 335,92 336,92" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M321,67C321,66 322,65 322,64C323,62 324,61 324,59C325,58 326,56 327,55C328,53 329,52 330,51C331,49 331,48 332,46C333,45 334,44 335,42C336,41 337,39 338,38C339,37 340,35 341,34C342,33 343,32 344,30C345,29 346,28 347,27C349,25 350,24 351,23C352,22 353,20 354,19C355,18 357,17 358,16C360,15 361,15 363,14C364,14 365,14 366,15C367,16 368,17 368,18C368,19 368,21 367,23C367,24 366,26 365,27C364,29 363,30 362,31C361,33 360,34 360,35C359,37 358,38 357,39C356,41 355,42 353,43C352,45 351,46 350,47C349,49 348,50 347,51C346,52 345,54 344,55C343,56 341,57 340,58C339,60 338,61 337,62C336,63 334,64 333,65C332,66 330,68 329,68C328,69 327,70 327,70" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M343,85C343,86 342,89 342,90" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M347,83C347,83 348,83 350,83C351,83 353,82 355,82C356,81 358,81 359,80C361,79 362,79 364,78C365,77 366,76 368,75C369,74 370,72 371,71C372,70 372,68 373,67C373,65 373,63 372,62C371,61 370,60 369,60C368,59 366,59 365,59C363,59 362,60 360,61C359,61 357,62 356,63C355,64 353,65 352,67C351,68 350,69 349,70C348,72 347,73 346,75C346,76 345,77 345,77" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M342,96C342,97 343,98 344,99C345,100 346,101 348,101C349,102 351,102 352,102C354,102 355,102 357,101C359,101 360,100 362,100C363,99 365,98 366,97C367,96 369,95 370,94C371,93 373,92 374,91C375,90 376,89 377,87C378,86 379,85 380,83C381,82 382,81 384,80C385,78 386,77 387,76C388,74 389,73 390,72C391,70 392,69 393,68C394,67 395,66 395,65" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M411,68C411,69 411,70 410,71C410,73 409,74 408,76C407,77 406,78 405,80C404,81 403,82 402,84C401,85 400,87 399,88C398,90 398,91 397,93C397,94 396,96 396,97C396,99 396,100 397,101C398,102 399,103 400,103C401,103 403,103 404,102C406,102 408,101 409,100C410,100 411,99 412,98" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M402,62C403,62 406,63 406,64" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M417,63C417,63 416,63 416,63C416,63 415,63 415,64C415,64 414,64 414,64C414,64 413,65 413,65" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M418,98C419,99 419,100 420,101C420,102 421,104 423,105C424,106 425,106 427,107C428,107 430,107 432,107C433,107 435,106 436,106C438,105 439,104 440,103C441,102 442,101 443,101" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M422,87C422,86 423,85 424,84C425,83 426,81 427,80C428,79 429,77 430,76C431,75 432,73 433,72C434,71 435,70 435,70" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M427,46C428,46 429,45 429,44C430,43 431,42 432,42" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M442,84C442,84 441,84 439,84C438,84 436,85 434,85C433,85 431,86 430,87C428,87 427,88 427,88" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M440,64C440,63 440,60 441,59" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M441,67C441,68 442,69 442,71C442,72 443,74 444,75C444,77 444,78 445,78" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M447,94C447,93 447,90 447,89" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path className="crest-pen" d="M450,96C451,96 452,96 454,96C455,95 456,95 458,94C459,93 460,91 461,90C462,89 463,88 463,88" fill="none" stroke="white"
                    strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </mask>
        </defs>

        <image className="crest-plate" href="/assets/schulers/crest-base.webp"
               x="0" y="0" width="614" height="316" />
        <image className="crest-word" href="/assets/schulers/crest-word.webp"
               x="66.0" y="81.0"
               width="474.0" height="115.0"
               mask="url(#crestMask)" />
      </svg>
    </div>
  );
}
