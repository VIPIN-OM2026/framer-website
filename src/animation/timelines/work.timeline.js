/**
 * animation/timelines/work.timeline.js
 *
 * Scroll-triggered entrance for the work grid section.
 * Each card fades up with a stagger.
 *
 * @param {gsap} gsap
 * @param {ScrollTrigger} ScrollTrigger
 * @param {Object} elements
 * @param {Element} elements.section
 * @param {Element} elements.heading
 * @param {Element[]} elements.cards
 * @param {import('../utils/fadeUp.js').fadeUp} fadeUpFn
 * @param {import('../utils/stagger.js').stagger} staggerFn
 * @returns {gsap.core.Timeline}
 */
export const workTimeline = (
    gsap,
    ScrollTrigger,
    elements,
    fadeUpFn,
    staggerFn
) => {
    const { section, heading, cards } = elements

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
            invalidateOnRefresh: true,
        },
    })

    if (heading) {
        tl.add(fadeUpFn(gsap, heading, { y: 40, duration: 0.9, ease: 'power3.out' }), 0)
    }

    if (cards?.length) {
        tl.fromTo(
            cards,
            { y: 60, opacity: 0, force3D: true },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: 'power3.out',
                force3D: true,
                stagger: {
                    amount: 0.3,
                    from: 'start',
                },
                onStart() {
                    cards.forEach((c) => c.classList?.add('will-animate'))
                },
                onComplete() {
                    cards.forEach((c) => {
                        c.classList?.remove('will-animate')
                        c.style.willChange = ''
                    })
                },
            },
            0.15
        )
    }

    return tl
}