/**
 * animation/orchestrator.js — Central animation registry
 *
 * Responsibilities:
 *  - Lazily load GSAP core + plugins via dynamic import()
 *  - Register named section timelines
 *  - Gate all animation behind prefers-reduced-motion
 *  - Provide bulk kill / pause / resume / refresh
 *  - Expose gsap instance for components that need it after init
 *
 * GSAP is NOT imported statically — it is loaded only after
 * DOMContentLoaded, keeping it off the critical render path.
 */

import { prefersReducedMotion } from '../utils/media.js'
import { fadeUp } from './utils/fadeUp.js'
import { clipReveal } from './utils/clipReveal.js'
import { stagger } from './utils/stagger.js'
import { magnetic } from './utils/magnetic.js'

import { heroTimeline } from './timelines/hero.timeline.js'
import { marqueeTimeline } from './timelines/marquee.timeline.js'
import { workTimeline } from './timelines/work.timeline.js'
import { aboutTimeline } from './timelines/about.timeline.js'
import { ctaTimeline } from './timelines/cta.timeline.js'

const createOrchestrator = () => {
    /** @type {Map<string, gsap.core.Timeline | ScrollTrigger>} */
    const registry = new Map()

    /** @type {import('gsap').gsap | null} */
    let _gsap = null

    /** @type {typeof ScrollTrigger | null} */
    let _ScrollTrigger = null

    let _reduced = false

    // ─── Utility helpers bound after GSAP loads ─────────────────────────────

    const _fadeUp = (...args) => fadeUp(_gsap, ...args)
    const _clipReveal = (...args) => clipReveal(_gsap, ...args)
    const _stagger = (...args) => stagger(_gsap, ...args)

    /**
     * Lazily load GSAP and required plugins.
     * Safe to call multiple times — resolves immediately after first load.
     */
    const _loadGSAP = async () => {
        if (_gsap) return

        const [gsapModule, stModule] = await Promise.all([
            import('gsap'),
            import('gsap/ScrollTrigger'),
        ])

        _gsap = gsapModule.gsap
        _ScrollTrigger = stModule.ScrollTrigger

        // Register plugin
        _gsap.registerPlugin(_ScrollTrigger)

        // Cap RAF to 60fps — prevent runaway loops on 120Hz+ displays
        _gsap.ticker.fps(60)

        // Lagsmoothing prevents large jumps after tab switch
        _gsap.ticker.lagSmoothing(500, 33)
    }

    /**
     * Initialize — load GSAP, check motion preference, build all timelines.
     * Call once from main.js after DOM is ready and components have mounted.
     *
     * @param {Record<string, Object>} sectionElements
     *   Map of section name → pre-queried DOM element objects
     */
    const init = async (sectionElements) => {
        await _loadGSAP()

        _reduced = prefersReducedMotion()

        if (_reduced) {
            _applyReducedMotionFallback(sectionElements)
            return
        }

        // ── Hero (plays immediately — no ScrollTrigger) ──────────────────────
        if (sectionElements.hero) {
            const tl = heroTimeline(
                _gsap,
                _ScrollTrigger,
                sectionElements.hero,
                _fadeUp,
                _clipReveal
            )
            registry.set('hero', tl)
        }

        // ── Marquee ───────────────────────────────────────────────────────────
        if (sectionElements.marquee?.section) {
            const tl = marqueeTimeline(
                _gsap,
                _ScrollTrigger,
                sectionElements.marquee.section,
                _clipReveal
            )
            registry.set('marquee', tl)
        }

        // ── Work grid ─────────────────────────────────────────────────────────
        if (sectionElements.work) {
            const tl = workTimeline(
                _gsap,
                _ScrollTrigger,
                sectionElements.work,
                _fadeUp,
                _stagger
            )
            registry.set('work', tl)
        }

        // ── About ─────────────────────────────────────────────────────────────
        if (sectionElements.about) {
            const tl = aboutTimeline(
                _gsap,
                _ScrollTrigger,
                sectionElements.about,
                _fadeUp,
                _clipReveal
            )
            registry.set('about', tl)
        }

        // ── CTA ───────────────────────────────────────────────────────────────
        if (sectionElements.cta) {
            const tl = ctaTimeline(
                _gsap,
                _ScrollTrigger,
                sectionElements.cta,
                _fadeUp,
                _clipReveal
            )
            registry.set('cta', tl)
        }
    }

    /**
     * When reduced motion is preferred, skip all animations
     * and immediately show all elements at final opacity.
     * @param {Record<string, Object>} sectionElements
     */
    const _applyReducedMotionFallback = (sectionElements) => {
        const allTargets = []

        Object.values(sectionElements).forEach((group) => {
            if (!group) return
            Object.values(group).forEach((el) => {
                if (!el) return
                if (Array.isArray(el)) allTargets.push(...el)
                else allTargets.push(el)
            })
        })

        allTargets.forEach((el) => {
            if (el instanceof Element) {
                el.style.opacity = '1'
                el.style.transform = 'none'
                el.style.clipPath = ''
            }
        })
    }

    /**
     * Kill a named timeline (or all if no name given).
     * @param {string} [name]
     */
    const kill = (name) => {
        if (name) {
            registry.get(name)?.kill()
            registry.delete(name)
        } else {
            registry.forEach((tl) => tl.kill())
            registry.clear()
            _ScrollTrigger?.getAll().forEach((t) => t.kill())
        }
    }

    /**
     * Pause a named timeline (or all).
     * @param {string} [name]
     */
    const pause = (name) => {
        if (name) registry.get(name)?.pause()
        else registry.forEach((tl) => tl.pause?.())
    }

    /**
     * Resume a named timeline (or all).
     * @param {string} [name]
     */
    const resume = (name) => {
        if (name) registry.get(name)?.resume()
        else registry.forEach((tl) => tl.resume?.())
    }

    /**
     * Refresh all ScrollTrigger instances.
     * Call after DOM layout changes (font load, image load, resize).
     */
    const refresh = () => {
        _ScrollTrigger?.refresh()
    }

    /**
     * Access the loaded GSAP instance (after init has resolved).
     * @returns {import('gsap').gsap | null}
     */
    const gsap = () => _gsap

    /**
     * Create a magnetic effect on an element.
     * Requires GSAP to be loaded (call after init).
     */
    const createMagnetic = (el, options) => {
        if (!_gsap) return { mount: () => { }, unmount: () => { } }
        return magnetic(_gsap, el, options)
    }

    return {
        init,
        kill,
        pause,
        resume,
        refresh,
        gsap,
        createMagnetic,
    }
}

const orchestrator = createOrchestrator()

export default orchestrator