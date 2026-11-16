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

Visitors add products to a basket (choosing size, scent and quantity). After each add, the product window offers "Continue shopping" or "Go to basket", so nobody has to use the phone's back button. They then send the whole order to Danelle's WhatsApp with an order number, their name, phone number, email (optional) and how they want it delivered: collection in Kuils River, local delivery, or Aramex courier (R90, added to the total). The delivery options and fees are in `DELIVERY` at the bottom of `js/products.js`. For delivery, customers fill in their street, complex/unit (optional), suburb, town and postal code, and can tap "Use my current location" to add a map pin. The collection address is kept off the website on purpose; collection customers are told Danelle will send it with a map pin on WhatsApp when she confirms the order. Each order includes a Google Maps link to the address (and the pin, if shared) so Danelle can tap through to directions. The basket empties once the order is sent, and a copy of the order is emailed to the business inbox through FormSubmit. Danelle sends the invoice herself once she has confirmed the order. Nothing is paid on the site: availability, delivery costs and payment are arranged on WhatsApp. The basket is saved in the visitor's own browser.

### Order sheet (optional)

Orders can also be recorded in a Google Sheet, which numbers them NN-0001, NN-0002 and so on and has columns for status and payment. Follow [`google-apps-script/SETUP.md`](google-apps-script/SETUP.md), then put the web app URL in `ORDER_SHEET` in `js/products.js`. Until then, orders get random numbers like NN-261116-K7Q2.

#### How order numbers work

- **When the order reaches the sheet**, it gets the next number in the series (NN-0001, NN-0002, …). Only the sheet hands these out, and its count only goes up when it actually saves an order. Deleting a row never frees its number for reuse.
- **When the sheet can't be reached** (the website waits up to 20 seconds), the order still goes to WhatsApp and the business inbox, but with a number made from the date plus four random characters, like `NN-261116-KF8K`. The sheet's count doesn't change, so the next order that reaches the sheet carries on in sequence. For example, NN-0004 is saved, NN-261116-AB7Q misses the sheet, and the next order gets NN-0005.
- The two formats can never clash. Two missed orders could only share a number if they fell on the same day and drew the same four characters, which is about a one-in-a-million chance.
- **Adding a missed order by hand:** the order email says "Not in the order sheet". Copy the details into a new row at the bottom of the Orders tab and **keep the customer's date-and-letters number**. Never give it the next NN-000x number: the sheet doesn't know about numbers typed in by hand, so it would give that same number to the next website order.
- **A gap in the series** (NN-0004, then NN-0006) means the sheet saved an order but the website stopped waiting before the number came back, so the customer got a date-and-letters number instead. Match it up using the order email.

## Editing other copy

The About section ("Our story"), the Gifts section and the contact details are in [`index.html`](index.html). The About text is the owner's own story, so don't reword it. The contact block in `index.html` is static, so keep it in sync with `CONTACT` in `js/products.js`.

## Contact form

The contact form is delivered to the business email by [FormSubmit](https://formsubmit.co). The first submission sends an activation email to that address, and no messages are delivered until the link in that email is clicked.

## Publishing on GitHub Pages

In the repository settings, go to **Pages**, choose **Deploy from a branch**, then pick `main` and `/ (root)`.
