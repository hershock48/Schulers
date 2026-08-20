import Link from "next/link";
import { Ornament } from "@/components/Ornament";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section>
      <div className="wrap narrow" style={{ textAlign: "center", padding: "40px 0" }}>
        <Ornament />
        <h1 style={{ fontSize: "clamp(30px, 4vw, 46px)", marginTop: 22 }}>
          That page is not on the menu.
        </h1>
        <p style={{ marginTop: 16, color: "var(--muted)" }}>
          It may have moved, or it may never have existed. Either way, dinner is still on.
        </p>
        <div style={{ marginTop: 30, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn" href="/menu">See the menu</Link>
          <Link className="btn ghost" href="/">Back to the front</Link>
        </div>
      </div>
    </section>
  );
}
