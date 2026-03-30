export const magnetic = (gsap, el, options = {}) => {
  const {
    strength = 0.4,
    radius = 80,
    duration = 0.6,
    ease = "power3.out",
  } = options;
  const onMove = (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < radius) {
      gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        duration,
        ease,
        force3D: true,
        overwrite: "auto",
      });
    }
  };
  const onLeave = () => {
    gsap.to(el, {
      x: 0,
      y: 0,
      duration,
      ease,
      force3D: true,
      overwrite: "auto",
    });
  };
  const mount = () => {
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
  };
  const unmount = () => {
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
    gsap.killTweensOf(el);
    gsap.set(el, { x: 0, y: 0 });
  };
  return { mount, unmount };
};
