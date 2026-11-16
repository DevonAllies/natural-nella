(() => {
  "use strict";

  const grid = document.querySelector(".product-grid");
  const filterBar = document.querySelector(".filters");
  const dialog = document.querySelector(".product-dialog");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "text") node.textContent = v;
      else if (k === "class") node.className = v;
      else node.setAttribute(k, v);
    }
    for (const c of [].concat(children)) if (c) node.append(c);
    return node;
  };

  /* ---------- Filters ---------- */
  let activeFilter = "all";

  function renderFilters() {
    const options = [["all", "All"], ...Object.entries(CATEGORIES)];
    filterBar.replaceChildren(
      ...options.map(([key, label]) =>
        el("button", {
          class: "filter-btn",
          role: "tab",
          "aria-selected": String(key === activeFilter),
          "data-filter": key,
          text: label,
        })
      )
    );
  }

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    renderFilters();
    renderProducts();
  });

  /* ---------- Product grid ---------- */
  const PLACEHOLDER_IMG = "img/logo/logo-monogram.jpg";
  const formatPrice = (n) => `R${n}`;

  function fromPrice(p) {
    const main = (p.prices || []).filter((x) => !x.addon);
    return main.length ? Math.min(...main.map((x) => x.price)) : null;
  }

  function whatsappLink(product) {
    const text = product
      ? `Hi Naturally Nella! I'd like to order / ask about: ${product.name}`
      : "Hi Naturally Nella!";
    return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
  }

  function renderProducts() {
    const items = PRODUCTS.filter(
      (p) => activeFilter === "all" || p.category === activeFilter
    );
    grid.replaceChildren(
      ...items.map((p) => {
        const from = fromPrice(p);
        const hasImg = p.images.length > 0;
        return el("article", { class: "product-card" }, [
          el("button", { class: "card-hit", "data-id": p.id, "aria-label": `View ${p.name}` }, [
            el("div", { class: hasImg ? "card-media" : "card-media is-placeholder" }, [
              el("img", { src: hasImg ? p.images[0] : PLACEHOLDER_IMG, alt: hasImg ? p.name : "", loading: "lazy" }),
              p.images.length > 1
                ? el("span", { class: "card-count", text: `${p.images.length} photos` })
                : null,
            ]),
            el("div", { class: "card-body" }, [
              el("p", { class: "card-category", text: CATEGORIES[p.category] }),
              el("h3", { class: "card-title", text: p.name }),
              el("p", { class: "card-tagline", text: p.tagline }),
              from !== null
                ? el("p", { class: "card-price", text: `From ${formatPrice(from)}` })
                : null,
            ]),
          ]),
        ]);
      })
    );
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-id]");
    if (btn) location.hash = `product/${btn.dataset.id}`;
  });

  /* ---------- Product dialog ---------- */
  const dlg = {
    mainImg: dialog.querySelector(".dialog-main-img"),
    thumbs: dialog.querySelector(".dialog-thumbs"),
    category: dialog.querySelector(".dialog-category"),
    title: dialog.querySelector("#dialog-title"),
    tagline: dialog.querySelector(".dialog-tagline"),
    description: dialog.querySelector(".dialog-description"),
    order: dialog.querySelector(".dialog-order"),
    sizes: dialog.querySelector(".dialog-sizes"),
    prices: dialog.querySelector(".dialog-prices"),
    variantField: dialog.querySelector(".dialog-variant"),
    variant: dialog.querySelector(".dialog-variant select"),
    qty: dialog.querySelector('.dialog-order input[name="qty"]'),
    added: dialog.querySelector(".dialog-added"),
    whatsapp: dialog.querySelector(".dialog-whatsapp"),
    gallery: dialog.querySelector(".dialog-gallery"),
  };

  function showImage(product, index) {
    const hasImg = product.images.length > 0;
    dlg.gallery.classList.toggle("is-placeholder", !hasImg);
    if (!hasImg) {
      dlg.mainImg.src = PLACEHOLDER_IMG;
      dlg.mainImg.alt = "";
      return;
    }
    dlg.mainImg.src = product.images[index];
    dlg.mainImg.alt = `${product.name}, photo ${index + 1} of ${product.images.length}`;
    dlg.thumbs.querySelectorAll("button").forEach((b, i) =>
      b.setAttribute("aria-current", String(i === index))
    );
  }

  function openProduct(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;

    dlg.category.textContent = CATEGORIES[p.category];
    dlg.title.textContent = p.name;
    dlg.tagline.textContent = p.tagline;

    // Order form: one radio per size/price, a scent picker, quantity
    const prices = p.prices || [];
    dlg.order.dataset.id = p.id;
    dlg.prices.replaceChildren(
      ...prices.map((x, i) =>
        el("li", {}, [
          el("label", {}, [
            el("input", { type: "radio", name: "size", value: x.label, required: "" }),
            el("span", { class: "price-label" }, [
              x.label,
              x.note ? el("small", { text: x.note }) : null,
            ]),
            el("span", { class: "price-value", text: formatPrice(x.price) }),
          ]),
        ])
      )
    );
    const firstSize = dlg.prices.querySelector("input");
    if (firstSize) firstSize.checked = true;
    dlg.order.hidden = !prices.length;

    dlg.variant.replaceChildren(
      el("option", { value: "", text: "Choose a scent" }),
      ...(p.variants || []).map((v) => el("option", { value: v, text: v }))
    );
    dlg.variantField.hidden = !p.variants;
    dlg.variant.disabled = !p.variants;
    dlg.qty.value = 1;
    dlg.added.replaceChildren();

    dlg.whatsapp.href = whatsappLink(p);

    // Long description
    const blocks = [];
    const intro = p.intro || [];
    if (!intro.length) {
      blocks.push(el("p", { class: "coming-soon", text: "More details coming soon. In the meantime, message us on WhatsApp to ask about this product." }));
    }
    intro.forEach((t) => blocks.push(el("p", { text: t })));
    (p.sections || []).forEach((s) => {
      const section = el("section", { class: "desc-section" });
      if (s.title) section.append(el("h4", { text: s.title }));
      (s.paragraphs || []).forEach((t) => section.append(el("p", { text: t })));
      if (s.list) {
        section.append(
          el("ul", { class: "desc-list" },
            s.list.map((item) =>
              el("li", {}, [
                item.term ? el("strong", { text: item.term }) : null,
                item.text,
              ])
            )
          )
        );
      }
      blocks.push(section);
    });
    if (p.tip) blocks.push(el("p", { class: "desc-callout" }, [el("strong", { text: "Tip: " }), p.tip]));
    if (p.note) blocks.push(el("p", { class: "desc-callout desc-note" }, [el("strong", { text: "Please note: " }), p.note]));
    dlg.description.replaceChildren(...blocks);
    dlg.description.closest(".dialog-info").scrollTop = 0;

    dlg.thumbs.replaceChildren(
      ...(p.images.length > 1
        ? p.images.map((src, i) =>
            el("button", { "aria-label": `Show photo ${i + 1}`, "data-index": i }, [
              el("img", { src, alt: "" }),
            ])
          )
        : [])
    );
    dlg.thumbs.onclick = (e) => {
      const b = e.target.closest("[data-index]");
      if (b) showImage(p, Number(b.dataset.index));
    };
    showImage(p, 0);

    if (!dialog.open) dialog.showModal();
  }

  function closeProduct() {
    if (location.hash.startsWith("#product/")) {
      history.pushState("", document.title, location.pathname + location.search + "#shop");
    }
    if (dialog.open) dialog.close();
  }

  dialog.querySelector(".dialog-close").addEventListener("click", closeProduct);
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) closeProduct(); // backdrop click
  });
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeProduct();
  });

  function syncFromHash() {
    const m = location.hash.match(/^#product\/(.+)$/);
    if (m) openProduct(decodeURIComponent(m[1]));
    else if (dialog.open) dialog.close();
  }
  window.addEventListener("hashchange", syncFromHash);

  /* ---------- Basket ---------- */
  // Kept in the visitor's browser only. Items store the product id, size label and
  // scent; prices are looked up from PRODUCTS when shown, so price edits apply.
  const CART_KEY = "nn-basket";
  const MAX_QTY = 20;
  const cartDialog = document.querySelector(".cart-dialog");
  const cartToggle = document.querySelector(".cart-toggle");
  const cartCount = cartToggle.querySelector(".cart-count");
  const cartForm = cartDialog.querySelector(".cart-form");
  const cartItemsEl = cartDialog.querySelector(".cart-items");
  const cartAddress = cartDialog.querySelector(".cart-address");

  const clampQty = (n) => Math.min(MAX_QTY, Math.max(1, Math.round(Number(n)) || 1));

  function resolve(item) {
    const product = PRODUCTS.find((x) => x.id === item.id);
    const price = product && (product.prices || []).find((x) => x.label === item.label);
    return product && price ? { product, price } : null;
  }

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(saved) ? saved.filter((i) => i && resolve(i)) : [];
    } catch {
      return [];
    }
  }

  let cart = loadCart();

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* storage unavailable (private mode etc.); the basket still works for this visit */
    }
  }

  function addToCart(id, label, variant, qty) {
    const existing = cart.find((i) => i.id === id && i.label === label && i.variant === variant);
    if (existing) existing.qty = clampQty(existing.qty + qty);
    else cart.push({ id, label, variant, qty: clampQty(qty) });
    cartChanged();
  }

  function cartChanged() {
    saveCart();
    renderCart();
  }

  const lineTotal = (item) => resolve(item).price.price * item.qty;
  const cartTotal = () => cart.reduce((sum, i) => sum + lineTotal(i), 0);

  function renderCart() {
    const count = cart.reduce((n, i) => n + i.qty, 0);
    cartCount.textContent = count;
    cartCount.hidden = count === 0;
    cartToggle.setAttribute("aria-label", `Basket, ${count} item${count === 1 ? "" : "s"}`);
    cartDialog.classList.toggle("is-empty", cart.length === 0);

    cartItemsEl.replaceChildren(
      ...cart.map((item, index) => {
        const { product, price } = resolve(item);
        return el("li", { class: "cart-item" }, [
          el("div", { class: "cart-item-info" }, [
            el("p", { class: "cart-item-name", text: product.name }),
            el("p", { class: "cart-item-detail" }, [
              [price.label, item.variant].filter(Boolean).join(" · "),
              price.note ? el("small", { text: price.note }) : null,
            ]),
          ]),
          el("div", { class: "cart-item-controls" }, [
            el("div", { class: "qty", "data-qty": "" }, [
              el("button", { type: "button", "data-step": "-1", "aria-label": `Fewer ${product.name}` , text: "−" }),
              el("input", { type: "number", value: item.qty, min: 1, max: MAX_QTY, inputmode: "numeric", "aria-label": `Quantity of ${product.name}`, "data-index": index }),
              el("button", { type: "button", "data-step": "1", "aria-label": `More ${product.name}`, text: "+" }),
            ]),
            el("span", { class: "cart-item-price", text: formatPrice(lineTotal(item)) }),
            el("button", { type: "button", class: "cart-remove", "data-remove": index, text: "Remove" }),
          ]),
        ]);
      })
    );
    renderSums();
  }

  /* Delivery options come from DELIVERY in products.js. */
  const methodOptions = cartForm.querySelector(".cart-method-options");
  methodOptions.replaceChildren(
    ...DELIVERY.map((d) =>
      el("label", { class: "cart-method-option" }, [
        el("input", { type: "radio", name: "method", value: d.id, required: "" }),
        el("span", {}, [
          el("span", { class: "cart-method-label", text: d.fee ? `${d.label} (${formatPrice(d.fee)})` : d.label }),
          d.note ? el("small", { text: d.note }) : null,
        ]),
      ])
    )
  );

  const chosenDelivery = () => DELIVERY.find((d) => d.id === cartForm.elements.method.value) || null;

  // Subtotal, delivery fee and total. A null fee (local delivery) is distance-based
  // and goes on the invoice, so the total is shown excluding delivery.
  function sums() {
    const subtotal = cartTotal();
    const d = chosenDelivery();
    const fixedFee = d && typeof d.fee === "number";
    return {
      subtotal,
      delivery: d,
      feeText: !d ? "" : d.fee === null ? "Added to your invoice" : d.fee ? formatPrice(d.fee) : "Free",
      total: subtotal + (fixedFee ? d.fee : 0),
      totalLabel: d && d.fee === null ? "Total (excl. delivery)" : "Total",
    };
  }

  function renderSums() {
    const t = sums();
    cartDialog.querySelector(".cart-sub-value").textContent = formatPrice(t.subtotal);
    const feeRow = cartDialog.querySelector(".cart-fee");
    feeRow.hidden = !t.delivery || t.delivery.id === "collection";
    cartDialog.querySelector(".cart-fee-value").textContent = t.feeText;
    cartDialog.querySelector(".cart-total-label").textContent = t.totalLabel;
    cartDialog.querySelector(".cart-total-value").textContent = formatPrice(t.total);
  }

  // e.g. NN-261116-K7Q2: date plus four random characters (no 0/O, 1/I/L).
  // There is no server to hand out sequential numbers.
  function newOrderNumber() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const date = `${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    const code = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => chars[b % chars.length]).join("");
    return `NN-${date}-${code}`;
  }

  function openCart() {
    cartDialog.classList.remove("is-sent");
    renderCart();
    if (!cartDialog.open) cartDialog.showModal();
  }

  // Quantity steppers, shared by the product dialog and the basket.
  document.addEventListener("click", (e) => {
    const step = e.target.closest("[data-qty] [data-step]");
    if (!step) return;
    const input = step.parentElement.querySelector("input");
    input.value = clampQty(Number(input.value) + Number(step.dataset.step));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  dlg.order.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(dlg.order);
    const id = dlg.order.dataset.id;
    addToCart(id, data.get("size"), data.get("variant") || "", clampQty(data.get("qty")));
    dlg.qty.value = 1;
    const name = PRODUCTS.find((x) => x.id === id).name;
    dlg.added.replaceChildren(
      el("span", { class: "dialog-added-msg", text: `Added ${name} to your basket.` }),
      el("span", { class: "dialog-added-actions" }, [
        el("button", { type: "button", class: "btn btn-ghost dialog-keep-shopping", text: "Continue shopping" }),
        el("button", { type: "button", class: "btn btn-primary dialog-view-cart", text: "Go to basket" }),
      ])
    );
    dlg.added.querySelector(".dialog-view-cart").focus();
  });

  dlg.added.addEventListener("click", (e) => {
    if (e.target.closest(".dialog-keep-shopping")) {
      closeProduct();
    } else if (e.target.closest(".dialog-view-cart")) {
      closeProduct();
      openCart();
    }
  });

  cartToggle.addEventListener("click", openCart);

  cartItemsEl.addEventListener("change", (e) => {
    const input = e.target.closest("input[data-index]");
    if (!input) return;
    cart[Number(input.dataset.index)].qty = clampQty(input.value);
    cartChanged();
  });

  cartItemsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove]");
    if (!btn) return;
    cart.splice(Number(btn.dataset.remove), 1);
    cartChanged();
  });

  cartForm.addEventListener("change", (e) => {
    if (e.target.name !== "method") return;
    showAddress(Boolean(chosenDelivery() && chosenDelivery().address));
    renderSums();
  });

  // A disabled fieldset is skipped by validation and FormData, so the address
  // fields are only required when a delivery option is chosen.
  function showAddress(show) {
    cartAddress.hidden = !show;
    cartAddress.disabled = !show;
  }

  /* Delivery location: an optional map pin from the device's location. */
  const pinInput = cartForm.elements.pin;
  const locateBtn = cartForm.querySelector(".cart-locate");
  const locationStatus = cartForm.querySelector(".cart-location-status");
  const MAX_PIN_ACCURACY_M = 250;
  const mapLink = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  function setPin(pin) {
    pinInput.value = pin;
    if (!pin) {
      locationStatus.replaceChildren();
      return;
    }
    locationStatus.replaceChildren(
      "Location added. ",
      el("a", { href: mapLink(pin), target: "_blank", rel: "noopener", text: "Check it on the map" }),
      " · ",
      el("button", { type: "button", class: "link-btn cart-unpin", text: "Remove" })
    );
  }

  locateBtn.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      locationStatus.textContent = "Your browser can't share a location. Your address is enough.";
      return;
    }
    locateBtn.disabled = true;
    locationStatus.textContent = "Finding your location…";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        locateBtn.disabled = false;
        // Computers without GPS guess from the internet connection, which can be
        // kilometres out. Only keep a pin that is accurate enough to deliver to.
        const accuracy = pos.coords.accuracy;
        if (!(accuracy <= MAX_PIN_ACCURACY_M)) {
          setPin("");
          const roughly = accuracy >= 1000 ? `${Math.round(accuracy / 1000)} km` : `${Math.round(accuracy)} m`;
          locationStatus.textContent =
            `Your device could only find your location roughly (within about ${roughly}), so we haven't added a pin. ` +
            "Your address is enough, or try again on your phone.";
          return;
        }
        setPin(`${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`);
      },
      (err) => {
        locateBtn.disabled = false;
        locationStatus.textContent =
          err.code === err.PERMISSION_DENIED
            ? "Location permission was not given. That's fine, your address is enough."
            : "We couldn't find your location. That's fine, your address is enough.";
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  });

  locationStatus.addEventListener("click", (e) => {
    if (e.target.closest(".cart-unpin")) setPin("");
  });

  function addressText(o) {
    return [o.street, o.complex, o.suburb, o.town, o.postcode].filter(Boolean).join(", ");
  }

  // Google Maps finds the street better without the unit/complex name.
  const addressMapLink = (o) => mapLink([o.street, o.suburb, o.town, o.postcode, "South Africa"].join(", "));

  function orderLines() {
    return cart.map((item) => {
      const { product, price } = resolve(item);
      const scent = item.variant ? ` (${item.variant})` : "";
      const note = price.note ? ` [${price.note.toLowerCase()}]` : "";
      return `• ${item.qty} × ${product.name}${scent}, ${price.label}${note}: ${formatPrice(lineTotal(item))}`;
    });
  }

  function deliveryLine(t) {
    const d = t.delivery;
    return d.fee === null ? `${d.label} (fee added to invoice)` : d.fee ? `${d.label}, ${formatPrice(d.fee)}` : d.label;
  }

  function orderMessage(o, t) {
    return [
      "Hi Naturally Nella! I'd like to place an order.",
      `Order number: ${o.number}`,
      "",
      ...orderLines(),
      "",
      `Subtotal: ${formatPrice(t.subtotal)}`,
      `Delivery: ${deliveryLine(t)}`,
      `${t.totalLabel}: ${formatPrice(t.total)}`,
      "",
      `Name: ${o.name}`,
      `Phone: ${o.phone}`,
      o.email ? `Email: ${o.email}` : null,
      ...(t.delivery.address
        ? [
            `Delivery address: ${addressText(o)}`,
            `Map: ${addressMapLink(o)}`,
            o.pin ? `My location pin: ${mapLink(o.pin)}` : null,
          ]
        : []),
    ].filter((l) => l !== null).join("\n");
  }

  // A copy of every order goes to the business inbox through FormSubmit (same
  // address as the contact form). It is a record only; WhatsApp is the real order.
  function emailOrder(o, t) {
    const endpoint = document.getElementById("contact-form").action
      .replace("formsubmit.co/", "formsubmit.co/ajax/");
    const body = {
      _subject: `New website order ${o.number} from ${o.name} (${formatPrice(t.total)})`,
      _template: "table",
      _captcha: "false",
      "Order number": o.number,
      Name: o.name,
      Phone: o.phone,
      ...(o.email ? { email: o.email } : {}), // "email" sets the reply-to address
      Delivery: deliveryLine(t),
      ...(t.delivery.address
        ? {
            "Delivery address": addressText(o),
            Map: addressMapLink(o),
            ...(o.pin ? { "Location pin": mapLink(o.pin) } : {}),
          }
        : {}),
      Order: orderLines().join("\n"),
      Subtotal: formatPrice(t.subtotal),
      [t.totalLabel]: formatPrice(t.total),
      ...(o.sheetNote ? { "Order sheet": o.sheetNote } : {}),
      Note: "Sent from the website basket. The customer was taken to WhatsApp to send this order; check WhatsApp to see if it arrived.",
    };
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      keepalive: true, // survive the page navigating to WhatsApp
    }).catch((err) => console.error("Order email error:", err));
  }

  // Optional Google Sheet order list (google-apps-script/SETUP.md). It numbers the
  // order NN-0001, NN-0002, ... and adds a row. Returns null if it isn't set up or
  // doesn't answer in time, and the order then gets a random number instead.
  const SHEET_TIMEOUT_MS = 20000;

  async function recordOrder(o, t) {
    const url = typeof ORDER_SHEET !== "undefined" && ORDER_SHEET.url;
    if (!url) return null;
    const withAddress = t.delivery.address;
    const payload = {
      name: o.name,
      phone: o.phone,
      email: o.email,
      delivery: deliveryLine(t),
      address: withAddress ? addressText(o) : "",
      map: withAddress ? addressMapLink(o) : "",
      pin: withAddress && o.pin ? mapLink(o.pin) : "",
      items: orderLines().join("\n"),
      subtotal: formatPrice(t.subtotal),
      deliveryFee: t.feeText,
      total: t.totalLabel === "Total" ? formatPrice(t.total) : `${formatPrice(t.total)} (excl. delivery)`,
    };
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), SHEET_TIMEOUT_MS);
    try {
      // text/plain keeps this a "simple" request, which Apps Script accepts cross-origin.
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      const json = await res.json();
      return json.ok && /^NN-\d+$/.test(json.number) ? json.number : null;
    } catch (err) {
      console.error("Order sheet error:", err);
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  const sendBtn = cartForm.querySelector(".cart-send");
  const sendLabel = sendBtn.textContent;

  function openWhatsApp(url, win) {
    if (win && !win.closed) win.location.replace(url);
    else {
      const w = window.open(url, "_blank");
      if (w) w.opener = null;
      else location.href = url; // pop-up blocked: go to WhatsApp in this tab
    }
  }

  cartForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!cart.length || sendBtn.disabled) return;
    const data = new FormData(cartForm);
    const field = (k) => String(data.get(k) || "").trim();
    const isBot = Boolean(field("_honey"));
    const order = {
      name: field("name"),
      phone: field("phone"),
      email: field("email"),
      street: field("street"),
      complex: field("complex"),
      suburb: field("suburb"),
      town: field("town"),
      postcode: field("postcode"),
      pin: field("pin"),
    };
    const t = sums();
    const useSheet = !isBot && typeof ORDER_SHEET !== "undefined" && Boolean(ORDER_SHEET.url);

    // Waiting for the sheet loses the "user tapped" permission to open a tab, so
    // open it now and point it at WhatsApp once the order number is back.
    let win = null;
    if (useSheet) {
      win = window.open("", "_blank");
      if (win) {
        win.opener = null;
        try {
          win.document.title = "Opening WhatsApp…";
          win.document.body.textContent = "Opening WhatsApp…";
        } catch {
          /* ignore */
        }
      }
      sendBtn.disabled = true;
      sendBtn.textContent = "Placing your order…";
      cartForm.inert = true;
      cartItemsEl.inert = true;
    }

    const sheetNumber = useSheet ? await recordOrder(order, t) : null;
    order.number = sheetNumber || newOrderNumber();
    if (useSheet && !sheetNumber) {
      order.sheetNote = "Not in the order sheet (it couldn't be reached). Please add it by hand.";
    }

    const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(orderMessage(order, t))}`;
    if (!isBot) emailOrder(order, t);
    cartDialog.querySelector(".cart-done-number").textContent = order.number;
    cartDialog.querySelector(".cart-done-collection").hidden = t.delivery.id !== "collection";

    // The order now lives in the WhatsApp message, so empty the basket.
    cart = [];
    cartChanged();
    cartForm.reset();
    showAddress(false);
    setPin("");
    sendBtn.disabled = false;
    sendBtn.textContent = sendLabel;
    cartForm.inert = false;
    cartItemsEl.inert = false;
    cartDialog.classList.add("is-sent");

    openWhatsApp(url, win);
  });

  cartDialog.querySelector(".cart-close").addEventListener("click", () => cartDialog.close());
  cartDialog.querySelectorAll(".cart-browse").forEach((a) =>
    a.addEventListener("click", () => cartDialog.close())
  );
  cartDialog.addEventListener("click", (e) => {
    if (e.target === cartDialog) cartDialog.close(); // backdrop click
  });

  /* ---------- Mobile nav ---------- */
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      navToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }
  });

  /* ---------- Contact form (FormSubmit) ---------- */
  const form = document.getElementById("contact-form");
  const topicSelect = document.getElementById("contact-topic");
  const formStatus = form.querySelector(".form-status");

  // Buttons like "Enquire about gifts" pre-select a topic.
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-topic]");
    if (link) topicSelect.value = link.dataset.topic;
  });

  function setStatus(text, kind) {
    formStatus.textContent = text;
    formStatus.className = `form-status${kind ? ` is-${kind}` : ""}`;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return; // bot filled the hidden field

    button.disabled = true;
    setStatus("Sending…");
    try {
      const res = await fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && String(json.success) === "true") {
        form.classList.add("is-sent");
        setStatus("Thank you! Your message has been sent. We'll be in touch soon.", "success");
        form.reset();
        return;
      }
      throw new Error(json.message || `HTTP ${res.status}`);
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus(
        `Sorry, your message couldn't be sent. Please email us at ${CONTACT.email} or WhatsApp ${CONTACT.phones[0].display}.`,
        "error"
      );
    } finally {
      button.disabled = false;
    }
  });

  /* ---------- Init ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
  document.querySelectorAll("[data-whatsapp]").forEach((a) => (a.href = whatsappLink()));
  renderFilters();
  renderProducts();
  renderCart();
  syncFromHash();
})();
