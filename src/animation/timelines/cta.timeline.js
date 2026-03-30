export const ctaTimeline = (
  gsap,
  ScrollTrigger,
  elements,
  fadeUpFn,
  clipRevealFn,
) => {
  const { section, heading, subtext, button } = elements;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      once: true,
      invalidateOnRefresh: true,
    },
  });
  if (heading) {
    tl.add(
      clipRevealFn(gsap, heading, {
        direction: "bottom",
        duration: 1.1,
        ease: "power4.out",
      }),
      0,
    );
  }
  if (subtext) {
    tl.add(
      fadeUpFn(gsap, subtext, { y: 28, duration: 0.8, ease: "power2.out" }),
      0.4,
    );
  }
  if (button) {
    tl.add(
      fadeUpFn(gsap, button, { y: 20, duration: 0.7, ease: "power2.out" }),
      0.6,
    );
  }
  return tl;
};
