import { qs, qsa } from "../utils/dom.js";
import { addListeners } from "../utils/events.js";
const About = (root) => {
  const elements = {
    section: root,
    eyebrow: qs("[data-about-eyebrow]", root),
    heading: qs("[data-about-heading]", root),
    body: qs("[data-about-body]", root),
    stats: qsa("[data-stat]", root),
    media: qs("[data-about-media]", root),
  };
  let _observer = null;
  const _animateCounter = (el, target, duration = 1400) => {
    const start = performance.now();
    const startVal = 0;
    const suffix = el.dataset.statSuffix || "";
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = Math.round(startVal + (target - startVal) * eased);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };
  const _observeStats = () => {
    if (!elements.stats.length) return;
    _observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.statValue || "0");
          _animateCounter(el, target);
          _observer.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );
    elements.stats.forEach((el) => {
      const valueEl = qs("[data-stat-value]", el) || el;
      _observer.observe(valueEl);
    });
  };
  const init = () => {
    _observeStats();
  };
  const destroy = () => {
    _observer?.disconnect();
    _observer = null;
  };
  return { init, destroy, elements };
};
export default About;
