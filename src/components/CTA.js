/**
 * components/CTA.js — Call-to-action section component
 *
 * Responsibilities:
 *  - Query and expose elements for cta.timeline.js
 *  - Mount magnetic effect on CTA button via orchestrator
 *  - No entrance animation logic — that lives in cta.timeline.js
 */

import { qs } from '../utils/dom.js'
import orchestrator from '../animation/orchestrator.js'
import { isTouchDevice } from '../utils/media.js'

/**
 * @param {Element} root
 * @returns {{ init: () => void, destroy: () => void, elements: Object }}
 */
const CTA = (root) => {
    // ─── DOM refs ─────────────────────────────────────────────────────────────
    const _button = qs('[data-cta-button]', root)
    const _heading = qs('[data-cta-heading]', root)
    const _subtext = qs('[data-cta-subtext]', root)

    const elements = {
        section: root,
        heading: _heading,
        subtext: _subtext,
        button: _button,
    }

    let _magnetic = null

    // ─── Lifecycle ────────────────────────────────────────────────────────────

    const init = () => {
        // Mount magnetic effect on button (touch devices skip this)
        if (_button && !isTouchDevice()) {
            _magnetic = orchestrator.createMagnetic(_button, {
                strength: 0.35,
                radius: 90,
                duration: 0.5,
            })
            _magnetic.mount()
        }
    }

    const destroy = () => {
        _magnetic?.unmount()
        _magnetic = null
    }

    return { init, destroy, elements }
}

export default CTA