// ============================================================
// Atelier.Nord — main entry
// ============================================================

import "./src/scss/main.scss";
import { products } from "./src/js/data.js";
import * as cart from "./src/js/cart.js";
import { initCart, openCart } from "./src/js/cart-ui.js";
import { initHeroSlider } from "./src/js/hero-slider.js";
import { initFilters, setFilter, setSort, setSearch } from "./src/js/filters.js";

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- Header: sticky hide/show on scroll --------------------
const header = document.querySelector("[data-header]");
let lastScroll = 0;
let ticking = false;

function onScroll() {
  const y = window.scrollY;

  header.classList.toggle("is-scrolled", y > 8);

  if (y > 140 && y > lastScroll && !header.classList.contains("is-hidden")) {
    header.classList.add("is-hidden");
  } else if (y < lastScroll || y < 140) {
    header.classList.remove("is-hidden");
  }

  // Back-to-top
  const backTop = document.querySelector("[data-back-top]");
  if (backTop) backTop.classList.toggle("is-visible", y > 600);

  lastScroll = y;
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });

// ---- Filter chips ------------------------------------------
document.querySelectorAll("[data-filter]").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    setFilter(chip.dataset.filter);
    observeReveal();
  });
});

// ---- Sort select ------------------------------------------
const sortSelect = document.querySelector("[data-sort]");
sortSelect.addEventListener("change", () => {
  setSort(sortSelect.value);
  observeReveal();
});

// ---- Search input -----------------------------------------
const searchInput = document.querySelector("[data-search-input]");
searchInput.addEventListener("input", () => {
  setSearch(searchInput.value);
  observeReveal();
});

// ---- Mobile menu ------------------------------------------
const mobileMenu = document.querySelector("[data-mobile-menu]");

function openMobileMenu() {
  mobileMenu.hidden = false;
  requestAnimationFrame(() => mobileMenu.classList.add("is-open"));
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  mobileMenu.classList.remove("is-open");
  mobileMenu.classList.add("is-closing");
  document.body.style.overflow = "";
  window.setTimeout(() => {
    mobileMenu.hidden = true;
    mobileMenu.classList.remove("is-closing");
  }, 320);
}

document.querySelector("[data-menu-open]").addEventListener("click", openMobileMenu);
document.querySelectorAll("[data-menu-close]").forEach((el) => {
  el.addEventListener("click", closeMobileMenu);
});

// ---- Add-to-cart delegation --------------------------------
document.querySelector("[data-product-grid]").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  const product = products.find((p) => p.id === btn.dataset.add);
  if (!product) return;
  cart.add(product);
  openCart();
});

// ---- Wishlist toggle --------------------------------------
document.querySelector("[data-product-grid]").addEventListener("click", (e) => {
  const heart = e.target.closest("[data-wishlist]");
  if (!heart) return;
  e.preventDefault();
  heart.classList.toggle("is-active");
});

// ---- Chips scroll arrows ----------------------------------
const chips = document.querySelector("[data-chips]");
const prevBtn = document.querySelector("[data-chips-prev]");
const nextBtn = document.querySelector("[data-chips-next]");

function updateChipsArrows() {
  if (!chips) return;
  const maxScroll = chips.scrollWidth - chips.clientWidth;
  prevBtn.hidden = chips.scrollLeft <= 4;
  nextBtn.hidden = chips.scrollLeft >= maxScroll - 4;
}

if (chips) {
  chips.addEventListener("scroll", updateChipsArrows, { passive: true });
  window.addEventListener("resize", updateChipsArrows);
  prevBtn.addEventListener("click", () => chips.scrollBy({ left: -200, behavior: "smooth" }));
  nextBtn.addEventListener("click", () => chips.scrollBy({ left: 200, behavior: "smooth" }));
  updateChipsArrows();
}

// ---- Back-to-top ------------------------------------------
const backTop = document.createElement("button");
backTop.className = "back-top";
backTop.type = "button";
backTop.setAttribute("aria-label", "Back to top");
backTop.dataset.backTop = "";
backTop.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
document.body.appendChild(backTop);
backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
});

// ---- Scroll reveal (Intersection Observer) ----------------
let observer = null;

function observeReveal() {
  if (!observer) return;
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
    observer.observe(el);
  });
}

// Sections that should reveal on scroll (added via JS to avoid HTML changes)
const sectionRevealTargets = [".filters", ".catalog", ".footer"];
sectionRevealTargets.forEach((sel) => {
  const el = document.querySelector(sel);
  if (el) el.classList.add("reveal");
});

if (prefersReduced) {
  // Skip animations entirely
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
} else {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
}

// ---- Lazy image fade-in -----------------------------------
function observeLazyImages() {
  const imgs = document.querySelectorAll("[data-lazy-img]:not(.is-loaded)");
  imgs.forEach((img) => {
    if (img.complete) {
      img.classList.add("is-loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
      img.addEventListener("error", () => img.classList.add("is-loaded"), { once: true });
    }
  });
}

// ---- Init --------------------------------------------------
initFilters();
initCart();
initHeroSlider();
observeReveal();
observeLazyImages();

// Re-observe newly rendered cards after a tick
const gridObserver = new MutationObserver(() => {
  observeReveal();
  observeLazyImages();
});
gridObserver.observe(document.querySelector("[data-product-grid]"), { childList: true });

// ---- Smooth scroll for anchor links ------------------------
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      }
    }
  });
});
