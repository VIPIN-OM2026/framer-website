export const delegate = (root, event, selector, handler) => {
  const listener = (e) => {
    const target = e.target?.closest(selector);
    if (target && root.contains(target)) {
      handler(e, target);
    }
  };
  root.addEventListener(event, listener);
  return () => root.removeEventListener(event, listener);
};
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
export const throttle = (fn, limit) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
};
export const addListeners = (listeners) => {
  listeners.forEach(([target, event, handler, opts]) =>
    target.addEventListener(event, handler, opts),
  );
  return () => {
    listeners.forEach(([target, event, handler, opts]) =>
      target.removeEventListener(event, handler, opts),
    );
  };
};
export const once = (target, event, handler) => {
  target.addEventListener(event, handler, { once: true });
};
export const getPointer = (e) => {
  if ("touches" in e && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  return {
    x: e.clientX,
    y: e.clientY,
  };
};
