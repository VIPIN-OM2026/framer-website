/**
 * utils/events.js — Event helpers
 *
 * Rules:
 *  - No DOM queries — receive elements as arguments
 *  - No business logic — pure event infrastructure
 */

/**
 * Create a delegated event listener on a root element.
 * Only fires if the event target matches `selector`.
 *
 * @param {Element|Document} root
 * @param {string} event
 * @param {string} selector
 * @param {(e: Event, target: Element) => void} handler
 * @returns {() => void} removeListener
 */
export const delegate = (root, event, selector, handler) => {
    const listener = (/** @type {Event} */ e) => {
        const target = /** @type {Element} */ (e.target)?.closest(selector)
        if (target && root.contains(target)) {
            handler(e, target)
        }
    }

    root.addEventListener(event, listener)
    return () => root.removeEventListener(event, listener)
}

/**
 * Debounce — delays execution until after `delay` ms of silence.
 * @template {(...args: any[]) => any} T
 * @param {T} fn
 * @param {number} delay
 * @returns {(...args: Parameters<T>) => void}
 */
export const debounce = (fn, delay) => {
    let timer

    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay)
    }
}

/**
 * Throttle — fires at most once per `limit` ms.
 * @template {(...args: any[]) => any} T
 * @param {T} fn
 * @param {number} limit
 * @returns {(...args: Parameters<T>) => void}
 */
export const throttle = (fn, limit) => {
    let lastCall = 0

    return (...args) => {
        const now = Date.now()
        if (now - lastCall >= limit) {
            lastCall = now
            fn(...args)
        }
    }
}

/**
 * Add multiple event listeners and return a single cleanup function.
 * @param {Array<[EventTarget, string, EventListener, AddEventListenerOptions?]>} listeners
 * @returns {() => void} removeAll
 */
export const addListeners = (listeners) => {
    listeners.forEach(([target, event, handler, opts]) =>
        target.addEventListener(event, handler, opts)
    )

    return () => {
        listeners.forEach(([target, event, handler, opts]) =>
            target.removeEventListener(event, handler, opts)
        )
    }
}

/**
 * Once — fires handler exactly once then removes itself.
 * @param {EventTarget} target
 * @param {string} event
 * @param {EventListener} handler
 */
export const once = (target, event, handler) => {
    target.addEventListener(event, handler, { once: true })
}

/**
 * Pointer position normalized to { x, y } (works for mouse and touch).
 * @param {MouseEvent|TouchEvent} e
 * @returns {{ x: number, y: number }}
 */
export const getPointer = (e) => {
    if ('touches' in e && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    return {
        x: /** @type {MouseEvent} */ (e).clientX,
        y: /** @type {MouseEvent} */ (e).clientY,
    }
}