import OrderClient from "@/components/OrderClient";
import { site } from "@/lib/site";

export const metadata = {
  title: "Order Online",
  description:
    "Order Schuler's carryout online. The full menu, a pickup time you choose, paid before you arrive. Marshall, Michigan.",
  alternates: { canonical: "/order" },
  openGraph: {
    title: "Order Online | Schuler's Restaurant & Pub",
    description: "The full carryout menu, ordered on your phone and ready when you say.",
    url: "/order",
    images: [{ url: "/assets/schulers/food-brisket-mac.webp", width: 1000, height: 667, alt: "Carryout from Schuler's" }],
  },
};

/* A page whose content depends on the current time cannot be cached. Rendering
   per request keeps the pickup slots honest; the interactive part recomputes in
   the browser anyway. */
export const dynamic = "force-dynamic";

export default function OrderPage() {
  return (
    <>
      <div className="banner">
        <div className="wrap">
          <p className="eyebrow on-dark">Carryout &middot; {site.hoursShort}</p>
          <h1>Order Online</h1>
          <p>
            Pick your food, pick a time, and it is bagged and waiting at the door. No calling and
            holding while somebody finds a pen.
          </p>
        </div>
      </div>
      <OrderClient />
    </>
  );
}
