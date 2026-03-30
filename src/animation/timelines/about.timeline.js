/**
 * animation/timelines/about.timeline.js
 *
 * Scroll-triggered entrance for the about section.
 * Text reveals line-by-line; stats count up; media clips in.
 *
 * @param {gsap} gsap
 * @param {ScrollTrigger} ScrollTrigger
 * @param {Object} elements
 * @param {Element} elements.section
 * @param {Element} elements.eyebrow
 * @param {Element} elements.heading
 * @param {Element} elements.body
 * @param {Element[]} elements.stats
 * @param {Element} elements.media
 * @param {import('../utils/fadeUp.js').fadeUp} fadeUpFn
 * @param {import('../utils/clipReveal.js').clipReveal} clipRevealFn
 * @returns {gsap.core.Timeline}
 */
export const aboutTimeline = (
    gsap,
    ScrollTrigger,
    elements,
    fadeUpFn,
    clipRevealFn
) => {
    const { section, eyebrow, heading, body, stats, media } = elements

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            once: true,
            invalidateOnRefresh: true,
        },
    })

    // Media — clip reveal from left
    if (media) {
        tl.add(
            clipRevealFn(gsap, media, { direction: 'left', duration: 1.2, ease: 'power4.out' }),
            0
        )
    }

    // Eyebrow
    if (eyebrow) {
        tl.add(fadeUpFn(gsap, eyebrow, { y: 20, duration: 0.6 }), 0.2)
    }

    // Heading
    if (heading) {
        tl.add(fadeUpFn(gsap, heading, { y: 40, duration: 1.0, ease: 'power3.out' }), 0.35)
    }

    // Body text
    if (body) {
        tl.add(fadeUpFn(gsap, body, { y: 30, duration: 0.8, ease: 'power2.out' }), 0.55)
    }

    // Stats — staggered
    if (stats?.length) {
        tl.fromTo(
            stats,
            { y: 30, opacity: 0, force3D: true },
            {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: 'power3.out',
                force3D: true,
                stagger: { amount: 0.2, from: 'start' },
            },
            0.65
        )
    }

    return tl
}