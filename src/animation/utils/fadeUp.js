export const fadeUp = (gsap, targets, options = {}) => {
  const {
    y = 60,
    duration = 0.9,
    delay = 0,
    ease = "power3.out",
    stagger = 0,
  } = options;
  const tl = gsap.timeline();
  tl.fromTo(
    targets,
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
      stagger,
      force3D: true,
      onStart() {
        const els = gsap.utils.toArray(targets);
        els.forEach((el) => el.classList?.add("will-animate"));
      },
      onComplete() {
        const els = gsap.utils.toArray(targets);
        els.forEach((el) => {
          el.classList?.remove("will-animate");
          el.style.willChange = "";
        });
      },
    },
  );
  return tl;
};
