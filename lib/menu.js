/**
 * Schuler's menu, taken from their own site on 20 August 2026.
 *
 * Names, descriptions and prices are theirs, harvested from the Five Star
 * Restaurant Menu records at /wp-json/wp/v2/fdm-menu-item and the rendered
 * prices on /menu/ and /our-carryout-menu/. Nothing here is invented. Where an
 * item is priced by portion on their carryout menu and by plate in the dining
 * room, both numbers are kept, because they really are two different products.
 *
 * `orderable: true` marks what Jelly carries. Their carryout menu is the
 * source for that, not a guess about what travels well.
 */

export const menu = [
  {
    id: "beginnings",
    name: "Beginnings",
    items: [
      { id: "meatballs", name: "Schuler's Barbecue Meatballs", desc: "A famous tradition.", price: 18, carryout: { price: 17, unit: "pint" }, orderable: true, photo: "/assets/schulers/food-meatballs.webp" },
      { id: "cheese-spread", name: "Heritage Cheese Spread Platter", desc: "House-made crackers, celery, carrots, and fresh bread.", price: 16,
        /* The $7 carryout item is their 8 oz TUB, not the platter. Selling a
           "$7 platter" promises crackers and celery that do not come. Their own
           carryout menu names it plainly, so ours does too. */
        carryout: { name: "Heritage Cheese Spread", price: 7, unit: "8 oz tub" }, orderable: true },
      { id: "shrimp", name: "Gulf Shrimp Cocktail", desc: "Lemon, cocktail sauce.", price: 18, orderable: true },
      { id: "crab-cakes", name: "Jumbo Lump Crab Cakes", desc: "Served with mixed greens, tomato and cucumber salad, and a mustard chive vinaigrette.", price: 23, orderable: true },
      { id: "brussels", name: "Crispy Brussels Sprouts", desc: "With bacon, sriracha, honey, and lime. Available without bacon.", price: 17, orderable: true },
      { id: "corn-dip", name: "Street Corn Dip", desc: "A creamy blend of corn, poblano, garlic and cheese, baked and topped with mild salsa. Served with pita chips.", price: 18, orderable: true },
      { id: "wings", name: "Chicken Wings", desc: "Breaded, served with bleu cheese dip.", price: 16, unit: "half dozen", orderable: true },
      { id: "charcuterie", name: "Charcuterie Board", desc: "A curated selection of premium meats, cheeses, dried fruits, and crackers.", price: 25 },
    ],
  },
  {
    id: "soups-salads",
    name: "Soups and Salads",
    items: [
      { id: "swiss-onion", name: "Schuler's Classic Swiss Onion Soup", desc: "Dark beer, Swiss, Parmesan.", price: 10, carryout: { price: 15, unit: "pint" }, orderable: true },
      { id: "chowder", name: "Schuler's Seafood Chowder", desc: "Shrimp, scallops, crab, clams, potatoes, corn.", price: 12, carryout: { price: 18, unit: "pint" }, orderable: true },
      { id: "tomato-basil", name: "Tomato Basil", desc: "Creamy fresh tomato basil.", price: 9, carryout: { price: 13.5, unit: "pint" }, orderable: true },
      { id: "schuler-salad", name: "Schuler Salad", desc: "Fresh garden greens, cucumber, tomato, bacon, black olives, Swiss and bleu cheese, creamy garlic dressing.", price: 16, orderable: true, photo: "/assets/schulers/food-salad.webp" },
      { id: "stewarts", name: "Stewart's Chicken Salad", desc: "Grilled or crispy, fresh greens, mandarin oranges, chopped egg, sharp cheddar, black olives, vegetable garnishes, buttermilk ranch.", price: 23, orderable: true },
      { id: "traverse-bay", name: "Traverse Bay Salad", desc: "Spring greens, dried cherries, bleu cheese, spiced pecans, red onion, cucumber, tomato, balsamic vinaigrette.", price: 16, orderable: true },
      { id: "chicken-fruit", name: "Chicken Salad and Fresh Fruit", desc: "House-made roasted chicken salad with seasonal fresh fruit and banana bread.", price: 20, orderable: true },
      { id: "caesar", name: "Caesar Salad", desc: "", price: 15, orderable: true },
      { id: "garden", name: "Garden Salad", desc: "", price: 9, orderable: true },
    ],
  },
  {
    id: "pub",
    name: "Winston's Pub Favorites",
    blurb: "The pub side of the house. Everything here travels, and everything here can be ordered ahead.",
    items: [
      { id: "winston-burger", name: "Winston Burger", desc: "Cheddar, bacon, lettuce, tomato, red onion, tarragon Russian dressing, french fries.", price: 21, orderable: true, photo: "/assets/schulers/food-burger.webp" },
      { id: "brisket", name: "Two Napkin Beef Brisket Sandwich", desc: "Hickory smoked brisket on jalapeño focaccia, horseradish mayo, chipotle barbecue, bread and butter pickle, fried onion, cheddar, french fries.", price: 23, orderable: true, photo: "/assets/schulers/food-brisket-mac.webp" },
      { id: "french-dip", name: "Winston's French Dip", desc: "Shaved roast beef, sautéed onion, Swiss, au jus, french fries.", price: 21, orderable: true },
      { id: "reuben", name: "Turkey Reuben", desc: "Roasted turkey, slaw, Swiss, grilled cranberry walnut bread, french fries.", price: 20, orderable: true },
      { id: "tuscan-club", name: "Loaded Tuscan Chicken Club", desc: "Pulled chicken, roasted red pepper, pepper rings, caramelized onion, bacon, lettuce, tomato, pesto aioli and provolone on grilled ciabatta, french fries.", price: 20, orderable: true },
      { id: "quesadilla", name: "Chicken Quesadilla", desc: "Flour tortilla with tomato, onion, cilantro-pepper ranch, and cheese. With fresh guacamole, salsa, and sour cream.", price: 20, orderable: true },
      { id: "fish-chips", name: "Fish and Chips", desc: "Beer-battered Atlantic cod, french fries and cole slaw.", price: 28, orderable: true },
      { id: "tenders", name: "Really Good Chicken Tenders", desc: "Served with barbecue or ranch, french fries.", price: 20, orderable: true },
      { id: "triple-cheese", name: "Triple Cheese and Tomato Basil Soup", desc: "Tomato, spinach, boursin, cheddar, Swiss, grilled sourdough, chips, and tomato basil soup.", price: 19, orderable: true },
    ],
  },
  {
    id: "entrees",
    name: "Entrées",
    blurb: "The dining room. Prime rib in the English tradition, since the room opened.",
    items: [
      { id: "prime-rib", name: "Schuler's Classic Roast Prime Rib of Beef", desc: "In the English tradition. End cuts may be available if your timing is right. Served with Yukon Gold potatoes and a green bean medley.", price: 52, unit: "Schuler Cut, 12 oz", orderable: true, photo: "/assets/schulers/food-primerib.webp" },
      { id: "filet", name: "Filet Mignon", desc: "Finished with a garlic-herb compound butter and topped with fried onions. Served with mashed potatoes and asparagus.", price: 52, orderable: true },
      { id: "pot-roast", name: "New England Braised Pot Roast", desc: "Topped with bordelaise and fried onions. Served with a green bean medley and mashed potatoes.", price: 48, orderable: true },
      { id: "halibut", name: "Halibut with Cherries and Mushrooms", desc: "Pan seared halibut with a cherry mushroom beurre blanc. Served with mashed potatoes and asparagus.", price: 45, orderable: true },
      { id: "chicken", name: "Florentine Stuffed Chicken", desc: "Herb crusted, stuffed with spinach, feta, roasted pepper, mushroom and sundried tomato, with Florentine cream sauce. Served with mashed potatoes and asparagus.", price: 39, orderable: true, photo: "/assets/schulers/food-chicken.webp" },
      { id: "salmon", name: "North Atlantic Salmon", desc: "Marinated in a peppercorn brine, topped with beurre blanc and pickled onions.", price: 39, orderable: true },
      { id: "lobster-mac", name: "Lobster Mac and Cheese", desc: "Lobster with sautéed asparagus, carrots and onions, tossed with cavatappi in a rich Gruyère and cheddar sauce.", price: 39, orderable: true, photo: "/assets/schulers/food-mac.webp" },
    ],
  },
  {
    id: "children",
    name: "Children's",
    blurb: "Available with an adult meal.",
    items: [
      { id: "kids-tenders", name: "Children's Chicken Tenders", desc: "Comes with choice of side.", price: 13, orderable: true },
      { id: "kids-fish", name: "Children's Fish and Chips", desc: "Comes with choice of side.", price: 16, orderable: true },
      { id: "kids-quesadilla", name: "Children's Quesadilla", desc: "Comes with choice of side.", price: 12, orderable: true },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    items: [
      { id: "pecan-ball", name: "Pecan Ball", desc: "Vanilla bean ice cream rolled in roasted pecans, served with hot fudge.", price: 12.5, orderable: true },
      { id: "cheesecake", name: "Baker's New York Style Cheesecake", desc: "On a graham cracker crust with mixed berry topping.", price: 11.5, orderable: true },
      { id: "seasonal-cake", name: "Seasonal Cake", desc: "House-made carrot cake or hummingbird cake.", price: 11.5, orderable: true },
    ],
  },
];

/** Flat list of everything Jelly carries, at its carryout price where one exists. */
export function orderableItems() {
  const out = [];
  for (const sec of menu) {
    for (const it of sec.items) {
      if (!it.orderable) continue;
      out.push({
        ...it,
        name: it.carryout?.name || it.name,
        section: sec.name,
        sectionId: sec.id,
        orderPrice: it.carryout ? it.carryout.price : it.price,
        orderUnit: it.carryout ? it.carryout.unit : it.unit || null,
      });
    }
  }
  return out;
}

export function findItem(id) {
  return orderableItems().find((i) => i.id === id) || null;
}

export const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
