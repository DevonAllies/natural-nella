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
    meta: dialog.querySelector(".dialog-meta"),
    prices: dialog.querySelector(".dialog-prices"),
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

    // Prices
    dlg.prices.replaceChildren(
      ...(p.prices || []).map((x) =>
        el("li", {}, [
          el("span", { class: "price-label" }, [
            x.label,
            x.note ? el("small", { text: x.note }) : null,
          ]),
          el("span", { class: "price-value", text: formatPrice(x.price) }),
        ])
      )
    );
    dlg.prices.hidden = !(p.prices && p.prices.length);
    dlg.whatsapp.href = whatsappLink(p);

    // Variants
    dlg.meta.replaceChildren(
      ...(p.variants
        ? [el("dt", { text: "Available in" }), el("dd", { text: p.variants.join(" · ") })]
        : [])
    );
    dlg.meta.hidden = !p.variants;

    // Long description
    const blocks = [];
    const intro = p.intro || [];
    if (!intro.length) {
      blocks.push(el("p", { class: "coming-soon", text: "Full description coming soon." }));
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

  /* ---------- Init ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
  document.querySelectorAll("[data-whatsapp]").forEach((a) => (a.href = whatsappLink()));
  renderFilters();
  renderProducts();
  syncFromHash();
})();
