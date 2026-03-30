/**
 * components/Footer.js — Footer section component
 *
 * Responsibilities:
 *  - Current year injection
 *  - Back-to-top scroll behavior
 *  - Hover state management for footer links (delegated)
 *
 * No entrance animation — handled via CSS transitions.
 */

import { qs } from '../utils/dom.js'
import { delegate } from '../utils/events.js'

/**
 * @param {Element} root
 * @returns {{ init: () => void, destroy: () => void }}
 */
const Footer = (root) => {
    const _yearEl = qs('[data-year]', root)
    const _backToTop = qs('[data-back-to-top]', root)

    let _removeDelegate = null

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const _onBackToTop = (e) => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // ─── Lifecycle ────────────────────────────────────────────────────────────

    const init = () => {
        // Inject current year
        if (_yearEl) {
            _yearEl.textContent = new Date().getFullYear()
        }

        if (_backToTop) {
            _backToTop.addEventListener('click', _onBackToTop)
        }

        // Delegated hover underline for footer links (CSS handles visual)
        _removeDelegate = delegate(root, 'click', 'a[data-footer-link]', (e) => {
            // Placeholder for any link analytics hook
        })
    }

    const destroy = () => {
        _backToTop?.removeEventListener('click', _onBackToTop)
        _removeDelegate?.()
    }

    return { init, destroy }
}

export default Footer