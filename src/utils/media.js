export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};
export const isBreakpoint = (bp) =>
  window.matchMedia(`(min-width: ${BREAKPOINTS[bp]}px)`).matches;
export const currentBreakpoint = () => {
  const entries = Object.entries(BREAKPOINTS).reverse();
  for (const [key, value] of entries) {
    if (window.innerWidth >= value) return key;
  }
  return "base";
};
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const prefersDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;
export const onBreakpoint = (bp, handler) => {
  const mq = window.matchMedia(`(min-width: ${BREAKPOINTS[bp]}px)`);
  const listener = (e) => handler(e.matches);
  mq.addEventListener("change", listener);
  return () => mq.removeEventListener("change", listener);
};
export const watchMedia = (query, handler) => {
  const mq = window.matchMedia(query);
  const listener = (e) => handler(e.matches);
  mq.addEventListener("change", listener);
  return {
    matches: mq.matches,
    unsubscribe: () => mq.removeEventListener("change", listener),
  };
};
export const isTouchDevice = () =>
  window.matchMedia("(pointer: coarse)").matches;
export const viewport = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});
