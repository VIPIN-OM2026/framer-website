export const marqueeTimeline = (gsap, ScrollTrigger, section, clipRevealFn) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 90%",
      once: true,
      invalidateOnRefresh: true,
    },
  });
  tl.add(
    clipRevealFn(gsap, section, {
      direction: "bottom",
      duration: 0.8,
      ease: "power3.out",
    }),
    0,
  );
  return tl;
};
