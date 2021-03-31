import DOM from './dom.js';

let _hideTooltips = () => {
  let tooltipElements = document.querySelectorAll('.tooltip-text');

  tooltipElements.forEach((el) => {
    el.classList.toggle('inactive');
  });
};

let mask = {
  toggle() {
    DOM.mask.classList.toggle('inactive');

    _hideTooltips();
  },
  isActive() {
    let hasInactiveClass = DOM.mask.classList.includes('inactive');
    if (hasInactiveClass) {
      return false;
    } else {
      return true;
    }
  },
};

export default mask;
