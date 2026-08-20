import { ticker } from "@/lib/ticker";

/**
 * A hundred and seventeen years, ticking past under the sign.
 *
 * Every item is sourced in lib/ticker.js. Nothing here is folklore and several
 * obvious candidates were cut for being wrong; the file says which and why.
 *
 * The track is duplicated so the loop is seamless, and the copy is marked
 * aria-hidden so a screen reader hears the list once rather than twice. The
 * whole strip is decorative, so it does not sit in the tab order.
 *
 * The animation stops entirely under reduced motion, and because the track is
 * wider than the viewport it would then be unreadable past the first few items,
 * so in that mode it wraps and sits still instead.
 */
export default function HistoryTicker() {
  const items = ticker.map((t) => (
    <span className="tick" key={`${t.year}-${t.text}`}>
      <b>{t.year}</b>
      {t.text}
    </span>
  ));
  return (
    <div className="histstrip">
      <p className="histtitle">
        <span>What has happened since we opened</span>
      </p>
      <div className="histticker" aria-hidden="true">
        <div className="histticker-track">
          {items}
          {items}
        </div>
      </div>
    </div>
  );
}
