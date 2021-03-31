import DOM from './dom.js';
import mask from './mask.js';

let createPrompt = (element) => {
  return {
    get() {
      return element;
    },
    toggle() {
      element.classList.toggle('inactive');
    },
    isActive() {
      let hasInactiveClass = element.classList.includes('inactive');
      if (hasInactiveClass) {
        return false;
      } else {
        return true;
      }
    },
  };
};

let prompts = {
  taskAdd: createPrompt(DOM.prompt.taskAdder),
  projectAdd: createPrompt(DOM.prompt.projectAdder),
};

let createEventListeners = () => {
  DOM.header.add.addEventListener('click', function (e) {
    mask.toggle();
    prompts.taskAdd.toggle();
    this.classList.toggle('inactive');
  });
};

export { createEventListeners };
