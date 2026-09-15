// ============================================================
// Cart — localStorage-backed, pub/sub
// ============================================================

const STORAGE_KEY = "atelier-nord-cart";

/** @typedef {{ id: string, name: string, price: number, image: string, qty: number }} CartItem */

const listeners = new Set();

/** @type {CartItem[]} */
let items = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota errors */
  }
  listeners.forEach((fn) => fn(items));
}

export function getItems() {
  return [...items];
}

export function getCount() {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function getSubtotal() {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function add(product, qty = 1) {
  const existing = items.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty,
    });
  }
  persist();
}

export function setQty(id, qty) {
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  item.qty = Math.max(1, qty);
  persist();
}

export function remove(id) {
  items = items.filter((item) => item.id !== id);
  persist();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
