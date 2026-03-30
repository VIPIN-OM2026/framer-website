/**
 * theme.js — ThemeManager singleton
 *
 * Responsibilities:
 *  - Read persisted theme from localStorage on init
 *  - Fall back to prefers-color-scheme if no stored preference
 *  - Apply theme by setting data-theme on <html>
 *  - Write preference to localStorage on change
 *  - Notify store of theme changes
 *
 * FOUC prevention:
 *  A separate inline <script> in <head> sets data-theme synchronously
 *  before any stylesheet parses. This module handles subsequent changes.
 */

import store from './store.js'

const STORAGE_KEY = 'theme'
const ATTR_NAME = 'data-theme'
const VALID_THEMES = /** @type {const} */ (['light', 'dark'])

/** @typedef {'light' | 'dark'} Theme */

const ThemeManager = (() => {
    let _current = /** @type {Theme} */ ('light')

    /**
     * Detect system preference.
     * @returns {Theme}
     */
    const _detectSystem = () =>
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

    /**
     * Apply theme to the DOM and sync store.
     * @param {Theme} theme
     */
    const _apply = (theme) => {
        document.documentElement.setAttribute(ATTR_NAME, theme)
        _current = theme
        store.set('theme', theme)
    }

    /**
     * Initialize — reads storage, falls back to system, applies theme.
     * Call once from main.js after DOM is available.
     */
    const init = () => {
        const stored = localStorage.getItem(STORAGE_KEY)
        const theme = VALID_THEMES.includes(/** @type {Theme} */(stored))
            ? /** @type {Theme} */ (stored)
            : _detectSystem()

        _apply(theme)

        // Listen for system preference changes (only if user hasn't pinned a choice)
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                // Only respond if there's no stored user preference
                if (!localStorage.getItem(STORAGE_KEY)) {
                    _apply(e.matches ? 'dark' : 'light')
                }
            })
    }

    /**
     * Set a specific theme and persist it.
     * @param {Theme} theme
     */
    const set = (theme) => {
        if (!VALID_THEMES.includes(theme)) return
        localStorage.setItem(STORAGE_KEY, theme)
        _apply(theme)
    }

    /**
     * Toggle between light and dark.
     */
    const toggle = () => {
        set(_current === 'light' ? 'dark' : 'light')
    }

    /**
     * Get the current active theme.
     * @returns {Theme}
     */
    const current = () => _current

    /**
     * Remove persisted preference (revert to system).
     */
    const reset = () => {
        localStorage.removeItem(STORAGE_KEY)
        _apply(_detectSystem())
    }

    return { init, set, toggle, current, reset }
})()

export default ThemeManager