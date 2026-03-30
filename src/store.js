const createStore = () => {
  const state = {
    theme: "light",
    scrollY: 0,
    scrollDir: "down",
    isNavScrolled: false,
    reducedMotion: false,
    activeSection: null,
  };
  const subscribers = new Map();
  const get = (key) => state[key];
  const set = (key, value) => {
    if (state[key] === value) return;
    state[key] = value;
    const fns = subscribers.get(key);
    if (fns) {
      fns.forEach((fn) => fn(value, key));
    }
  };
  const subscribe = (key, fn) => {
    if (!subscribers.has(key)) {
      subscribers.set(key, new Set());
    }
    subscribers.get(key).add(fn);
    return () => {
      subscribers.get(key)?.delete(fn);
    };
  };
  const snapshot = () => Object.freeze({ ...state });
  return { get, set, subscribe, snapshot };
};
const store = createStore();
export default store;
