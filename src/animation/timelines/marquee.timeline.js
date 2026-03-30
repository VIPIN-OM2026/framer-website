/**
 * animation/timelines/marquee.timeline.js
 *
 * Scroll-triggered entrance for the marquee section.
 * The actual infinite scroll animation is handled by Marquee.js (JS component).
 * This timeline controls the section's entry reveal only.
 *
 * @param {gsap} gsap
 * @param {ScrollTrigger} ScrollTrigger
 * @param {Element} section
 * @param {import('../utils/clipReveal.js').clipReveal} clipRevealFn
 * @returns {gsap.core.Timeline}
 */
export const marqueeTimeline = (gsap, ScrollTrigger, section, clipRevealFn) => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            once: true,
            invalidateOnRefresh: true,
        },
    })

    tl.add(
        clipRevealFn(gsap, section, {
            direction: 'bottom',
            duration: 0.8,
            ease: 'power3.out',
        }),
        0
    )

    return tl
}