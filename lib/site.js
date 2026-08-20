/**
 * Every business fact about Schuler's lives here, so a correction is one edit.
 *
 * This exists because their live site publishes the venue as 250 guests on
 * schulersrestaurant.com and 300 on 19zero9.com, and quotes different banquet
 * prices depending which PDF a guest finds. Both are the same failure: the fact
 * was typed into a page instead of read from somewhere.
 *
 * Re-verified 20 Aug 2026. An earlier version of this comment also cited a
 * five-versus-eight room count and four contradictory sets of hours. Both were
 * true when first researched and are not any more: /the-royal-hotel/ now 301s
 * to royalhotelmarshall.com, and the legacy pages carrying the other hour sets
 * return 404. Retracted rather than quietly deleted, because a claim that was
 * wrong is worth keeping with the reasoning that produced it.
 *
 * ANY surface that cannot read from this file gets named in the README.
 * Right now that list is: the proposal at public/pitch/schulers/index.html,
 * which is deliberately standalone, and the OG images, which are pixels.
 */

export const site = {
  name: "Schuler's Restaurant & Pub",
  shortName: "Schuler's",
  since: 1909,
  /* 1909 is the BUSINESS, not this address. The Michigan state historical marker
     at the site (L458) says the brick building went up in 1895 as The Royal, that
     Albert Schuler Sr. bought the hotel in 1924, and that it became a restaurant
     about ten years after that; their own history brochure puts the 1909 cigar
     store and restaurant on Main Street. So "serving Marshall since 1909" is
     supportable and "on this corner since 1909" is not. Do not reintroduce it. */
  onThisCorner: 1924,
  tagline: "Marshall, Michigan, since 1909",

  address: {
    street: "115 S. Eagle Street",
    city: "Marshall",
    region: "MI",
    postal: "49068",
    country: "US",
    // From their contact page's embedded map.
    lat: 42.2717,
    lng: -84.9639,
  },

  phone: { display: "(269) 781-0600", tel: "+12697810600" },
  // Their banquet packet and both sister sites publish this as the sales line.
  salesPhone: { display: "(269) 781-0602", tel: "+12697810602" },
  email: "sales@schulersrestaurant.com",

  // One set. Their live site currently carries four contradictory versions.
  hours: [{ days: "Monday to Sunday", open: "11:30am", close: "9:00pm" }],
  hoursShort: "Open daily, 11:30am to 9:00pm",

  // PLACEHOLDER — pickup windows are modeled on the posted kitchen hours.
  // Confirm the real last-order time with the restaurant before launch.
  pickup: { firstSlot: "11:45", lastSlot: "20:30", intervalMinutes: 15, leadMinutes: 25 },

  social: {
    // Their site's own structured data points "sameAs" at a Facebook SEARCH
    // results URL rather than at the page. This is the page.
    facebook: "https://www.facebook.com/SchulersRestaurant/",
    instagram: "https://www.instagram.com/schulersrestaurant/",
  },

  family: {
    hotel: {
      name: "The Royal Hotel",
      url: "https://royalhotelmarshall.com/",
      // EIGHT. Five above the restaurant, three inside 19 Zero 9.
      rooms: 8,
      blurb:
        "Eight rooms in two restored buildings a block apart, the first overnight rooms above Schuler's in more than fifty years.",
    },
    venue: {
      name: "Venue 19 Zero 9",
      url: "https://19zero9.com/",
      // 250. Their own two sites say 250 and 300; the 2026 banquet packet,
      // which is the document that quotes money, says "250-person event venue".
      capacity: 250,
      blurb:
        "A restored 1880s building two blocks up Eagle Street, opened in 2025, with Schuler's catering every event in it.",
    },
    hydeAway: {
      name: "Hyde Away",
      url: "https://royalhotelmarshall.com/hyde-away/",
      blurb: "A cabin and main house on quiet ground outside town, for a wedding weekend or a night away.",
    },
  },

  // ONLY what the April 2026 banquet packet actually prints. Their own site
  // publishes no per-room capacities at all, and the legacy page that used to
  // carry a capacity table is gone (it 404s as of 20 Aug 2026). Two numbers are
  // stated in the packet and the rest are not, so the rest say so rather than
  // carrying a plausible-looking invention.
  banquetRooms: [
    { name: "Heritage East", seats: "8 to 20", note: "The packet's own range for this room." },
    { name: "Heritage Room, combined", seats: "up to 120", note: "All three Heritage rooms opened into one, at round tables." },
    { name: "Signature Room", seats: null }, // PLACEHOLDER: capacity not published
    { name: "Heritage West", seats: null },  // PLACEHOLDER: capacity not published
    { name: "Heritage Center", seats: null },// PLACEHOLDER: capacity not published
  ],
  // The restaurant's own largest published number. 250 is Venue 19 Zero 9's
  // capacity, NOT this building's, and conflating them is how their live site
  // ended up publishing two different numbers for the venue.
  banquetMax: 120,

  /**
   * PLACEHOLDER — every rate below.
   *
   * The proposal's finding is that they publish no room rate anywhere on any of
   * their three sites, so this build has to publish one or the finding is
   * hypocrisy in the room. We do not have their rate sheet. The only public
   * figure is a June 2023 Crain's piece quoting $130 to $225 a night, so these
   * are shaped from that band and are NOT their prices. The page says so out
   * loud. Replace the whole block from their rate sheet before launch.
   */
  hotelRates: {
    placeholder: true,
    rooms: [
      { name: "Hamilton", sqft: 192, from: 139 },
      { name: "Mansion", sqft: 286, from: 159 },
      { name: "Eagle", sqft: 309, from: 169 },
      { name: "Jefferson", sqft: 340, from: 179 },
      { name: "Grand Suite", sqft: 366, from: 225 },
    ],
  },

  // From the April 2026 banquet packet. The November 2024 packet is still live
  // on their site at its old URL with lower numbers, which is finding six.
  banquets: {
    packetDate: "April 2026",
    plated: [
      { tier: "Classic", price: 52 },
      { tier: "Premium", price: 63 },
      { tier: "Signature", price: 73 },
    ],
    breakfastFrom: 16, // packet tier 1
    lunchFrom: 21,     // packet tier 1
    barPackageMinGuests: 75,
    serviceChargePct: 23,
    venueFee: { sunThu: 4500, fri: 5000, sat: 6000 },
  },

  ordering: {
    // Jelly. The guest-facing number and nothing else: per the house copy rule,
    // a guest-facing ordering page never carries the business model.
    serviceFee: 0.99,
    taxRate: 0.06, // Michigan sales tax on prepared food
  },

  takeAndBake: {
    price: 75,
    serves: "4 to 6",
    orderBy: "Tuesday at 6pm",
    window: "Wednesday, 4pm to 8pm",
    deliveryTowns: ["Albion", "Marshall", "Battle Creek"],
  },
};

export const nav = [
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order Online" },
  { href: "/reservations", label: "Reservations" },
  { href: "/banquets", label: "Banquets" },
  { href: "/events", label: "Events" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

/** Absolute URL base. Set per environment; never a .vercel.app host in prod. */
export const SITE_URL = "https://schulersrestaurant.com";
