// ============================================================
// Filtering & sorting logic
// ============================================================

import { products } from "./data.js";
import { renderGrid } from "./render.js";

let activeFilter = "all";
let activeSort = "featured";
let searchQuery = "";

function applyFilters() {
  let list = [...products];

  if (activeFilter !== "all") {
    list = list.filter((p) => p.category === activeFilter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q),
    );
  }

  switch (activeSort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "name":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "featured":
    default:
      list.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
  }

  renderGrid(list.map((p) => p.id));
  updateSummary(list.length);
}

function updateSummary(n) {
  const el = document.querySelector("[data-result-summary]");
  if (!el) return;
  el.textContent = `${n} ${n === 1 ? "piece" : "pieces"}, made in limited runs. Filter by discipline or sort to find your next object.`;
}

export function setFilter(value) {
  activeFilter = value;
  applyFilters();
}

export function setSort(value) {
  activeSort = value;
  applyFilters();
}

export function setSearch(value) {
  searchQuery = value.trim();
  applyFilters();
}

export function initFilters() {
  applyFilters();
}
