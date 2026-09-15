// ============================================================
// Cart drawer rendering & interactions
// ============================================================

import * as cart from "./cart.js";

export function renderCart() {
  const body = document.querySelector("[data-cart-body]");
  const foot = document.querySelector("[data-cart-foot]");
  const subtitle = document.querySelector("[data-cart-subtitle]");
  const items = cart.getItems();

  body.innerHTML = "";

  if (items.length === 0) {
    foot.hidden = true;
    subtitle.textContent = "Nothing here yet";
    const emptyState = document.createElement("div");
    emptyState.className = "cart__empty-state";
    emptyState.innerHTML = `
      <div class="cart__empty-icon">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.3">
          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 class="cart__empty-title">Your bag is empty</h3>
      <p class="cart__empty-text">Explore the collection and add something you will keep for years.</p>
      <button class="cart__browse-btn" type="button" data-cart-close>Browse the shop</button>
    `;
    body.appendChild(emptyState);
    return;
  }

  foot.hidden = false;
  subtitle.textContent = `${cart.getCount()} ${cart.getCount() === 1 ? "item" : "items"}`;

  items.forEach((item) => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <img class="cart-item__img" src="${item.image}" alt="${item.name}" />
      <div class="cart-item__info">
        <span class="cart-item__name">${item.name}</span>
        <span class="cart-item__price">$${item.price}</span>
        <div class="cart-item__qty">
          <button class="cart-item__qty-btn" type="button" data-dec="${item.id}" aria-label="Decrease quantity">−</button>
          <span class="cart-item__qty-val">${item.qty}</span>
          <button class="cart-item__qty-btn" type="button" data-inc="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <button class="cart-item__remove" type="button" data-remove="${item.id}">Remove</button>
      </div>
    `;
    body.appendChild(el);
  });

  const subtotal = cart.getSubtotal();
  document.querySelector("[data-cart-subtotal]").textContent = `$${subtotal}`;
}

export function updateCartCount() {
  const count = cart.getCount();
  document.querySelectorAll("[data-cart-count], [data-cart-count-mobile]").forEach((el) => {
    el.textContent = String(count);
    el.hidden = count === 0;
  });
}

export function openCart() {
  const drawer = document.querySelector("[data-cart]");
  drawer.hidden = false;
  drawer.classList.add("is-open");
  document.body.style.overflow = "hidden";
  renderCart();
}

export function closeCart() {
  const drawer = document.querySelector("[data-cart]");
  drawer.classList.remove("is-open");
  drawer.classList.add("is-closing");
  document.body.style.overflow = "";
  window.setTimeout(() => {
    drawer.hidden = true;
    drawer.classList.remove("is-closing");
  }, 320);
}

export function initCart() {
  cart.subscribe(() => {
    updateCartCount();
  });

  document
    .querySelectorAll("[data-cart-open]")
    .forEach((btn) => btn.addEventListener("click", openCart));

  document.querySelector("[data-cart]").addEventListener("click", (e) => {
    if (e.target.closest("[data-cart-close]") || e.target.closest("[data-cart-overlay]")) {
      closeCart();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });

  document.querySelector("[data-cart-body]").addEventListener("click", (e) => {
    const target = e.target;
    const dec = target.closest("[data-dec]");
    const inc = target.closest("[data-inc]");
    const remove = target.closest("[data-remove]");

    if (dec) {
      const item = cart.getItems().find((i) => i.id === dec.dataset.dec);
      if (item) cart.setQty(item.id, item.qty - 1);
      renderCart();
    }
    if (inc) {
      const item = cart.getItems().find((i) => i.id === inc.dataset.inc);
      if (item) cart.setQty(item.id, item.qty + 1);
      renderCart();
    }
    if (remove) {
      cart.remove(remove.dataset.remove);
      renderCart();
    }
  });

  updateCartCount();
}
