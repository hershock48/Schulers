import Image from "next/image";

/**
 * The Schuler's script, written and then brought to life.
 *
 * Two beats, both scrubbed to scroll so the visitor drives them:
 *
 *   1. The script writes itself left to right, in ink, on the page's own
 *      ground. A connected script wiped along its baseline reads as a hand
 *      moving across the page, which is why this works without a centerline
 *      path or a stroke animation.
 *   2. The full colour lockup comes up underneath it and the ink hands over.
 *      Black and white becomes the real mark.
 *
 * THE ARTWORK IS THEIRS AND IT WAS NOT REDRAWN. The ink layer is their own
 * script lifted straight out of logo.webp: the band from x 17.0-86.5%,
 * y 25.5-65.0% of the lockup, upscaled 6x, thresholded on luminance to separate
 * the cream glyphs from the oxblood stripe behind them, then downsampled. Every
 * curve is the curve on their sign. The two layers are positioned with those
 * same fractions, which is why they register on top of each other.
 *
 * Where scroll timelines are unsupported, or motion is reduced, the CSS leaves
 * the colour lockup at full opacity and the ink at zero: the finished state is
 * simply their logo, which is what the page would show anyway.
 *
 * The accessible name lives on the colour image, not on the wrapper. A plain
 * <div> has no role, so aria-label on it is prohibited and axe flags it as a
 * serious violation. The ink layer stays decorative: it is the same word, and
 * naming it too would read "Schuler's" twice to a screen reader.
 */
export default function Signature({ priority = false }) {
  return (
    <div className="sig">
      <Image
        className="sig-color"
        src="/assets/schulers/logo.webp"
        alt="Schuler's Restaurant and Pub, Marshall, Michigan, since 1909"
        width={614}
        height={316}
        priority={priority}
        sizes="(max-width: 700px) 84vw, 520px"
      />
      <Image
        className="sig-ink"
        src="/assets/schulers/signature-ink.webp"
        alt=""
        aria-hidden="true"
        width={854}
        height={248}
        priority={priority}
        sizes="(max-width: 700px) 62vw, 380px"
      />
    </div>
  );
}
