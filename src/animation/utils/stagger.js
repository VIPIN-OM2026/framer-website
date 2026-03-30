/**
 * animation/utils/stagger.js — Staggered children animation factory
 *
 * Animates child elements of a parent with a staggered fadeUp.
 * Designed for lists, grids, and any repeating element groups.
 *
 * Only animates: transform (y) + opacity — compositor-thread only.
 *
 * @param {gsap} gsap
 * @param {Element} parent
 * @param {string} childSelector
 * @param {Object} [options]
 * @param {number} [options.y=40]
 * @param {number} [options.duration=0.8]
 * @param {number} [options.stagger=0.08]
 * @param {number} [options.delay=0]
 * @param {string} [options.ease='power3.out']
 * @param {string} [options.from='start'] — 'start' | 'end' | 'center' | 'random'
 * @returns {gsap.core.Timeline}
 */
export const stagger = (gsap, parent, childSelector, options = {}) => {
    const {
        y = 40,
        duration = 0.8,
        stagger: staggerAmount = 0.08,
        delay = 0,
        ease = 'power3.out',
        from = 'start',
    } = options

    const children = gsap.utils.toArray(
        parent.querySelectorAll(childSelector)
    )

    if (!children.length) return gsap.timeline()

    const tl = gsap.timeline()

    tl.fromTo(
        children,
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
            force3D: true,
            stagger: {
                amount: staggerAmount * children.length,
                from,
            },
            onStart() {
                children.forEach((el) => el.classList?.add('will-animate'))
            },
            onComplete() {
                children.forEach((el) => {
                    el.classList?.remove('will-animate')
                    el.style.willChange = ''
                })
            },
        }
    )

    return tl
}