const AUTOPLAY_DELAY = 6500;

export function initHeroSlider() {
  const slider = document.querySelector("[data-hero-slider]");
  if (!slider) return;

  const slides = [...slider.querySelectorAll("[data-hero-slide]")];
  const previous = slider.querySelector("[data-hero-prev]");
  const next = slider.querySelector("[data-hero-next]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentIndex = 0;
  let autoplayId = null;

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
  }

  function stopAutoplay() {
    if (autoplayId !== null) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  function startAutoplay() {
    if (reducedMotion || autoplayId !== null) return;
    autoplayId = window.setInterval(() => showSlide(currentIndex + 1), AUTOPLAY_DELAY);
  }

  function showNext() {
    showSlide(currentIndex + 1);
    stopAutoplay();
    startAutoplay();
  }

  function showPrevious() {
    showSlide(currentIndex - 1);
    stopAutoplay();
    startAutoplay();
  }

  previous.addEventListener("click", showPrevious);
  next.addEventListener("click", showNext);
  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);
  slider.addEventListener("focusin", stopAutoplay);
  slider.addEventListener("focusout", (event) => {
    if (!slider.contains(event.relatedTarget)) startAutoplay();
  });

  showSlide(0);
  startAutoplay();
}
