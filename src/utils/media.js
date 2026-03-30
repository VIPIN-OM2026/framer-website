/**
 * utils/media.js — Breakpoint and media query utilities
 *
 * Rules:
 *  - No DOM queries beyond matchMedia (it is a media API, not a DOM API)
 *  - No business logic
 *  - Breakpoints mirror Tailwind defaults — update both if changed
 */

/** @type {Record<string, number>} */
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
}

/**
 * Check if a breakpoint is currently active (viewport >= breakpoint).
 * @param {keyof typeof BREAKPOINTS} bp
 * @returns {boolean}
 */
export const isBreakpoint = (bp) =>
    window.matchMedia(`(min-width: ${BREAKPOINTS[bp]}px)`).matches

/**
 * Returns current active breakpoint key.
 * @returns {keyof typeof BREAKPOINTS | 'base'}
 */
export const currentBreakpoint = () => {
    const entries = Object.entries(BREAKPOINTS).reverse()
    for (const [key, value] of entries) {
        if (window.innerWidth >= value) return key
    }
    return 'base'
}

/**
 * Check if user prefers reduced motion.
 * @returns {boolean}
 */
export const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Check if user prefers dark color scheme.
 * @returns {boolean}
 */
export const prefersDark = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches

/**
 * Listen for a breakpoint crossing (up or down).
 * Returns an unsubscribe function.
 *
 * @param {keyof typeof BREAKPOINTS} bp
 * @param {(matches: boolean) => void} handler
 * @returns {() => void}
 */
export const onBreakpoint = (bp, handler) => {
    const mq = window.matchMedia(`(min-width: ${BREAKPOINTS[bp]}px)`)
    const listener = (/** @type {MediaQueryListEvent} */ e) => handler(e.matches)

    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
}

/**
 * Subscribe to any media query change.
 * Returns an unsubscribe function.
 *
 * @param {string} query
 * @param {(matches: boolean) => void} handler
 * @returns {{ matches: boolean, unsubscribe: () => void }}
 */
export const watchMedia = (query, handler) => {
    const mq = window.matchMedia(query)
    const listener = (/** @type {MediaQueryListEvent} */ e) => handler(e.matches)

    mq.addEventListener('change', listener)

    return {
        matches: mq.matches,
        unsubscribe: () => mq.removeEventListener('change', listener),
    }
}

/**
 * Check if the device has a coarse pointer (i.e. is touch-primary).
 * @returns {boolean}
 */
export const isTouchDevice = () =>
    window.matchMedia('(pointer: coarse)').matches

/**
 * Get viewport dimensions.
 * @returns {{ width: number, height: number }}
 */
export const viewport = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
})