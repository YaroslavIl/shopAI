// ============================================================
// Product card & grid rendering
// ============================================================

import { products } from "./data.js";

/** @param {object} product */
export function createCard(product, index = 0) {
  const card = document.createElement("article");
  card.className = "product-card reveal";
  card.dataset.category = product.category;
  card.dataset.id = product.id;
  card.dataset.price = String(product.price);
  card.dataset.name = product.name;
  card.dataset.featured = String(product.featured);
  card.style.transitionDelay = `${Math.min(index, 7) * 60}ms`;

  const badge = product.badge
    ? `<span class="product-card__badge product-card__badge--${product.badge.toLowerCase()}">${product.badge}</span>`
    : "";

  card.innerHTML = `
    <div class="product-card__media">
      ${badge}
      <button class="product-card__heart" type="button" aria-label="Add to wishlist" data-wishlist="${product.id}">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 21s-7-4.35-9.5-8.5C.5 8 3 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 4 23.5 8 21.5 12.5 19 16.65 12 21 12 21z" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <img
        class="product-card__img"
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
        data-lazy-img
      />
      <div class="product-card__overlay">
        <button class="product-card__add" type="button" data-add="${product.id}">
          Add to bag
        </button>
      </div>
    </div>
    <div class="product-card__info">
      <p class="product-card__category">${product.categoryLabel}</p>
      <h3 class="product-card__name">${product.name}</h3>
      <p class="product-card__meta">${product.material}</p>
      <p class="product-card__price">$${product.price}</p>
    </div>
  `;

  return card;
}

/**
 * Render a list of products into the grid.
 * @param {string[]} ids  product ids to render (order preserved)
 */
export function renderGrid(ids) {
  const grid = document.querySelector("[data-product-grid]");
  const empty = document.querySelector("[data-empty]");
  grid.innerHTML = "";

  if (ids.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  const map = new Map(products.map((p) => [p.id, p]));
  let i = 0;
  ids.forEach((id) => {
    const product = map.get(id);
    if (product) {
      grid.appendChild(createCard(product, i));
      i++;
    }
  });
}
