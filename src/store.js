/**
 * store.js — Singleton pub/sub state module
 *
 * The single source of truth for cross-cutting runtime state.
 * Components subscribe to slices they care about; no component imports
 * another component. The store is the only shared dependency.
 *
 * Usage:
 *   import store from './store.js'
 *   store.set('theme', 'dark')
 *   const unsub = store.subscribe('theme', (value) => { ... })
 *   unsub() // clean up
 */

const createStore = () => {
    /** @type {Record<string, unknown>} */
    const state = {
        theme: 'light',  // 'light' | 'dark'
        scrollY: 0,
        scrollDir: 'down',   // 'up' | 'down'
        isNavScrolled: false,
        reducedMotion: false,
        activeSection: null,
    }

    /** @type {Map<string, Set<Function>>} */
    const subscribers = new Map()

    /**
     * Get current value of a state key.
     * @param {string} key
     */
    const get = (key) => state[key]

    /**
     * Set a state value and notify all subscribers for that key.
     * Only notifies if value actually changed (strict equality).
     * @param {string} key
     * @param {unknown} value
     */
    const set = (key, value) => {
        if (state[key] === value) return

        state[key] = value

        const fns = subscribers.get(key)
        if (fns) {
            fns.forEach((fn) => fn(value, key))
        }
    }

    /**
     * Subscribe to changes on a specific key.
     * Returns an unsubscribe function.
     * @param {string} key
     * @param {Function} fn
     * @returns {Function} unsubscribe
     */
    const subscribe = (key, fn) => {
        if (!subscribers.has(key)) {
            subscribers.set(key, new Set())
        }
        subscribers.get(key).add(fn)

        return () => {
            subscribers.get(key)?.delete(fn)
        }
    }

    /**
     * Get a snapshot of the full state (for debugging).
     * @returns {Readonly<Record<string, unknown>>}
     */
    const snapshot = () => Object.freeze({ ...state })

    return { get, set, subscribe, snapshot }
}

const store = createStore()

export default store