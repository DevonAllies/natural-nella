/*
 * Naturally Nella product catalogue: the single source of truth for every product on the site.
 *
 * Sources: description/Descriptions on Products .docx (copy) and the price list in
 * img/price-list/ (prices in South African rand). Do not invent product claims.
 *
 * Product fields:
 *   id        unique slug, also used in the URL hash (#product/<id>)
 *   name      product name
 *   category  key of CATEGORIES
 *   tagline   short line shown on the card and under the dialog title
 *   images    paths relative to the site root; first is the card image. [] shows a logo placeholder.
 *   variants  scents / blends available (optional)
 *   prices    [{ label, price, note?, addon? }]; card shows "From R<min>" ignoring addon items
 *   intro     array of paragraphs (empty array => "Full description coming soon.")
 *   sections  [{ title, paragraphs?: [..], list?: [{ term?, text }] }]
 *   tip, note optional single paragraphs shown at the end
 */

const CATEGORIES = {
  "home-fragrance": "Home Fragrance",
  "bath-shower": "Bath & Shower",
  "body-care": "Body Care",
};

/* ---------- Shared copy for the reed diffuser range ---------- */

const DIFFUSER_PRICES = [
  { label: "Reed diffuser small set (100 ml)", price: 120 },
  { label: "Reed diffuser big set (152 ml)", price: 180 },
  { label: "Diffuser with bamboo lid (152 ml)", price: 250 },
  { label: "Diffuser with bamboo lid (200 ml)", price: 320 },
  { label: "Diffuser refill (100 ml)", price: 90, addon: true },
];

const DIFFUSER_SECTIONS = [
  {
    title: "Reed & Bamboo Lid Diffusers",
    paragraphs: [
      "Elevate any space with our beautifully presented reed diffusers, finished with an elegant bamboo lid. Long-lasting and effortless, they release a continuous, subtle fragrance into the air—no flame, no fuss, just beautiful scent around the clock. Simply flip the reeds whenever you want to refresh the aroma.",
    ],
  },
  {
    title: "How to use",
    list: [
      { term: "Reed diffuser", text: "Unscrew the cap and remove the seal cap, then screw the cap back on and place your reeds into the bottle. Turn the reeds around every 2nd or 3rd day to refresh the fragrance." },
      { term: "Bamboo lid", text: "Unscrew the bamboo lid and remove the seal. Place the wick into the lid and screw the bamboo lid back onto the bottle with the wick in the liquid. Fragrance will disperse through the lid." },
    ],
  },
];

const DIFFUSER_TIP =
  "Place your diffuser in a spot with gentle airflow for the best scent throw, and keep away from direct sunlight. Handle with care and keep out of reach of children and pets.";

const PEONY_BLUSH_SUEDE_COPY =
  "A beautiful pairing of two fragrances. Peony Suede & Musk is a whisper of elegance and soft allure—blooming with the brightness of pink geranium and juicy red currant, touched by the sweetness of ripe pomegranate, before unfolding into a luxurious blend of ambergris and tonka bean that creates a gentle, lingering warmth. As it settles, smooth vanilla and sensual musk entwine with amber suede—a tender embrace of comfort and sophistication. Peony Rose adds a calming rosy garden scent, beautiful throughout the year.";

const PEONY_BLUSH_SUEDE_NOTES = [
  { term: "Top", text: "Peony Rose" },
  { term: "Heart", text: "Lime, Lily" },
  { term: "Base", text: "Oakmoss, Musk" },
];

/* ---------- Products ---------- */

