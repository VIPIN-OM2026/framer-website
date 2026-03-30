import { qs } from "../utils/dom.js";
import { delegate } from "../utils/events.js";
const Footer = (root) => {
  const _yearEl = qs("[data-year]", root);
  const _backToTop = qs("[data-back-to-top]", root);
  let _removeDelegate = null;
  const _onBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const init = () => {
    if (_yearEl) {
      _yearEl.textContent = new Date().getFullYear();
    }
    if (_backToTop) {
      _backToTop.addEventListener("click", _onBackToTop);
    }
    _removeDelegate = delegate(root, "click", "a[data-footer-link]", (e) => {});
  };
  const destroy = () => {
    _backToTop?.removeEventListener("click", _onBackToTop);
    _removeDelegate?.();
  };
  return { init, destroy };
};
export default Footer;
