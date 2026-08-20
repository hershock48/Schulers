"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { site, nav } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header className="site-header">
      <div className="hdr">
        <Link className="hdr-logo" href="/" aria-label={`${site.name}, home`}>
          <Image
            src="/assets/schulers/logo.webp"
            alt={site.name}
            width={264}
            height={136}
            priority
            sizes="132px"
          />
        </Link>

        <nav className={open ? "hdr-nav open" : "hdr-nav"} aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={path === n.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hdr-cta">
          <Link className="btn sm" href="/reservations">Book a Table</Link>
          <button
            className="navtoggle"
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </header>
  );
}
