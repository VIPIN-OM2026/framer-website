import store from "./store.js";
const STORAGE_KEY = "theme";
const ATTR_NAME = "data-theme";
const VALID_THEMES = ["light", "dark"];
const ThemeManager = (() => {
  let _current = "light";
  const _detectSystem = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  const _apply = (theme) => {
    document.documentElement.setAttribute(ATTR_NAME, theme);
    _current = theme;
    store.set("theme", theme);
  };
  const init = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const theme = VALID_THEMES.includes(stored) ? stored : _detectSystem();
    _apply(theme);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          _apply(e.matches ? "dark" : "light");
        }
      });
  };
  const set = (theme) => {
    if (!VALID_THEMES.includes(theme)) return;
    localStorage.setItem(STORAGE_KEY, theme);
    _apply(theme);
  };
  const toggle = () => {
    set(_current === "light" ? "dark" : "light");
  };
  const current = () => _current;
  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    _apply(_detectSystem());
  };
  return { init, set, toggle, current, reset };
})();
export default ThemeManager;
