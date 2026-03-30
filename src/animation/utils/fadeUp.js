/**
 * animation/utils/fadeUp.js — Reusable fade-up animation factory
 *
 * Returns a pre-configured gsap.timeline() so the caller can
 * position it within a parent timeline at any offset.
 *
 * Only animates: transform (y) + opacity — compositor-thread only.
 *
 * @param {gsap} gsap — GSAP instance (injected to avoid direct import)
 * @param {Element|Element[]|string} targets
 * @param {Object} [options]
 * @param {number} [options.y=60]             — start y offset in px
 * @param {number} [options.duration=0.9]     — seconds
 * @param {number} [options.delay=0]          — seconds
 * @param {string} [options.ease='power3.out']
 * @param {number} [options.stagger=0]        — stagger between targets
 * @returns {gsap.core.Timeline}
 */
export const fadeUp = (gsap, targets, options = {}) => {
    const {
        y = 60,
        duration = 0.9,
        delay = 0,
        ease = 'power3.out',
        stagger = 0,
    } = options

    const tl = gsap.timeline()

    tl.fromTo(
        targets,
        {
            y,
            opacity: 0,
            force3D: true,
        },
        {
            y: 0,
            opacity: 1,
            duration,
            delay,
            ease,
            stagger,
            force3D: true,
            onStart() {
                const els = gsap.utils.toArray(targets)
                els.forEach((el) => el.classList?.add('will-animate'))
            },
            onComplete() {
                const els = gsap.utils.toArray(targets)
                els.forEach((el) => {
                    el.classList?.remove('will-animate')
                    el.style.willChange = ''
                })
            },
        }
    )

    return tl
}