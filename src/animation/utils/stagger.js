export const stagger = (gsap, parent, childSelector, options = {}) => {
  const {
    y = 40,
    duration = 0.8,
    stagger: staggerAmount = 0.08,
    delay = 0,
    ease = "power3.out",
    from = "start",
  } = options;
  const children = gsap.utils.toArray(parent.querySelectorAll(childSelector));
  if (!children.length) return gsap.timeline();
  const tl = gsap.timeline();
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
        children.forEach((el) => el.classList?.add("will-animate"));
      },
      onComplete() {
        children.forEach((el) => {
          el.classList?.remove("will-animate");
          el.style.willChange = "";
        });
      },
    },
  );
  return tl;
};
