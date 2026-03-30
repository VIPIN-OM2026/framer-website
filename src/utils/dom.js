export const qs = (selector, root = document) => root.querySelector(selector);
export const qsa = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));
export const addClass = (el, ...classes) => el.classList.add(...classes);
export const removeClass = (el, ...classes) => el.classList.remove(...classes);
export const toggleClass = (el, cls, force) => el.classList.toggle(cls, force);
export const hasClass = (el, cls) => el.classList.contains(cls);
export const setAttrs = (el, attrs) => {
  Object.entries(attrs).forEach(([key, val]) => el.setAttribute(key, val));
};
export const getCSSVar = (property, el = document.documentElement) =>
  getComputedStyle(el).getPropertyValue(property).trim();
export const setCSSVar = (property, value, el = document.documentElement) =>
  el.style.setProperty(property, value);
export const getRect = (el) => el.getBoundingClientRect();
export const isInViewport = (el, threshold = 0) => {
  const { top, bottom, height } = getRect(el);
  const visible = Math.max(
    0,
    Math.min(bottom, window.innerHeight) - Math.max(top, 0),
  );
  return visible / height >= threshold;
};
export const createElement = (tag, attrs = {}, ...children) => {
  const el = document.createElement(tag);
  setAttrs(el, attrs);
  children.forEach((child) => {
    el.append(
      typeof child === "string" ? document.createTextNode(child) : child,
    );
  });
  return el;
};
export const removeElement = (el) => el?.parentNode?.removeChild(el);
export const fontsReady = () => document.fonts.ready.then(() => undefined);
