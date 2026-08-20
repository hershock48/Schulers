import Link from "next/link";
import { site } from "@/lib/site";

/**
 * The persistent mobile action bar. Reserve, menu, call, always a thumb away.
 * Named in the 2026 restaurant-UX research as the one non-negotiable on mobile:
 * a Reserve action that survives scrolling. CSS hides it above 860px.
 */
export default function ActionBar() {
  return (
    <nav className="actionbar" aria-label="Quick actions">
      <ul>
        <li><Link className="primary" href="/reservations">Reserve</Link></li>
        <li><Link href="/menu">Menu</Link></li>
        <li><a href={`tel:${site.phone.tel}`}>Call</a></li>
      </ul>
    </nav>
  );
}
