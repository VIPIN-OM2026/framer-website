import { qs } from "../utils/dom.js";
import orchestrator from "../animation/orchestrator.js";
import { isTouchDevice } from "../utils/media.js";
const CTA = (root) => {
  const _button = qs("[data-cta-button]", root);
  const _heading = qs("[data-cta-heading]", root);
  const _subtext = qs("[data-cta-subtext]", root);
  const elements = {
    section: root,
    heading: _heading,
    subtext: _subtext,
    button: _button,
  };
  let _magnetic = null;
  const init = () => {
    if (_button && !isTouchDevice()) {
      _magnetic = orchestrator.createMagnetic(_button, {
        strength: 0.35,
        radius: 90,
        duration: 0.5,
      });
      _magnetic.mount();
    }
  };
  const destroy = () => {
    _magnetic?.unmount();
    _magnetic = null;
  };
  return { init, destroy, elements };
};
export default CTA;
