/**
 * components/WorkGrid.js — Work/portfolio grid component
 *
 * Responsibilities:
 *  - Query and expose elements for work.timeline.js
 *  - Manage card hover interactions (cursor label follow)
 *  - Handle cursor label show/hide per card
 *
 * No animation entrance logic — that lives in work.timeline.js.
 */

import { qs, qsa } from '../utils/dom.js'
import { delegate, addListeners } from '../utils/events.js'
import { raf, lerp } from '../utils/raf.js'
import { isTouchDevice } from '../utils/media.js'

/**
 * @param {Element} root
 * @returns {{ init: () => void, destroy: () => void, elements: Object }}
 */
const WorkGrid = (root) => {
    // ─── DOM refs ─────────────────────────────────────────────────────────────
    const _cards = qsa('[data-work-card]', root)
    const _heading = qs('[data-work-heading]', root)
    const _cursor = qs('#cursor', document)

    const elements = {
        section: root,
        heading: _heading,
        cards: _cards,
    }

    // ─── Cursor follow state ──────────────────────────────────────────────────
    const _pos = { x: 0, y: 0 }
    const _current = { x: 0, y: 0 }
    let _visible = false
    let _removeRaf = null
    let _removeDelegates = []

    const _tick = () => {
        if (!_cursor) return
        _current.x = lerp(_current.x, _pos.x, 0.12)
        _current.y = lerp(_current.y, _pos.y, 0.12)
        _cursor.style.transform =
            `translate3d(${_current.x.toFixed(2)}px, ${_current.y.toFixed(2)}px, 0)`
    }

    const _onMouseMove = (e) => {
        _pos.x = e.clientX
        _pos.y = e.clientY
    }

    const _showCursor = (e, card) => {
        if (!_cursor || isTouchDevice()) return
        const label = card.dataset.cursorLabel || 'View'
        const labelEl = qs('[data-cursor-label]', _cursor)
        if (labelEl) labelEl.textContent = label
        _cursor.style.opacity = '1'
        _visible = true
    }

    const _hideCursor = () => {
        if (!_cursor) return
        _cursor.style.opacity = '0'
        _visible = false
    }

    // ─── Lifecycle ────────────────────────────────────────────────────────────

    const init = () => {
        if (!_cards.length) return

        if (!isTouchDevice() && _cursor) {
            _removeRaf = raf.add(_tick)

            const removeMove = delegate(root, 'mousemove', '[data-work-card]', _onMouseMove)
            const removeEnter = delegate(root, 'mouseenter', '[data-work-card]', _showCursor, true)
            const removeLeave = delegate(root, 'mouseleave', '[data-work-card]', _hideCursor, true)

            _removeDelegates = [removeMove, removeEnter, removeLeave]
        }
    }

    const destroy = () => {
        _removeRaf?.()
        _removeDelegates.forEach((fn) => fn())
        _removeDelegates = []
        _hideCursor()
    }

    return { init, destroy, elements }
}

export default WorkGrid