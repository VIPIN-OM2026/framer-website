/**
 * components/Hero.js — Hero section component
 *
 * Responsibilities:
 *  - Query and expose DOM elements for hero.timeline.js
 *  - Handle any interactive parallax state (mouse move)
 *  - No animation logic — that lives in hero.timeline.js
 *
 * Returns `elements` so the orchestrator can pass them to the timeline.
 */

import { qs } from '../utils/dom.js'
import { addListeners, throttle } from '../utils/events.js'
import { raf, lerp } from '../utils/raf.js'
import { isTouchDevice } from '../utils/media.js'

/**
 * @param {Element} root — The #hero element
 * @returns {{ init: () => void, destroy: () => void, elements: Object }}
 */
const Hero = (root) => {
    // ─── DOM refs ─────────────────────────────────────────────────────────────
    const elements = {
        eyebrow: qs('[data-hero-eyebrow]', root),
        heading: qs('[data-hero-heading]', root),
        subtext: qs('[data-hero-subtext]', root),
        cta: qs('[data-hero-cta]', root),
        scrollIndicator: qs('[data-hero-scroll]', root),
        mediaWrap: qs('[data-hero-media]', root),
        parallaxTarget: qs('[data-parallax]', root),
    }

    // ─── Parallax state ───────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    const STRENGTH = 0.015
    let _removeRaf = null
    let _removeListeners = null

    const _onMouseMove = throttle((e) => {
        const cx = window.innerWidth / 2
        const cy = window.innerHeight / 2
        mouse.x = (e.clientX - cx) * STRENGTH
        mouse.y = (e.clientY - cy) * STRENGTH
    }, 16)

    const _tick = () => {
        if (!elements.parallaxTarget) return

        current.x = lerp(current.x, mouse.x, 0.06)
        current.y = lerp(current.y, mouse.y, 0.06)

        elements.parallaxTarget.style.transform =
            `translate3d(${current.x.toFixed(3)}px, ${current.y.toFixed(3)}px, 0)`
    }

    // ─── Lifecycle ────────────────────────────────────────────────────────────

    const init = () => {
        // Parallax only on non-touch devices
        if (elements.parallaxTarget && !isTouchDevice()) {
            _removeListeners = addListeners([
                [window, 'mousemove', _onMouseMove, { passive: true }],
            ])
            _removeRaf = raf.add(_tick)
        }
    }

    const destroy = () => {
        _removeListeners?.()
        _removeRaf?.()

        if (elements.parallaxTarget) {
            elements.parallaxTarget.style.transform = ''
        }
    }

    return { init, destroy, elements }
}

export default Hero