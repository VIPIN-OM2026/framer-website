import { qs } from "../utils/dom.js";
import { addListeners } from "../utils/events.js";
import { raf } from "../utils/raf.js";
import { prefersReducedMotion } from "../utils/media.js";
const Marquee = (root, options = {}) => {
  const { speed = 0.5, direction = 1 } = options;
  const _track = qs("[data-marquee-track]", root);
  let _clone = null;
  let _x = 0;
  let _paused = false;
  let _removeRaf = null;
  let _removeListeners = null;
  const _tick = () => {
    if (_paused || !_track) return;
    _x -= speed * direction;
    const trackWidth = _track.scrollWidth / 2;
    if (Math.abs(_x) >= trackWidth) {
      _x = 0;
    }
    _track.style.transform = `translate3d(${_x.toFixed(2)}px, 0, 0)`;
  };
  const pause = () => {
    _paused = true;
  };
  const resume = () => {
    _paused = false;
  };
  const init = () => {
    if (!_track) return;
    _clone = _track.cloneNode(true);
    _clone.setAttribute("aria-hidden", "true");
    root.querySelector("[data-marquee-inner]")?.appendChild(_clone) ||
      _track.parentElement?.appendChild(_clone);
    const inner = _track.parentElement;
    if (inner) {
      inner.style.display = "flex";
      inner.style.flexWrap = "nowrap";
    }
    if (prefersReducedMotion()) {
      return;
    }
    _removeListeners = addListeners([
      [root, "mouseenter", pause],
      [root, "mouseleave", resume],
      [root, "focusin", pause],
      [root, "focusout", resume],
    ]);
    _removeRaf = raf.add(_tick);
  };
  const destroy = () => {
    _removeRaf?.();
    _removeListeners?.();
    _clone?.remove();
    _clone = null;
    if (_track) {
      _track.style.transform = "";
    }
  };
  return { init, pause, resume, destroy };
};
export default Marquee;
