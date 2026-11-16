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
  const cartSent = cartDialog.querySelector(".cart-sent");

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
    cartSent.hidden = true;

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
    cartDialog.querySelector(".cart-total-value").textContent = formatPrice(cartTotal());
  }

  function openCart() {
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
      `Added ${name} to your basket. `,
      el("button", { type: "button", class: "link-btn dialog-view-cart", text: "View basket" })
    );
  });

  dlg.added.addEventListener("click", (e) => {
    if (!e.target.closest(".dialog-view-cart")) return;
    closeProduct();
    openCart();
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
    const delivery = e.target.value === "Delivery";
    cartAddress.hidden = !delivery;
    cartAddress.querySelector("textarea").required = delivery;
  });

  function orderMessage(name, method, address) {
    const lines = cart.map((item) => {
      const { product, price } = resolve(item);
      const scent = item.variant ? ` (${item.variant})` : "";
      const note = price.note ? ` [${price.note.toLowerCase()}]` : "";
      return `• ${item.qty} × ${product.name}${scent}, ${price.label}${note}: ${formatPrice(lineTotal(item))}`;
    });
    return [
      "Hi Naturally Nella! I'd like to place an order:",
      "",
      ...lines,
      "",
      `Total: ${formatPrice(cartTotal())}`,
      "",
      `Name: ${name}`,
      `Delivery or collection: ${method}`,
      method === "Delivery" ? `Delivery address: ${address}` : null,
    ].filter((l) => l !== null).join("\n");
  }

  cartForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!cart.length) return;
    const data = new FormData(cartForm);
    const text = orderMessage(
      String(data.get("name")).trim(),
      data.get("method"),
      String(data.get("address") || "").trim()
    );
    const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else location.href = url;
    cartSent.hidden = false;
  });

  cartDialog.querySelector(".cart-clear").addEventListener("click", () => {
    cart = [];
    cartChanged();
    cartForm.reset();
    cartAddress.hidden = true;
    cartDialog.close();
  });

  cartDialog.querySelector(".cart-close").addEventListener("click", () => cartDialog.close());
  cartDialog.querySelector(".cart-browse").addEventListener("click", () => cartDialog.close());
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
