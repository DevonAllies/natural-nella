# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing and catalogue website for **Naturally Nella**, a small business selling handmade bath & body products (reed diffusers, body butters, sugar scrubs, shower steamers, soaks, washes and lotions, castor oil). The repo is `git@github.com:DevonAllies/natural-nella.git` and the site is intended for GitHub Pages, served from the root of `main`. `.nojekyll` disables Jekyll processing.

The site is static HTML/CSS/vanilla JS with no build step, package manager or tests. To preview it, run `python3 -m http.server 8000` and open http://localhost:8000.

## Architecture

- `index.html` holds the single-page layout: header, hero, values strip, shop, about, gifts, contact, footer, and a `<dialog>` for product details.
- `js/products.js` is the **single source of truth for the catalogue**. It defines the `CATEGORIES` map and the `PRODUCTS` array as plain globals, loaded via `<script>` (not fetched JSON), so the site also works from `file://`. Product facts (names, sizes, variants, ingredients) were transcribed from the labels in the product photos. Don't invent product claims.
- `js/main.js` renders the category filter tabs and product cards from that data, and opens the product dialog. The dialog is driven by the URL hash `#product/<id>`, so product links are shareable and the back button closes it.
- `css/styles.css` contains all styles. Design tokens are on `:root`.

## Content status

Product descriptions are **still pending from the business owner**. Every `description` field in `js/products.js` is currently `""`, and the dialog shows "Full description coming soon." until it is filled. The About section copy in `index.html` is placeholder text (marked with a TODO comment) until the owner supplies their story. The only contact channel known so far is Instagram, @naturallynella (from the market-stall sign photo).

## Brand rules

- **Colours must match the logos.** The palette is sampled from `img/logo/`: rosewood red `#8C4446` and charcoal `#4E5351` on white. Every other colour in `styles.css` is a tint or shade of these. Don't introduce unrelated hues.
- The logo files are JPGs with white backgrounds. They use `mix-blend-mode: multiply` so they sit cleanly on the rose-tint sections. Keep page backgrounds light wherever a logo appears.
- Logo variants: `logo-full.jpg` (stacked monogram + wordmark + tagline), `logo-monogram.jpg` (the "N." in a circle, also the favicon), `logo-wordmark.jpg` (horizontal line-art hands + wordmark), and `logo-wordmark-trimmed.jpg` (the same wordmark with the white margin cropped, used in the header).
- Fonts: Cormorant Garamond (headings) and Jost (body, plus the letter-spaced uppercase labels that echo the logo's "HANDMADE BATH & BODY PRODUCTS").

## Images

Product photos in `img/products/` have descriptive filenames. The originals were WhatsApp exports (`IMG-YYYYMMDD-WA####.jpg`) and were renamed. New photos from the owner will arrive with WhatsApp names, so view each one and rename it before referencing it. `market-stall-gift-sets.jpg` is used in the Gifts section, not as a product.
