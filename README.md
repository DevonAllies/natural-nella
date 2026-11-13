# Naturally Nella

Website for **Naturally Nella**: handmade bath & body products.

A static site (plain HTML, CSS and JavaScript, no build step) that can be hosted on GitHub Pages.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly in a browser also works.

## Editing products

All products live in [`js/products.js`](js/products.js). To add a product description, fill in its `description` field (blank lines start new paragraphs). Until a description is filled in, the site shows "Full description coming soon."

To add a product, add an entry to `PRODUCTS` and put its photos in `img/products/`.

## Publishing on GitHub Pages

In the repository settings, go to **Pages**, choose **Deploy from a branch**, then pick `main` and `/ (root)`.
