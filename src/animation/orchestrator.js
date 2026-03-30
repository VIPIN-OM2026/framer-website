import { prefersReducedMotion } from "../utils/media.js";
import { fadeUp } from "./utils/fadeUp.js";
import { clipReveal } from "./utils/clipReveal.js";
import { stagger } from "./utils/stagger.js";
import { magnetic } from "./utils/magnetic.js";
import { heroTimeline } from "./timelines/hero.timeline.js";
import { marqueeTimeline } from "./timelines/marquee.timeline.js";
import { workTimeline } from "./timelines/work.timeline.js";
import { aboutTimeline } from "./timelines/about.timeline.js";
import { ctaTimeline } from "./timelines/cta.timeline.js";
const createOrchestrator = () => {
  const registry = new Map();
  let _gsap = null;
  let _ScrollTrigger = null;
  let _reduced = false;
  const _fadeUp = (...args) => fadeUp(_gsap, ...args);
  const _clipReveal = (...args) => clipReveal(_gsap, ...args);
  const _stagger = (...args) => stagger(_gsap, ...args);
  const _loadGSAP = async () => {
    if (_gsap) return;
    const [gsapModule, stModule] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]);
    _gsap = gsapModule.gsap;
    _ScrollTrigger = stModule.ScrollTrigger;
    _gsap.registerPlugin(_ScrollTrigger);
    _gsap.ticker.fps(60);
    _gsap.ticker.lagSmoothing(500, 33);
  };
  const init = async (sectionElements) => {
    await _loadGSAP();
    _reduced = prefersReducedMotion();
    if (_reduced) {
      _applyReducedMotionFallback(sectionElements);
      return;
    }
    if (sectionElements.hero) {
      const tl = heroTimeline(
        _gsap,
        _ScrollTrigger,
        sectionElements.hero,
        _fadeUp,
        _clipReveal,
      );
      registry.set("hero", tl);
    }
    if (sectionElements.marquee?.section) {
      const tl = marqueeTimeline(
        _gsap,
        _ScrollTrigger,
        sectionElements.marquee.section,
        _clipReveal,
      );
      registry.set("marquee", tl);
    }
    if (sectionElements.work) {
      const tl = workTimeline(
        _gsap,
        _ScrollTrigger,
        sectionElements.work,
        _fadeUp,
        _stagger,
      );
      registry.set("work", tl);
    }
    if (sectionElements.about) {
      const tl = aboutTimeline(
        _gsap,
        _ScrollTrigger,
        sectionElements.about,
        _fadeUp,
        _clipReveal,
      );
      registry.set("about", tl);
    }
    if (sectionElements.cta) {
      const tl = ctaTimeline(
        _gsap,
        _ScrollTrigger,
        sectionElements.cta,
        _fadeUp,
        _clipReveal,
      );
      registry.set("cta", tl);
    }
    
    const extraTargets = _gsap.utils.toArray('.case-study .will-animate, .pricing .will-animate, .team .will-animate, .faq .will-animate, .blog .will-animate');
    extraTargets.forEach((target, i) => {
        const t = _gsap.fromTo(target, 
            { y: 40, opacity: 0 }, 
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: target,
                    start: "top 85%",
                    once: true
                }
            }
        );
        registry.set(`extra-${i}`, t);
    });
  };
  const _applyReducedMotionFallback = (sectionElements) => {
    const allTargets = [];
    Object.values(sectionElements).forEach((group) => {
      if (!group) return;
      Object.values(group).forEach((el) => {
        if (!el) return;
        if (Array.isArray(el)) allTargets.push(...el);
        else allTargets.push(el);
      });
    });
    allTargets.forEach((el) => {
      if (el instanceof Element) {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.clipPath = "";
      }
    });
  };
  const kill = (name) => {
    if (name) {
      registry.get(name)?.kill();
      registry.delete(name);
    } else {
      registry.forEach((tl) => tl.kill());
      registry.clear();
      _ScrollTrigger?.getAll().forEach((t) => t.kill());
    }
  };
  const pause = (name) => {
    if (name) registry.get(name)?.pause();
    else registry.forEach((tl) => tl.pause?.());
  };
  const resume = (name) => {
    if (name) registry.get(name)?.resume();
    else registry.forEach((tl) => tl.resume?.());
  };
  const refresh = () => {
    _ScrollTrigger?.refresh();
  };
  const gsap = () => _gsap;
  const createMagnetic = (el, options) => {
    if (!_gsap) return { mount: () => {}, unmount: () => {} };
    return magnetic(_gsap, el, options);
  };
  return {
    init,
    kill,
    pause,
    resume,
    refresh,
    gsap,
    createMagnetic,
  };
};
const orchestrator = createOrchestrator();
export default orchestrator;