const PRODUCTS = [
  {
    id: "midnight-muse-reed-diffuser",
    name: "Midnight Muse",
    category: "home-fragrance",
    tagline: "Sweet & enchanting reed diffuser",
    images: [
      "img/products/midnight-muse-diffuser.jpg",
      "img/products/midnight-muse-diffuser-jar.jpg",
    ],
    prices: DIFFUSER_PRICES,
    intro: [
      "A scent that is sweet but full of personality—enchanting and romantic. It opens with bright citrus and fruity notes of sweet pea, cranberry, pink grapefruit, and freesia, before unfolding into a floral heart with whispers of lilac, hibiscus, and sultry pink pepper. It settles into a warm, lingering base of patchouli, creamy sandalwood, and vanilla. A sweet and enchanting love scent.",
    ],
    sections: [
      {
        title: "Fragrance notes",
        list: [
          { term: "Top", text: "Sweet Pea, Cranberry, Pink Grapefruit, Freesia" },
          { term: "Mid", text: "Pink Pepper, Raspberry, Lilac, Hibiscus" },
          { term: "Dry", text: "Patchouli, Creamy Sandalwood, Vanilla" },
        ],
      },
      ...DIFFUSER_SECTIONS,
    ],
    tip: DIFFUSER_TIP,
  },
  {
    id: "peony-blush-suede-reed-diffuser",
    name: "Peony & Blush Suede",
    category: "home-fragrance",
    tagline: "Sweet & vibrant floral reed diffuser",
    images: [
      "img/products/peony-blush-suede-diffuser.jpg",
      "img/products/peony-blush-suede-diffuser-refill.jpg",
    ],
    prices: DIFFUSER_PRICES,
    intro: [
      PEONY_BLUSH_SUEDE_COPY,
      "Together they create a sweet and vibrant floral scent with plenty of personality, yet subtle and calming at the same time.",
    ],
    sections: [
      { title: "Fragrance notes", list: PEONY_BLUSH_SUEDE_NOTES },
      ...DIFFUSER_SECTIONS,
    ],
    tip: DIFFUSER_TIP,
  },
  {
    id: "sweet-magnolia-reed-diffuser",
    name: "Sweet Magnolia",
    category: "home-fragrance",
    tagline: "Soft, graceful floral reed diffuser",
    images: [
      "img/products/sweet-magnolia-diffuser.jpg",
      "img/products/sweet-magnolia-diffuser-refill.jpg",
    ],
    prices: DIFFUSER_PRICES,
    intro: [
      "A wonderfully sweet yet subtle floral scent, soft and graceful in character. Delicate magnolia blossom is wrapped in gentle creamy sweetness, with a hint of fresh green elegance, creating a scent that feels calm, refined, and effortlessly pretty. It lingers quietly in the air—never overpowering, always inviting—bringing a soft, serene touch to any room.",
    ],
    sections: DIFFUSER_SECTIONS,
    tip: DIFFUSER_TIP,
  },
  {
    id: "ember-noir-reed-diffuser",
    name: "Ember & Noir",
    category: "home-fragrance",
    tagline: "Black vanilla & smoky emberwood reed diffuser",
    images: ["img/products/ember-noir-diffuser.jpg"],
    prices: DIFFUSER_PRICES,
    intro: [
      "A captivating blend of rich black vanilla and smoky emberwood. This alluring scent adds a touch of warmth and sophistication to any space. Bright lime zest, orange, eucalyptus, and clove open the fragrance, leading into a floral heart of jasmine petals, gardenia, and white tuberose, before settling into a deep, smouldering base of sandalwood, charred woods, and vanilla sugar.",
    ],
    sections: [
      {
        title: "Fragrance notes",
        list: [
          { term: "Top", text: "Lime Zest, Orange, Eucalyptus, Clove" },
          { term: "Mid", text: "Jasmine Petals, Gardenia, White Tuberose" },
          { term: "Dry", text: "Sandalwood, Charred Woods, Vanilla Sugar" },
        ],
      },
      ...DIFFUSER_SECTIONS,
    ],
    tip: DIFFUSER_TIP,
  },
  {
    id: "room-linen-mist",
    name: "Room & Linen Mist",
    category: "home-fragrance",
    tagline: "For bedding, linen, wardrobes & any room",
    images: [], // no photo yet; the card shows the logo
    variants: ["Leather Bonfire", "Peony & Blush Suede", "Vanilla Sundae Soirée"],
    prices: [
      { label: "200 ml", price: 85 },
      { label: "100 ml", price: 45 },
    ],
    intro: [
      "A few spritzes is all it takes to transform the atmosphere of any space. Our Room & Linen Mist refreshes fabrics and fills the air with beautiful, long-lasting fragrance—perfect for bedding, linen cupboards, towel drawers, clothing wardrobes, or simply as an air freshener. Available in three wonderful scents, each one designed to set a different mood in your home.",
    ],
    sections: [
      {
        title: "Three wonderful scents",
        list: [
          { term: "Leather Bonfire", text: "Captures the essence of crackling fires and rugged luxury. The deep aroma of charred wood and smoky bonfire blends seamlessly with rich leather and warm tobacco, finished by earthy musk and a touch of sweet vanilla. This fragrance embodies both comfort and strength—perfect for masculine and feminine spaces alike, and wonderfully rustic and cozy." },
          { term: "Peony & Blush Suede", text: PEONY_BLUSH_SUEDE_COPY + " Fragrance notes: Top: Peony Rose | Heart: Lime, Lily | Base: Oakmoss, Musk. Together they create a sweet and vibrant floral scent with plenty of personality, yet subtle and calming at the same time." },
          { term: "Vanilla Sundae Soirée", text: "Indulge your senses with a sweet and creamy blend that captures the comforting warmth of vanilla desserts. Featuring top notes of whipped vanilla bean and cream, heart notes of custard and caramel, and a base of sugar and musk—like a cosy treat for your senses." },
        ],
      },
      {
        title: "How to use",
        paragraphs: [
          "Spray onto bedding, linen, towels, or inside clothing wardrobes. Can also be used as an air freshener—simply mist into the air to refresh any room.",
        ],
      },
    ],
    tip: "For best results, spray from a distance of about 20–30 cm and allow to dry before use. Always test on a small, inconspicuous area first, and avoid spraying directly onto delicate fabrics, silk, or leather.",
    note: "For external use only. Keep out of reach of children and pets. Avoid contact with eyes and broken skin. Flammable—keep away from open flames and direct heat. Discontinue use if irritation occurs.",
  },
  {
    id: "shower-steamers",
    name: "Shower Steamers",
    category: "bath-shower",
    tagline: "A spa-like escape in pouches or showcase jars",
    images: [
      "img/products/shower-steamer-pouches.jpg",
      "img/products/shower-steamer-jars.jpg",
      "img/products/shower-steamer-showcase-jar.jpg",
    ],
    variants: ["Breath & Bloom", "Sunset & Serenity", "Rosé & Relax"],
    prices: [
      { label: "Shower steamer pouch", price: 85 },
      { label: "Showcase jar", price: 95 },
    ],
    intro: [
      "Turn your everyday shower into a spa-like escape with our beautifully fragranced shower steamers—available in convenient pouches or elegant jars. Each steamer releases a gorgeous burst of essential oil aroma as it meets the steam and water of your shower, helping you breathe deeper, unwind fully, and reset your mood.",
    ],
    sections: [
      {
        title: "Three amazing blends",
        list: [
          { term: "Breath & Bloom", text: "Perfect for hay fever and allergy season. A wonderfully clearing blend of eucalyptus, tea tree, lavender, and peppermint essential oils." },
          { term: "Sunset & Serenity", text: "Feel happy and relaxed at the same time. A wonderfully uplifting blend of yellow mandarin, sweet orange, and lavender essential oils." },
          { term: "Rosé & Relax", text: "Perfect for those long days. A wonderfully calming blend of rose geranium and lavender essential oils." },
        ],
      },
      {
        title: "The power of essential oils in your shower",
        paragraphs: [
          "As the steamer dissolves in the warmth and steam of your shower, the essential oils are released into the air—creating an aromatic, spa-like experience you can breathe in while you wash. Here's what each oil brings:",
        ],
        list: [
          { term: "Eucalyptus", text: "A fresh, camphor-like aroma that helps clear the senses and supports easy breathing—a favourite during cold, flu, and allergy season." },
          { term: "Tea Tree", text: "Known for its purifying and cleansing properties, with a crisp, medicinal scent that refreshes and revitalises." },
          { term: "Lavender", text: "Calming and soothing; its soft floral aroma helps ease tension and prepare the mind and body for rest." },
          { term: "Peppermint", text: "Cooling and invigorating, with a bright minty aroma that awakens the senses and helps open up the breath." },
          { term: "Yellow Mandarin", text: "Sweet, sunny, and citrusy—an uplifting aroma that brings a smile and brightens your mood." },
          { term: "Sweet Orange", text: "Warm and cheerful; its juicy citrus scent is known for promoting feelings of happiness and easing stress." },
          { term: "Rose Geranium", text: "Elegant and floral; balances the emotions and promotes a sense of calm and wellbeing." },
        ],
      },
      {
        paragraphs: [
          "Whether you need to clear your head, lift your spirits, or simply unwind after a long day, there's a blend to match your mood.",
        ],
      },
      {
        title: "How to use",
        paragraphs: [
          "Place one steamer on the shower floor, away from the direct stream of water, and let the steam and warm water gently release its aroma. Breathe deeply and enjoy.",
        ],
      },
    ],
    note: "Shower Steamers are safe to use in a foot spa—NOT in the bath!",
  },
  {
    id: "bath-foot-soak",
    name: "Bath & Foot Soak",
    category: "bath-shower",
    tagline: "Two amazing blends. One simple ritual.",
    images: ["img/products/bath-foot-soaks.jpg"],
    variants: ["Rosemary & Rose Geranium", "Citrus & Rooibos"],
    prices: [
      { label: "310 g pouch", price: 45 },
      { label: "1 kg pouch", price: 140 },
    ],
    intro: [
      "Two amazing blends. One simple ritual. Our bath and foot soaks are crafted on a base of Epsom salt and coarse salt, paired with pure essential oils and botanical additions—turning an ordinary soak into a moment of genuine restoration for tired muscles, weary feet, and a busy mind.",
    ],
    sections: [
      {
        title: "Two amazing blends",
        list: [
          { term: "Rosemary & Rose Geranium", text: "An elegant, herbaceous blend of rosemary and rose geranium essential oils, complemented with rosemary leaves." },
          { term: "Citrus & Rooibos", text: "A bright, sunny blend of sweet orange and yellow mandarin essential oils, complemented with rooibos tea leaves." },
        ],
      },
      {
        title: "Rosemary & Rose Geranium blend",
        list: [
          { term: "Rosemary Essential Oil", text: "Fresh, herbaceous, and invigorating; known for its stimulating and reviving properties. It helps refresh tired muscles and the senses—ideal after a long day on your feet or following exercise. Traditionally valued for promoting circulation and a feeling of alertness." },
          { term: "Rose Geranium Essential Oil", text: "Soft, floral, and balancing; known for its calming and uplifting properties. It helps soothe the emotions, ease tension, and promote a sense of wellbeing and harmony." },
          { term: "Rosemary Leaves", text: "The dried botanical addition not only looks beautiful but releases a gentle herbal aroma as it steeps, enhancing the fresh, grounding character of the blend." },
        ],
      },
      {
        title: "Citrus & Rooibos blend",
        list: [
          { term: "Sweet Orange Essential Oil", text: "Warm, juicy, and cheerful; known for its uplifting and stress-relieving properties. Its bright citrus aroma helps lift the mood and ease everyday tension." },
          { term: "Yellow Mandarin Essential Oil", text: "Sweet, sunny, and softly citrusy; valued for its calming yet revitalising properties. It promotes feelings of happiness and relaxation—like sunshine for the senses." },
          { term: "Rooibos Tea Leaves", text: "A naturally soothing botanical, rich in antioxidants, that gently infuses the water with its warm, earthy aroma and comforting character." },
        ],
      },
      {
        title: "The base: Epsom salt & coarse salt",
        list: [
          { term: "Epsom Salt", text: "A traditional favourite for soaking, known for its ability to help relax tired, aching muscles and soothe the body after a long day." },
          { term: "Coarse Salt", text: "Adds texture to the blend and helps create a truly indulgent, spa-like soak." },
        ],
      },
      {
        title: "How to use",
        list: [
          { term: "Bath soak", text: "Add a generous handful of soak to warm running water, stir to dissolve, and step in. Soak for 15–20 minutes and breathe deeply to enjoy the aromatic essential oils. Rinse briefly after if desired, and pat skin dry." },
          { term: "Foot soak", text: "Add a small handful of soak to a basin of warm water and stir to dissolve. Rest your feet and soak for 10–15 minutes. Pat dry and follow with a moisturiser or body butter—our Whipped Magnesium Body Butter is a perfect finish." },
        ],
      },
    ],
    tip: "For an extra refreshing experience, use the Rosemary & Rose Geranium blend after exercise or at the start of your day, and the Citrus & Rooibos blend in the evening to unwind.",
    note: "For external use only. Not suitable for children. Discontinue use if irritation occurs.",
  },
  {
    id: "tidal-bloom",
    name: "Tidal Bloom",
    category: "bath-shower",
    tagline: "Oceanic shower gel & lotion",
    images: ["img/products/tidal-bloom-wash-lotion.jpg"],
    prices: [
      { label: "Shower gel & lotion set (250 ml)", price: 110 },
      { label: "Shower gel, 500 ml bottle", price: 60 },
      { label: "Shower gel, 1 L bottle", price: 95 },
    ],
    intro: [
      "Turn your daily shower into a refreshing coastal escape. Our Shower Gel gently cleanses while enveloping you in a beautiful oceanic fragrance—and our Shower Gel & Lotion Sets pair the wash with a matching lotion, so you can layer the scent and carry that fresh-from-the-sea feeling with you all day.",
    ],
    sections: [
      {
        title: "The fragrance: Oceanic",
        paragraphs: [
          "A wonderful, refreshing, and calming scent that captures the clean, invigorating essence of the open sea. Crisp marine air opens the blend, brightened by sparkling citrus and softened with delicate florals, before settling into a grounding base of driftwood and musk. Together, they evoke the feeling of a sunlit beach and gentle ocean waves—like a deep breath of sea air, any time of day.",
        ],
      },
      {
        title: "The shower gel",
        paragraphs: [
          "A gentle, refreshing formula that cleanses without stripping, leaving skin feeling clean, soft, and beautifully scented. The Oceanic fragrance blooms in the warm steam of your shower for an invigorating, spa-like start or end to your day.",
        ],
      },
      {
        title: "The shower gel & lotion set",
        paragraphs: [
          "The perfect pairing. Wash with the Shower Gel, then follow with the matching Lotion to lock in moisture and layer the Oceanic fragrance for a longer-lasting scent. Skin is left soft, smooth, and subtly perfumed—beautifully presented as a set, making it a lovely gift or a well-deserved treat for yourself.",
        ],
      },
      {
        title: "How to use",
        list: [
          { term: "Shower gel", text: "Massage onto wet skin in the shower, working into a gentle lather, then rinse thoroughly. Follow with the matching Lotion." },
          { term: "Lotion", text: "Apply to clean, dry skin after showering, massaging in gently until absorbed. Focus on drier areas such as elbows, knees, and hands." },
        ],
      },
    ],
    tip: "For a longer-lasting fragrance, layer the Shower Gel and Lotion together—the scent settles beautifully on moisturised skin.",
    note: "For external use only. Avoid contact with eyes; if contact occurs, rinse well with water. Discontinue use if irritation occurs. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.",
  },
  {
    id: "rose-lavender-reverie",
    name: "Rose & Lavender Reverie",
    category: "bath-shower",
    tagline: "Hand wash & hand lotion set",
    images: ["img/products/rose-lavender-reverie-hand-wash-lotion.jpg"],
    prices: [{ label: "Hand wash & lotion set (310 ml)", price: 200 }],
    intro: [], // TODO: awaiting description from the owner
  },
  {
    id: "whipped-magnesium-body-butter",
    name: "Whipped Magnesium Body Butter",
    category: "body-care",
    tagline: "Rich, cloud-like hydration",
    images: ["img/products/whipped-body-butter.jpg"],
    variants: ["Lemongrass & Lavender", "Rose Geranium", "Soft Whisper (new)"],
    prices: [
      { label: "Small jar (50 ml)", price: 75 },
      { label: "Medium jar (150 ml)", price: 110 },
      { label: "Large jar (250 ml)", price: 185, note: "On order only" },
    ],
    intro: [
      "A rich, cloud-like body butter that melts into skin to hydrate, soothe, and restore—powered by magnesium and pure natural oils.",
    ],
    sections: [
      {
        title: "Why you'll love it",
        paragraphs: [
          "This airy, whipped formula transforms on contact, sinking in quickly without heaviness. Magnesium works to ease muscle tension and calm cramps, while a blend of nourishing butters and oils delivers deep, lasting moisture. Skin is left feeling soft, supple, and cared for.",
        ],
      },
      {
        title: "Key ingredients & benefits",
        list: [
          { term: "Shea Butter", text: "Vitamin-rich; deeply moisturizes and soothes inflammation." },
          { term: "Cocoa Butter", text: "Locks in moisture and improves skin elasticity." },
          { term: "Beeswax", text: "Creates a breathable barrier to seal in hydration." },
          { term: "Coconut Oil", text: "Nourishes and repairs the skin barrier." },
          { term: "Castor Oil", text: "Draws in moisture and calms irritation." },
          { term: "Magnesium Oil", text: "Absorbs quickly to relieve muscle tension and calm cramps." },
        ],
      },
      {
        title: "Choose your scent",
        list: [
          { term: "Lemongrass & Lavender (essential oils)", text: "Bright, citrusy lemongrass uplifts while lavender calms the skin and senses—perfect for post-workout or evening use." },
          { term: "Rose Geranium (essential oil)", text: "Elegant and floral; balances skin and promotes emotional calm." },
          { term: "Soft Whisper (fragrance oil), new to the range", text: "A soft baby powder scent for cozy, nostalgic comfort—our only fragrance oil blend." },
        ],
      },
      {
        title: "How to use",
        paragraphs: [
          "Massage into clean, dry skin, focusing on areas of tension or dryness. A slight tingling from the magnesium is normal.",
        ],
      },
      {
        title: "Ingredients",
        paragraphs: [
          "Shea Butter, Cocoa Butter, Beeswax, Coconut Oil, Castor Oil, Magnesium Oil, Essential Oils or Fragrance Oil.",
        ],
      },
    ],
    note: "For external use only.",
  },
  {
    id: "sugar-body-scrubs",
    name: "Sugar Body Scrubs",
    category: "body-care",
    tagline: "Two amazing blends. One gorgeous glow.",
    images: [
      "img/products/teatree-geranium-sugar-scrub.jpg",
      "img/products/turmeric-lemon-sugar-scrub.jpg",
    ],
    variants: ["Tea Tree & Geranium", "Turmeric & Lemon"],
    prices: [
      { label: "150 ml jar", price: 50 },
      { label: "250 ml jar", price: 85, note: "On order or request only" },
    ],
    intro: [
      "Two amazing blends. One gorgeous glow. Our sugar body scrubs are crafted on a nourishing base of Epsom salt, sugar, and grape seed oil, blended with pure essential oils and botanical additions—gently polishing away dullness to leave skin smooth, soft, and beautifully renewed.",
    ],
    sections: [
      {
        title: "Two amazing blends",
        list: [
          { term: "Tea Tree & Geranium", text: "A fresh, balancing blend of tea tree and geranium essential oils." },
          { term: "Turmeric & Lemon", text: "A bright, warming blend of lemon essential oil and turmeric powder." },
        ],
      },
      {
        title: "Tea Tree & Geranium blend",
        list: [
          { term: "Tea Tree Essential Oil", text: "Fresh, crisp, and cleansing; well known for its purifying properties. It helps clarify the skin and refresh the senses—a wonderful choice for skin that needs a reset." },
          { term: "Geranium Essential Oil", text: "Soft, floral, and balancing; known for its calming and uplifting properties. It helps soothe the skin and promote a sense of harmony and wellbeing." },
        ],
      },
      {
        title: "Turmeric & Lemon blend",
        list: [
          { term: "Lemon Essential Oil", text: "Zesty, fresh, and invigorating; known for its uplifting and clarifying properties. Its bright citrus aroma helps energise the senses, while its astringent nature helps refresh the look of skin." },
          { term: "Turmeric Powder", text: "A treasured golden botanical, rich in natural antioxidants and traditionally valued for its soothing and brightening properties. Gently warms and revitalises the skin for a healthy-looking glow." },
        ],
      },
      {
        title: "The base: Epsom salt, sugar & grape seed oil",
        list: [
          { term: "Sugar", text: "A natural exfoliant that gently buffs away dead skin cells, revealing smoother, softer skin beneath." },
          { term: "Epsom Salt", text: "Helps relax and soothe the body while adding gentle texture to the scrub." },
          { term: "Grape Seed Oil", text: "A lightweight, silky oil rich in antioxidants and vitamin E that absorbs beautifully, leaving skin nourished and moisturised without a greasy feel." },
        ],
      },
      {
        title: "How to use",
        paragraphs: [
          "In the shower or bath, scoop a small amount of scrub into your hands and massage onto damp skin in gentle circular motions, working from the feet upwards. Focus on rough areas such as elbows, knees, and heels. Rinse thoroughly with warm water and pat skin dry. Follow with a moisturiser or body butter—our Whipped Magnesium Body Butter is a perfect finish. Use 2–3 times per week for best results.",
        ],
      },
    ],
    tip: "For a refreshing, clarifying experience, reach for Tea Tree & Geranium. For a bright, warming glow, choose Turmeric & Lemon.",
    note: "For external use only. Not suitable for children. Turmeric may temporarily tint light-coloured fabrics and skin—rinse well after use. Avoid use on broken or irritated skin. Discontinue use if irritation occurs.",
  },
  {
    id: "cold-pressed-castor-oil",
    name: "Pure Cold Pressed Castor Oil",
    category: "body-care",
    tagline: "Pure. Natural. Powerful.",
    images: ["img/products/castor-oil.jpg"],
    prices: [
      { label: "200 ml", price: 150 },
      { label: "100 ml", price: 95 },
    ],
    intro: [
      "A single, pure ingredient with a long history of beauty and wellness use. Our cold-pressed castor oil is unrefined and rich in natural fatty acids—most notably ricinoleic acid—along with vitamin E, giving it deeply nourishing and protective properties for skin, hair, brows, lashes, and nails.",
    ],
    sections: [
      {
        title: "Why cold pressed?",
        paragraphs: [
          "Cold pressing extracts the oil without high heat, preserving its natural nutrients and keeping it pure and unrefined. Unlike darker, roasted varieties, cold-pressed castor oil is lighter in colour and consistency, making it easier to apply and absorb.",
        ],
      },
      {
        title: "For dry or flaky skin",
        paragraphs: [
          "Castor oil is deeply moisturising and helps reinforce the skin's barrier, reducing moisture loss. It is especially suited to dry patches, elbows, and rough areas, leaving skin soft and supple.",
        ],
        list: [
          { term: "How to use", text: "Warm a few drops between your palms and massage into clean, dry skin using gentle circular motions. For a lighter application, mix 1–2 drops into your usual moisturiser." },
        ],
      },
      {
        title: "For hair & scalp",
        paragraphs: [
          "Rich in fatty acids and vitamin E, castor oil conditions strands, adds shine, and nourishes the scalp for healthier-looking hair.",
        ],
        list: [
          { term: "How to use", text: "Massage a small amount into the scalp and through the ends of your hair. Leave for 30 minutes or overnight, then rinse with a gentle shampoo. A little goes a long way—too much can weigh hair down." },
        ],
      },
      {
        title: "For eyebrows & eyelashes",
        paragraphs: [
          "With regular use, castor oil helps condition brow and lash hairs, supporting a fuller, healthier appearance.",
        ],
        list: [
          { term: "How to use", text: "Using a clean mascara wand or cotton bud, apply a tiny amount to brows and along the lash line each night. Avoid direct contact with the eyes." },
        ],
      },
      {
        title: "For nails & cuticles",
        paragraphs: [
          "Castor oil softens and moisturises dry cuticles and helps strengthen brittle nails.",
        ],
        list: [
          { term: "How to use", text: "Massage one drop into each nail bed and cuticle, working it in gently." },
        ],
      },
    ],
    note: "For external use only. Patch test on a small area before first use and discontinue if irritation occurs. Avoid contact with eyes. Keep out of reach of children. Store in a cool, dark place.",
  },
];

/* ---------- Contact ---------- */

const CONTACT = {
  instagram: { handle: "@naturallynella", url: "https://www.instagram.com/naturallynella/" },
  email: "naturallynella3@gmail.com",
  whatsapp: "27845051127", // Danelle, international format for wa.me links
  phones: [
    { name: "Danelle", display: "084 505 1127", tel: "+27845051127" },
    { name: "Cathy", display: "072 338 9601", tel: "+27723389601" },
  ],
};
