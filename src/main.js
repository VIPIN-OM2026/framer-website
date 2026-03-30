import "./styles/main.css";
import store from "./store.js";
import orchestrator from "./animation/orchestrator.js";
import Nav from "./components/Nav.js";
import Hero from "./components/Hero.js";
import Marquee from "./components/Marquee.js";
import WorkGrid from "./components/WorkGrid.js";
import About from "./components/About.js";
import CTA from "./components/CTA.js";
import Footer from "./components/Footer.js";
import { qs } from "./utils/dom.js";
import { debounce } from "./utils/events.js";
import { prefersReducedMotion } from "./utils/media.js";

store.set("reducedMotion", prefersReducedMotion());

const bootstrap = async () => {
  // Loader dismiss
  const loaderEl = qs("#loader");
  if (loaderEl) {
    setTimeout(() => {
      loaderEl.style.opacity = "0";
      loaderEl.style.transition = "opacity 0.5s ease";
      setTimeout(() => { loaderEl.style.display = "none"; }, 500);
    }, 1400);
  }

  // Nav
  const navEl = qs("#nav-header") || qs("#nav");
  const nav = navEl ? Nav(navEl) : null;
  nav?.init();

  // Hero
  const heroEl = qs("#hero");
  const hero = heroEl ? Hero(heroEl) : null;
  hero?.init();

  // Main marquee (#marquee)
  const marqueeEl = qs("#marquee");
  const marquee = marqueeEl ? Marquee(marqueeEl, { speed: 0.5 }) : null;
  marquee?.init();

  // CTA marquee — separate inline marquee in cta.html
  const ctaMarqueeInner = qs("#cta-marquee-inner");
  const ctaMarqueeTrack = qs("#cta-marquee-track");
  if (ctaMarqueeInner && ctaMarqueeTrack && !prefersReducedMotion()) {
    // Clone for seamless loop
    const clone = ctaMarqueeTrack.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    ctaMarqueeInner.appendChild(clone);
    ctaMarqueeInner.style.display = "flex";
    ctaMarqueeInner.style.flexWrap = "nowrap";
    let x = 0;
    const tick = () => {
      x -= 0.4;
      const w = ctaMarqueeTrack.scrollWidth;
      if (Math.abs(x) >= w) x = 0;
      ctaMarqueeTrack.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      clone.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Work grid
  const workEl = qs("#work");
  const work = workEl ? WorkGrid(workEl) : null;
  work?.init();

  // About stats
  const aboutEl = qs("#about");
  const about = aboutEl ? About(aboutEl) : null;
  about?.init();

  // CTA / magnetic button
  const ctaEl = qs("#contact");
  const cta = ctaEl ? CTA(ctaEl) : null;
  cta?.init();

  // Footer
  const footerEl = qs("#footer");
  const footer = footerEl ? Footer(footerEl) : null;
  footer?.init();

  // GSAP orchestrator
  const sectionElements = {
    hero: hero?.elements ?? null,
    marquee: { section: marqueeEl },
    work: work?.elements ?? null,
    about: about?.elements ?? null,
    cta: cta?.elements ?? null,
  };
  await orchestrator.init(sectionElements);

  document.fonts.ready.then(() => { orchestrator.refresh(); });
  window.addEventListener("load", () => { orchestrator.refresh(); }, { once: true });
  window.addEventListener("resize", debounce(() => { orchestrator.refresh(); }, 200), { passive: true });

  if (import.meta.env.DEV || new URLSearchParams(location.search).has("debug")) {
    window.__app = { store, orchestrator, nav, hero, marquee, work, about, cta, footer };
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
