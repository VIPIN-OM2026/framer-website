import store from "../store.js";
import { qs } from "../utils/dom.js";
import { addListeners, throttle } from "../utils/events.js";

const Nav = (root) => {
  let _cleanupListeners = null;
  const _menuToggle = qs("[data-menu-toggle]", document);
  const _menuOverlay = qs("[data-menu-overlay]", document);
  const _desktopNav = qs("#desktop-nav", document);
  const _navHeader = qs("#nav-header", document);
  const _menuItems = document.querySelectorAll("[data-menu-item]");
  
  const _onScroll = throttle(() => {
    const scrolled = window.scrollY > 40;
    if (_navHeader) {
      // Use solid white background instead of reflection/blur
      _navHeader.classList.toggle("bg-[#f5f5f5]", scrolled);
    }
    store.set("isNavScrolled", scrolled);
    store.set("scrollY", window.scrollY);
  }, 100);

  const _setMenuOpen = (open) => {
    if (!_menuOverlay) return;
    document.body.style.overflow = open ? "hidden" : "";
    if (_menuToggle) _menuToggle.setAttribute("aria-expanded", String(open));
    
    // Hide standard desktop nav links smoothly when menu opens
    if (_desktopNav) {
        _desktopNav.style.transition = "opacity 0.3s ease";
        _desktopNav.style.opacity = open ? "0" : "1";
        _desktopNav.style.pointerEvents = open ? "none" : "auto";
    }

    if (open) {
      _menuOverlay.style.opacity = "1";
      _menuOverlay.style.pointerEvents = "auto";
      _menuOverlay.classList.remove("translate-y-4");
      _menuOverlay.classList.add("translate-y-0");
      
      _menuItems.forEach((el) => {
        el.classList.remove("opacity-0", "translate-y-4", "translate-y-2");
        el.classList.add("opacity-100", "translate-y-0");
      });
    } else {
      _menuOverlay.style.opacity = "0";
      _menuOverlay.style.pointerEvents = "none";
      _menuOverlay.classList.remove("translate-y-0");
      _menuOverlay.classList.add("translate-y-4");
      
      _menuItems.forEach((el) => {
        el.classList.remove("opacity-100", "translate-y-0");
        el.classList.add("opacity-0", "translate-y-4");
      });
    }
  };

  const _onMenuToggle = () => {
    const isOpen = _menuToggle.getAttribute("aria-expanded") === "true";
    _setMenuOpen(!isOpen);
  };
  
  const _onMenuClose = () => _setMenuOpen(false);
  const _onKeydown = (e) => { if (e.key === "Escape") _setMenuOpen(false); };

  const init = () => {
    _onScroll();
    const listeners = [
      [window, "scroll", _onScroll, { passive: true }],
      [document, "keydown", _onKeydown],
    ];
    if (_menuToggle) listeners.push([_menuToggle, "click", _onMenuToggle]);
    
    // Close menu when any link inside it is clicked
    _menuItems.forEach(item => {
      if(item.tagName === 'A') {
        listeners.push([item, "click", _onMenuClose]);
      }
    });

    _cleanupListeners = addListeners(listeners);
  };

  const destroy = () => {
    _cleanupListeners?.();
    _setMenuOpen(false);
  };

  return { init, destroy };
};

export default Nav;
