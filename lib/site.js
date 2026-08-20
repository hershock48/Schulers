/**
 * Every business fact about Schuler's lives here, so a correction is one edit.
 *
 * This exists because their live site publishes the hotel as five rooms on one
 * domain and eight on another, the venue as 250 guests in one place and 300 in
 * another, and four different sets of opening hours across pages that are all
 * still live. Every one of those is the same failure: the fact was typed into
 * the page instead of read from somewhere.
 *
 * ANY surface that cannot read from this file gets named in the README.
 * Right now that list is: the proposal at public/pitch/schulers/index.html,
 * which is deliberately standalone, and the OG images, which are pixels.
 */

export const site = {
  name: "Schuler's Restaurant & Pub",
  shortName: "Schuler's",
  since: 1909,
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

  banquetRooms: [
    { name: "Signature Room", seats: 45, note: "The intimate one, for a dinner where everyone can hear each other." },
    { name: "Heritage East", seats: 45 },
    { name: "Heritage West", seats: 30 },
    { name: "Heritage Center", seats: 30 },
    { name: "Heritage Room, combined", seats: 120, note: "All three Heritage rooms opened into one." },
  ],
  banquetMax: 250,

  // From the April 2026 banquet packet. The November 2024 packet is still live
  // on their site at its old URL with lower numbers, which is finding six.
  banquets: {
    packetDate: "April 2026",
    plated: [
      { tier: "Classic", price: 52 },
      { tier: "Premium", price: 63 },
      { tier: "Signature", price: 73 },
    ],
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
