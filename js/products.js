/*
 * Naturally Nella product catalogue.
 *
 * This is the single source of truth for every product shown on the site.
 * To add the real copy, fill in `description` (plain text; blank lines start new paragraphs).
 * While `description` is empty the site shows "Full description coming soon."
 *
 * Fields:
 *   id          unique slug, also used in the URL hash (#product/<id>)
 *   name        product name as printed on the label
 *   category    must match a key in CATEGORIES below
 *   tagline     short line shown on the card
 *   description long description shown in the product dialog (TODO: awaiting copy)
 *   variants    scents / options available (optional)
 *   sizes       sizes printed on the labels (optional)
 *   details     extra facts taken from the label, e.g. ingredients (optional)
 *   images      paths relative to the site root; the first one is the card image
 */

const CATEGORIES = {
  "home-fragrance": "Home Fragrance",
  "bath-shower": "Bath & Shower",
  "body-care": "Body Care",
};

const PRODUCTS = [
  {
    id: "sweet-magnolia-reed-diffuser",
    name: "Sweet Magnolia",
    category: "home-fragrance",
    tagline: "Reed diffuser & refill",
    description: "",
    variants: ["Reed diffuser", "Reed diffuser refill"],
    sizes: ["200 ml"],
    images: [
      "img/products/sweet-magnolia-diffuser.jpg",
      "img/products/sweet-magnolia-diffuser-refill.jpg",
    ],
  },
  {
    id: "peony-blush-suede-reed-diffuser",
    name: "Peony & Blush Suede",
    category: "home-fragrance",
    tagline: "Reed diffuser & refill",
    description: "",
    variants: ["Reed diffuser", "Reed diffuser refill"],
    sizes: ["200 ml"],
    images: [
      "img/products/peony-blush-suede-diffuser.jpg",
      "img/products/peony-blush-suede-diffuser-refill.jpg",
    ],
  },
  {
    id: "midnight-muse-reed-diffuser",
    name: "Midnight Muse",
    category: "home-fragrance",
    tagline: "Reed diffuser",
    description: "",
    sizes: ["200 ml", "152 ml"],
    images: [
      "img/products/midnight-muse-diffuser.jpg",
      "img/products/midnight-muse-diffuser-jar.jpg",
    ],
  },
  {
    id: "ember-noir-reed-diffuser",
    name: "Ember & Noir",
    category: "home-fragrance",
    tagline: "Black vanilla & emberwood reed diffuser",
    description: "",
    sizes: ["200 ml", "152 ml"],
    images: ["img/products/ember-noir-diffuser.jpg"],
  },
  {
    id: "tidal-bloom",
    name: "Tidal Bloom",
    category: "bath-shower",
    tagline: "Body wash & body lotion",
    description: "",
    variants: ["Body wash", "Body lotion"],
    sizes: ["250 ml"],
    images: ["img/products/tidal-bloom-wash-lotion.jpg"],
  },
  {
    id: "rose-lavender-reverie",
    name: "Rose & Lavender Reverie",
    category: "bath-shower",
    tagline: "Hand wash & hand lotion",
    description: "",
    variants: ["Hand wash", "Hand lotion"],
    sizes: ["310 ml"],
    images: ["img/products/rose-lavender-reverie-hand-wash-lotion.jpg"],
  },
  {
    id: "shower-steamers",
    name: "Shower Steamers",
    category: "bath-shower",
    tagline: "Showcase pouches, jars & bars",
    description: "",
    variants: ["Rose & Relax", "Breathe & Bloom", "Sunset & Serenity"],
    images: [
      "img/products/shower-steamer-pouches.jpg",
      "img/products/shower-steamer-jars.jpg",
      "img/products/shower-steamer-showcase-jar.jpg",
    ],
  },
  {
    id: "bath-foot-soak",
    name: "Bath & Foot Soak",
    category: "bath-shower",
    tagline: "Epsom & Dead Sea salt soaks",
    description: "",
    variants: ["Rosemary & Rose Geranium", "Citrus & Rooibos"],
    details: [
      "Rosemary & Rose Geranium: Epsom salt, Dead Sea salt, rosemary, rose geranium essential oil, dried herbs & flowers, natural colour.",
      "Citrus & Rooibos: Epsom salt, Dead Sea salt, rooibos, sweet orange & yellow mandarin essential oil, natural colour.",
    ],
    images: ["img/products/bath-foot-soaks.jpg"],
  },
  {
    id: "whipped-body-butter",
    name: "Whipped Body Butter",
    category: "body-care",
    tagline: "No added preservatives · no artificial fragrance",
    description: "",
    variants: ["Magnesium & Lemongrass", "Magnesium & Rose Geranium"],
    sizes: ["150 ml"],
    details: [
      "Made with shea butter, coconut oil, argan kernel oil, jojoba seed oil, cocoa seed butter and vitamin E, scented with essential oils.",
      "No added preservatives. No artificial fragrance.",
    ],
    images: ["img/products/whipped-body-butter.jpg"],
  },
  {
    id: "teatree-geranium-sugar-scrub",
    name: "Teatree & Geranium Sugar Scrub",
    category: "body-care",
    tagline: "Refresh & rejuvenate",
    description: "",
    images: ["img/products/teatree-geranium-sugar-scrub.jpg"],
  },
  {
    id: "turmeric-lemon-sugar-scrub",
    name: "Turmeric & Lemon Sugar Scrub",
    category: "body-care",
    tagline: "Reveal your radiance",
    description: "",
    images: ["img/products/turmeric-lemon-sugar-scrub.jpg"],
  },
  {
    id: "cold-pressed-castor-oil",
    name: "Cold Pressed Castor Oil",
    category: "body-care",
    tagline: "100% pure cold pressed castor oil",
    description: "",
    sizes: ["300 ml", "100 ml"],
    images: ["img/products/castor-oil.jpg"],
  },
];
