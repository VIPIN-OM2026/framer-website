/**
 * utils/dom.js — DOM query and manipulation helpers
 *
 * Rules:
 *  - Pure DOM utility functions only
 *  - No business logic, no state, no animations
 *  - All queries scoped to a provided root element where applicable
 */

/**
 * Query a single element, scoped to a root (defaults to document).
 * @param {string} selector
 * @param {Element|Document} [root=document]
 * @returns {Element|null}
 */
export const qs = (selector, root = document) => root.querySelector(selector)

/**
 * Query all matching elements as a real Array.
 * @param {string} selector
 * @param {Element|Document} [root=document]
 * @returns {Element[]}
 */
export const qsa = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector))

/**
 * Add one or more classes to an element.
 * @param {Element} el
 * @param {...string} classes
 */
export const addClass = (el, ...classes) => el.classList.add(...classes)

/**
 * Remove one or more classes from an element.
 * @param {Element} el
 * @param {...string} classes
 */
export const removeClass = (el, ...classes) => el.classList.remove(...classes)

/**
 * Toggle a class on an element.
 * @param {Element} el
 * @param {string} cls
 * @param {boolean} [force]
 * @returns {boolean}
 */
export const toggleClass = (el, cls, force) => el.classList.toggle(cls, force)

/**
 * Check if an element has a class.
 * @param {Element} el
 * @param {string} cls
 * @returns {boolean}
 */
export const hasClass = (el, cls) => el.classList.contains(cls)

/**
 * Set multiple attributes on an element.
 * @param {Element} el
 * @param {Record<string, string>} attrs
 */
export const setAttrs = (el, attrs) => {
    Object.entries(attrs).forEach(([key, val]) => el.setAttribute(key, val))
}

/**
 * Get a computed CSS custom property value.
 * @param {string} property — e.g. '--color-accent'
 * @param {Element} [el=document.documentElement]
 * @returns {string}
 */
export const getCSSVar = (property, el = document.documentElement) =>
    getComputedStyle(el).getPropertyValue(property).trim()

/**
 * Set a CSS custom property value.
 * @param {string} property
 * @param {string} value
 * @param {HTMLElement} [el=document.documentElement]
 */
export const setCSSVar = (property, value, el = document.documentElement) =>
    el.style.setProperty(property, value)

/**
 * Get element bounding rect — cached one-time read.
 * @param {Element} el
 * @returns {DOMRect}
 */
export const getRect = (el) => el.getBoundingClientRect()

/**
 * Check if an element is in the viewport.
 * @param {Element} el
 * @param {number} [threshold=0] — 0 to 1, fraction of element visible
 * @returns {boolean}
 */
export const isInViewport = (el, threshold = 0) => {
    const { top, bottom, height } = getRect(el)
    const visible = Math.max(0, Math.min(bottom, window.innerHeight) - Math.max(top, 0))
    return visible / height >= threshold
}

/**
 * Create an element with optional attributes and children.
 * @param {string} tag
 * @param {Record<string, string>} [attrs]
 * @param {...(Element|string)} [children]
 * @returns {Element}
 */
export const createElement = (tag, attrs = {}, ...children) => {
    const el = document.createElement(tag)
    setAttrs(el, attrs)
    children.forEach((child) => {
        el.append(typeof child === 'string' ? document.createTextNode(child) : child)
    })
    return el
}

/**
 * Remove an element from the DOM safely.
 * @param {Element|null} el
 */
export const removeElement = (el) => el?.parentNode?.removeChild(el)

/**
 * Wait for fonts to be ready before measuring text.
 * @returns {Promise<void>}
 */
export const fontsReady = () => document.fonts.ready.then(() => undefined)