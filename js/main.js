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
  function renderProducts() {
    const items = PRODUCTS.filter(
      (p) => activeFilter === "all" || p.category === activeFilter
    );
    grid.replaceChildren(
      ...items.map((p) =>
        el("article", { class: "product-card" }, [
          el("button", { class: "card-hit", "data-id": p.id, "aria-label": `View ${p.name}` }, [
            el("div", { class: "card-media" }, [
              el("img", { src: p.images[0], alt: p.name, loading: "lazy" }),
              p.images.length > 1
                ? el("span", { class: "card-count", text: `${p.images.length} photos` })
                : null,
            ]),
            el("div", { class: "card-body" }, [
              el("p", { class: "card-category", text: CATEGORIES[p.category] }),
              el("h3", { class: "card-title", text: p.name }),
              el("p", { class: "card-tagline", text: p.tagline }),
            ]),
          ]),
        ])
      )
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
  };

  function showImage(product, index) {
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

    const paragraphs = (p.description || "").split(/\n\s*\n/).filter((s) => s.trim());
    dlg.description.replaceChildren(
      ...(paragraphs.length
        ? paragraphs.map((t) => el("p", { text: t.trim() }))
        : [el("p", { class: "coming-soon", text: "Full description coming soon." })])
    );

    const meta = [];
    if (p.variants) meta.push(["Available in", p.variants.join(", ")]);
    if (p.sizes) meta.push(["Size", p.sizes.join(" / ")]);
    if (p.details) meta.push(["Details", p.details]);
    dlg.meta.replaceChildren(
      ...meta.flatMap(([term, value]) => [
        el("dt", { text: term }),
        el("dd", {}, [].concat(value).map((v) => el("span", { text: v }))),
      ])
    );

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
  renderFilters();
  renderProducts();
  syncFromHash();
})();
