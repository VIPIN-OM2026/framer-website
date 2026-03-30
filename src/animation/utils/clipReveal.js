export const clipReveal = (gsap, targets, options = {}) => {
  const {
    direction = "bottom",
    duration = 1.2,
    delay = 0,
    ease = "power4.out",
    stagger = 0,
  } = options;
  const CLIP_FROM = {
    top: "inset(0 0 100% 0)",
    bottom: "inset(100% 0 0 0)",
    left: "inset(0 100% 0 0)",
    right: "inset(0 0 0 100%)",
  };
  const tl = gsap.timeline();
  tl.fromTo(
    targets,
    {
      clipPath: CLIP_FROM[direction],
      force3D: true,
    },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration,
      delay,
      ease,
      stagger,
      force3D: true,
      onStart() {
        const els = gsap.utils.toArray(targets);
        els.forEach((el) => {
          el.classList?.add("will-animate");
          el.style.willChange = "clip-path";
        });
      },
      onComplete() {
        const els = gsap.utils.toArray(targets);
        els.forEach((el) => {
          el.classList?.remove("will-animate");
          el.style.willChange = "";
          el.style.clipPath = "";
        });
      },
    },
  );
  return tl;
};
