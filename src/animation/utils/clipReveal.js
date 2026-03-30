/**
 * animation/utils/clipReveal.js — Clip-path reveal animation factory
 *
 * Reveals elements using clip-path inset() — GPU composited.
 * Supports directional reveals: top, bottom (default), left, right.
 *
 * Only animates: clip-path + opacity — compositor-thread only.
 * Note: clip-path is GPU-composited in modern browsers when
 * combined with `will-change: clip-path`.
 *
 * @param {gsap} gsap
 * @param {Element|Element[]|string} targets
 * @param {Object} [options]
 * @param {'top'|'bottom'|'left'|'right'} [options.direction='bottom']
 * @param {number} [options.duration=1.2]
 * @param {number} [options.delay=0]
 * @param {string} [options.ease='power4.out']
 * @param {number} [options.stagger=0]
 * @returns {gsap.core.Timeline}
 */
export const clipReveal = (gsap, targets, options = {}) => {
    const {
        direction = 'bottom',
        duration = 1.2,
        delay = 0,
        ease = 'power4.out',
        stagger = 0,
    } = options

    const CLIP_FROM = {
        top: 'inset(0 0 100% 0)',
        bottom: 'inset(100% 0 0 0)',
        left: 'inset(0 100% 0 0)',
        right: 'inset(0 0 0 100%)',
    }

    const tl = gsap.timeline()

    tl.fromTo(
        targets,
        {
            clipPath: CLIP_FROM[direction],
            force3D: true,
        },
        {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration,
            delay,
            ease,
            stagger,
            force3D: true,
            onStart() {
                const els = gsap.utils.toArray(targets)
                els.forEach((el) => {
                    el.classList?.add('will-animate')
                    el.style.willChange = 'clip-path'
                })
            },
            onComplete() {
                const els = gsap.utils.toArray(targets)
                els.forEach((el) => {
                    el.classList?.remove('will-animate')
                    el.style.willChange = ''
                    // Reset clip-path to avoid stacking context issues
                    el.style.clipPath = ''
                })
            },
        }
    )

    return tl
}