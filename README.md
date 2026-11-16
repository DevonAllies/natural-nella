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

All products, prices and contact details live in [`js/products.js`](js/products.js). The comment at the top of that file explains each field. In short, each product has `prices` (in rand), `intro` paragraphs, and `sections` with a title plus paragraphs or a list. A product can also have an optional `tip` and `note`. If a product's `intro` is empty, the site shows "More details coming soon" and suggests asking on WhatsApp.

To add a product, add an entry to `PRODUCTS` and put its photos in `img/products/`. A product with no photos (`images: []`) shows the logo instead.

## Ordering

Visitors add products to a basket (choosing size, scent and quantity), then send the whole order to Danelle's WhatsApp with their name and whether they want delivery or collection. Nothing is paid on the site: availability, delivery costs and payment are arranged on WhatsApp. The basket is saved in the visitor's own browser.

## Editing other copy

The About section ("Our story"), the Gifts section and the contact details are in [`index.html`](index.html). The About text is the owner's own story, so don't reword it. The contact block in `index.html` is static, so keep it in sync with `CONTACT` in `js/products.js`.

## Contact form

The contact form is delivered to the business email by [FormSubmit](https://formsubmit.co). The first submission sends an activation email to that address, and no messages are delivered until the link in that email is clicked.

## Publishing on GitHub Pages

In the repository settings, go to **Pages**, choose **Deploy from a branch**, then pick `main` and `/ (root)`.
