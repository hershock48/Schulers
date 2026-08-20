import GiftCardForm from "@/components/GiftCardForm";
import { site } from "@/lib/site";

export const metadata = {
  title: "Gift Cards",
  description:
    "Buy a Schuler's gift card and have it emailed to whoever it is for in about ten seconds. Any amount, any hour, redeemable at the table or in Winston's Pub.",
  alternates: { canonical: "/gift-cards" },
  openGraph: {
    title: "Gift Cards | Schuler's Restaurant & Pub",
    description: "Emailed in about ten seconds. Any amount, any hour.",
    url: "/gift-cards",
    images: [{ url: "/assets/schulers/giftcards.webp", width: 1000, height: 1000, alt: "Schuler's gift cards" }],
  },
};

export default function GiftCards() {
  return (
    <>
      <div className="banner">
        <div className="wrap">
          <p className="eyebrow on-dark">Any amount, any hour</p>
          <h1>Gift Cards</h1>
          <p>
            Bought here, in their inbox in about ten seconds, good at the table or in the pub. Also
            good at {site.family.hotel.name}.
          </p>
        </div>
      </div>

      <section>
        <div className="wrap narrow">
          <GiftCardForm />
        </div>
      </section>
    </>
  );
}
