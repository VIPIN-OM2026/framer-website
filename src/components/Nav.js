/**
 * components/Nav.js — Navigation component
 *
 * Responsibilities:
 *  - Track scroll position and apply scrolled state class
 *  - Handle theme toggle button
 *  - Subscribe to store for theme changes (update toggle label)
 *  - Manage mobile menu open/close
 *
 * No animations here — all visual transitions via CSS.
 * No global DOM queries — all queries scoped to root.
 */

import store from '../store.js'
import ThemeManager from '../theme.js'
import { qs } from '../utils/dom.js'
import { addListeners, throttle } from '../utils/events.js'

/**
 * @param {Element} root — The <nav> element
 * @returns {{ init: () => void, destroy: () => void }}
 */
const Nav = (root) => {
    // ─── Internal state ──────────────────────────────────────────────────────
    let _cleanupListeners = null
    let _unsubTheme = null

    // ─── DOM refs (scoped to root) ───────────────────────────────────────────
    const _themeToggle = qs('[data-theme-toggle]', root)
    const _menuToggle = qs('[data-menu-toggle]', root)
    const _mobileMenu = qs('[data-mobile-menu]', root)
    const _menuOverlay = qs('[data-menu-overlay]', root)

    // ─── Handlers ────────────────────────────────────────────────────────────

    const _onScroll = throttle(() => {
        const scrolled = window.scrollY > 40
        root.classList.toggle('scrolled', scrolled)
        store.set('isNavScrolled', scrolled)
        store.set('scrollY', window.scrollY)
    }, 100)

    const _onThemeToggle = () => {
        ThemeManager.toggle()
    }

    const _onMenuToggle = () => {
        const isOpen = _mobileMenu?.getAttribute('aria-hidden') === 'false'
        _setMenuOpen(!isOpen)
    }

    const _onOverlayClick = () => {
        _setMenuOpen(false)
    }

    const _onKeydown = (e) => {
        if (e.key === 'Escape') _setMenuOpen(false)
    }

    // ─── Menu state ───────────────────────────────────────────────────────────

    const _setMenuOpen = (open) => {
        if (!_mobileMenu) return

        _mobileMenu.setAttribute('aria-hidden', String(!open))
        _menuToggle?.setAttribute('aria-expanded', String(open))
        document.body.style.overflow = open ? 'hidden' : ''

        if (_menuOverlay) {
            _menuOverlay.style.opacity = open ? '1' : '0'
            _menuOverlay.style.pointerEvents = open ? 'auto' : 'none'
        }
    }

    // ─── Theme label sync ─────────────────────────────────────────────────────

    const _syncThemeLabel = (theme) => {
        if (!_themeToggle) return
        _themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`)
        _themeToggle.setAttribute('data-current-theme', theme)
    }

    // ─── Lifecycle ────────────────────────────────────────────────────────────

    const init = () => {
        // Initial scroll check
        _onScroll()

        // Build listener list
        const listeners = [
            [window, 'scroll', _onScroll, { passive: true }],
            [document, 'keydown', _onKeydown],
        ]

        if (_themeToggle) listeners.push([_themeToggle, 'click', _onThemeToggle])
        if (_menuToggle) listeners.push([_menuToggle, 'click', _onMenuToggle])
        if (_menuOverlay) listeners.push([_menuOverlay, 'click', _onOverlayClick])

        _cleanupListeners = addListeners(listeners)

        // Subscribe to theme changes in store
        _unsubTheme = store.subscribe('theme', _syncThemeLabel)

        // Initial label sync
        _syncThemeLabel(store.get('theme'))
    }

    const destroy = () => {
        _cleanupListeners?.()
        _unsubTheme?.()
        _setMenuOpen(false)
        document.body.style.overflow = ''
    }

    return { init, destroy }
}

export default Nav