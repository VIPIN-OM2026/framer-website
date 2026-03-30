export const heroTimeline = (
  gsap,
  ScrollTrigger,
  elements,
  fadeUpFn,
  clipRevealFn,
) => {
  const { eyebrow, heading, subtext, cta, scrollIndicator, mediaWrap } =
    elements;
  const tl = gsap.timeline({
    defaults: { ease: "power3.out", force3D: true },
  });
  if (mediaWrap) {
    tl.add(
      clipRevealFn(gsap, mediaWrap, {
        direction: "top",
        duration: 1.6,
        ease: "power4.out",
      }),
      0,
    );
  }
  if (eyebrow) {
    tl.add(
      fadeUpFn(gsap, eyebrow, { y: 24, duration: 0.7, ease: "power2.out" }),
      0.3,
    );
  }
  if (heading) {
    const lines = heading.querySelectorAll(".line");
    if (lines.length) {
      tl.add(
        clipRevealFn(gsap, Array.from(lines), {
          direction: "bottom",
          duration: 1.0,
          ease: "power4.out",
          stagger: 0.08,
        }),
        0.45,
      );
    } else {
      tl.add(fadeUpFn(gsap, heading, { y: 48, duration: 1.0 }), 0.45);
    }
  }
  if (subtext) {
    tl.add(
      fadeUpFn(gsap, subtext, { y: 32, duration: 0.8, ease: "power2.out" }),
      0.7,
    );
  }
  if (cta) {
    tl.add(
      fadeUpFn(gsap, cta, { y: 24, duration: 0.7, ease: "power2.out" }),
      0.85,
    );
  }
  if (scrollIndicator) {
    tl.fromTo(
      scrollIndicator,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      1.1,
    );
  }
  return tl;
};
