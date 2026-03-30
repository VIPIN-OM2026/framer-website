export const aboutTimeline = (
  gsap,
  ScrollTrigger,
  elements,
  fadeUpFn,
  clipRevealFn,
) => {
  const { section, eyebrow, heading, body, stats, media } = elements;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      once: true,
      invalidateOnRefresh: true,
    },
  });
  if (media) {
    tl.add(
      clipRevealFn(gsap, media, {
        direction: "left",
        duration: 1.2,
        ease: "power4.out",
      }),
      0,
    );
  }
  if (eyebrow) {
    tl.add(fadeUpFn(gsap, eyebrow, { y: 20, duration: 0.6 }), 0.2);
  }
  if (heading) {
    tl.add(
      fadeUpFn(gsap, heading, { y: 40, duration: 1.0, ease: "power3.out" }),
      0.35,
    );
  }
  if (body) {
    tl.add(
      fadeUpFn(gsap, body, { y: 30, duration: 0.8, ease: "power2.out" }),
      0.55,
    );
  }
  if (stats?.length) {
    tl.fromTo(
      stats,
      { y: 30, opacity: 0, force3D: true },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        force3D: true,
        stagger: { amount: 0.2, from: "start" },
      },
      0.65,
    );
  }
  return tl;
};
