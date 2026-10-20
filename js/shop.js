/* Kaufansicht: Alle Links zum Shop öffnen diese Ansicht und laden sofort den eingebetteten Ecwid-Shop. Ohne JavaScript führen sie direkt in den Shop. */
(function () {
  const SHOP_URL = "https://lebensbegleiterin.company.site/products/bucher";
  const STORE_ID = "131201539", PRODUCT_ID = "821121316", SLUG = "bucher";
  const view = document.getElementById("shd");
  if (!view) return;
  const $ = id => document.getElementById(id);
  let loaded = false, lastFocus = null;

  function open(scrollToStore) {
    lastFocus = document.activeElement;
    document.querySelectorAll("dialog[open]").forEach(d => d.close());
    view.hidden = false;
    document.body.classList.add("shopen");
    view.querySelector(".shwrap").scrollTop = 0;
    view.focus({ preventScroll: true });
    if (scrollToStore) loadStore();
  }
  function close() {
    view.hidden = true;
    document.body.classList.remove("shopen");
    if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
  }

  function loadStore() {
    $("shstore").hidden = false;
    view.classList.add("live");
    $("shstore").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    if (loaded) return;
    loaded = true;
    const s = document.createElement("script");
    s.setAttribute("data-cfasync", "false");
    s.charset = "utf-8";
    s.src = "https://app.ecwid.com/script.js?" + STORE_ID + "&data_platform=code";
    s.onload = () => {
      try {
        window.ec = window.ec || {}; window.ec.storefront = Object.assign(window.ec.storefront || {}, {
          enable_navigation: true,
          product_details_layout: "TWO_COLUMNS_SIDEBAR_ON_THE_RIGHT",
          product_details_gallery_layout: "IMAGE_SINGLE_THUMBNAILS_HORIZONTAL",
          product_details_two_columns_with_right_sidebar_show_product_description_on_sidebar: false,
          product_details_two_columns_with_left_sidebar_show_product_description_on_sidebar: false,
          product_details_show_product_name: true,
          product_details_show_breadcrumbs: true,
          product_details_show_product_sku: false,
          product_details_show_product_price: true,
          product_details_show_in_stock_label: true,
          product_details_show_number_of_items_in_stock: true,
          product_details_show_qty: false,
          product_details_show_wholesale_prices: true,
          product_details_show_product_options: true,
          product_details_show_product_description: true,
          product_details_show_share_buttons: true,
          product_details_position_product_name: 100,
          product_details_position_breadcrumbs: 200,
          product_details_position_product_sku: 300,
          product_details_position_product_price: 400,
          product_details_position_product_options: 500,
          product_details_position_buy_button: 700,
          product_details_position_wholesale_prices: 800,
          product_details_position_product_description: 900,
          product_details_position_share_buttons: 1000,
          product_details_position_subtitle: 600,
          product_details_show_subtitle: true
        });
        window.xProductBrowser("categoriesPerRow=3", "views=grid(20,3) list(60) table(60)", "categoryView=grid", "searchView=list",
          "defaultProductId=" + PRODUCT_ID, "defaultSlug=" + SLUG, "id=my-store-" + STORE_ID);
      } catch (e) { $("shfall").hidden = false; }
    };
    s.onerror = () => { $("shfall").hidden = false; };
    document.body.appendChild(s);
    setTimeout(() => { if (!$("my-store-" + STORE_ID).children.length) $("shfall").hidden = false; }, 12000);
  }

  document.addEventListener("click", e => {
    const a = e.target.closest && e.target.closest('a[href^="' + SHOP_URL + '"]');
    if (!a || view.contains(a) || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    open(true);
  });
  $("shx").onclick = close;
  $("shgo").onclick = $("shgo2").onclick = loadStore;
  $("shcode").onclick = () => { close(); const t = $("krtb"); if (t) t.click(); };
  view.addEventListener("keydown", e => { if (e.key === "Escape") { e.stopPropagation(); close(); } });
})();
