const createRAFScheduler = () => {
  const callbacks = new Map();
  let rafId = 0;
  let lastTime = 0;
  let isRunning = false;
  const tick = (time) => {
    const delta = lastTime ? time - lastTime : 0;
    lastTime = time;
    callbacks.forEach((fn) => fn(time, delta));
    if (callbacks.size > 0) {
      rafId = requestAnimationFrame(tick);
    } else {
      isRunning = false;
    }
  };
  const start = () => {
    if (!isRunning && callbacks.size > 0) {
      isRunning = true;
      rafId = requestAnimationFrame(tick);
    }
  };
  const stop = () => {
    cancelAnimationFrame(rafId);
    isRunning = false;
    lastTime = 0;
  };
  const add = (fn) => {
    const id = Symbol();
    callbacks.set(id, fn);
    start();
    return () => {
      callbacks.delete(id);
      if (callbacks.size === 0) stop();
    };
  };
  const next = (fn) => {
    requestAnimationFrame((time) => fn(time, 0));
  };
  return { add, next, stop };
};
export const raf = createRAFScheduler();
export const lerp = (current, target, ease) =>
  current + (target - current) * ease;
export const mapRange = (value, inMin, inMax, outMin, outMax) =>
  ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
