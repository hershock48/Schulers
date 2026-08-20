/**
 * Events, in one place, with real dates on them.
 *
 * Their live site's events page currently advertises Thanksgiving dinner on
 * "November 28" with no year printed anywhere, and each listing appears twice.
 * Meanwhile the wine dinners and tastings that actually happen are announced on
 * Facebook and never reach the website.
 *
 * PLACEHOLDER — these are shaped from the kinds of events they really run
 * (wine dinners, holiday service, the Historic Home Tour weekend) but the
 * dates and details need confirming with the restaurant before launch. Every
 * one of them is on the README checklist.
 */
export const events = [
  {
    id: "home-tour",
    title: "Historic Home Tour Weekend",
    date: "2026-09-12",
    dateLabel: "September 12 and 13, 2026",
    blurb:
      "The 61st Home Tour brings a few thousand people into town, and the kitchen runs a tour menu with courses named after the houses on it. Jean Schuler started the tour in 1957.",
    cta: { label: "Book a table", href: "/reservations" },
    placeholder: true,
  },
  {
    id: "fall-wine",
    title: "Fall Wine Dinner",
    date: "2026-10-16",
    dateLabel: "October 16, 2026",
    blurb:
      "Five courses, five pours, and somebody from the vineyard talking between them. These sell out on the mailing list before they reach the website.",
    cta: { label: "Ask about a seat", href: "/contact?about=events" },
    placeholder: true,
  },
  {
    id: "thanksgiving",
    title: "Thanksgiving Dinner",
    date: "2026-11-26",
    dateLabel: "November 26, 2026",
    blurb:
      "Dinner served 11:30am to 6:00pm, plus Turkey To Go if you would rather host it yourself and skip the part with the oven.",
    cta: { label: "Book a table", href: "/reservations" },
    placeholder: true,
  },
  {
    id: "christmas-eve",
    title: "Christmas Eve",
    date: "2026-12-24",
    dateLabel: "December 24, 2026",
    blurb:
      "Dinner service in the dining room, and the pub open after. The building has done this a hundred and seventeen times.",
    cta: { label: "Book a table", href: "/reservations" },
    placeholder: true,
  },
];
