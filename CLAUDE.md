# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing and catalogue website for **Naturally Nella**, a small business selling handmade bath & body products (reed diffusers, body butters, sugar scrubs, shower steamers, soaks, washes and lotions, castor oil). The repo is `git@github.com:DevonAllies/natural-nella.git` and the site is intended for GitHub Pages, served from the root of `main`. `.nojekyll` disables Jekyll processing.

The site is static HTML/CSS/vanilla JS with no build step, package manager or tests. To preview it, run `python3 -m http.server 8000` and open http://localhost:8000.

## Architecture

- `index.html` holds the single-page layout: header, hero, values strip, shop, about, gifts, contact, footer, and a `<dialog>` for product details.
- `js/products.js` is the **single source of truth for the catalogue and contact details**. It defines `CATEGORIES`, `PRODUCTS` and `CONTACT` as plain globals, loaded via `<script>` (not fetched JSON), so the site also works from `file://`. Each product has `prices` (in rand; `addon: true` items such as refills are excluded from the card's "From R…" price), `intro` paragraphs, structured `sections` (title + paragraphs and/or `{term, text}` lists), and an optional `tip` and `note`. The reed diffusers share their prices, how-to and tip through constants at the top of the file.
- `js/main.js` renders the category filter tabs and product cards from that data, and opens the product dialog (prices, a WhatsApp order link prefilled with the product name, then the full description). The dialog is driven by the URL hash `#product/<id>`, so product links are shareable and the back button closes it. A product with `images: []` shows the monogram logo as a placeholder.
- `css/styles.css` contains all styles. Design tokens are on `:root`.

## Content sources

The owner's source material is kept locally but is **git-ignored** (the repo is public): `description/Descriptions on Products .docx` holds the product copy, and `img/price-list/` holds the price list and castor oil flyer. Copy and prices on the site are transcribed from these. Where they conflict with the older product photos' labels (body butter scents and ingredients, soak salts, castor oil sizes), the documents win. Product names follow the label spelling, e.g. "Breathe & Bloom".

Still outstanding: a description for Rose & Lavender Reverie (it currently shows "Full description coming soon."), a photo for Room & Linen Mist, and the owner's own About story (the About text in `index.html` is a placeholder with a TODO comment). Contact details are WhatsApp/call Danelle 084 505 1127 (also the `wa.me` order number), Cathy 072 338 9601, and Instagram @naturallynella.

## Brand rules

- **Colours must match the logos.** The palette is sampled from `img/logo/`: rosewood red `#8C4446` and charcoal `#4E5351` on white. Every other colour in `styles.css` is a tint or shade of these. Don't introduce unrelated hues.
- The logo files are JPGs with white backgrounds. They use `mix-blend-mode: multiply` so they sit cleanly on the rose-tint sections. Keep page backgrounds light wherever a logo appears.
- Logo variants: `logo-full.jpg` (stacked monogram + wordmark + tagline), `logo-monogram.jpg` (the "N." in a circle, also the favicon), `logo-wordmark.jpg` (horizontal line-art hands + wordmark), and `logo-wordmark-trimmed.jpg` (the same wordmark with the white margin cropped, used in the header).
- Fonts: Cormorant Garamond (headings) and Jost (body, plus the letter-spaced uppercase labels that echo the logo's "HANDMADE BATH & BODY PRODUCTS").

## Images

Product photos in `img/products/` have descriptive filenames. The originals were WhatsApp exports (`IMG-YYYYMMDD-WA####.jpg`) and were renamed. New photos from the owner will arrive with WhatsApp names, so view each one and rename it before referencing it. `market-stall-gift-sets.jpg` is used in the Gifts section, not as a product.
