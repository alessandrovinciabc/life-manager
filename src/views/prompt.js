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
  task: createPrompt(DOM.prompt.task.dom),
  project: createPrompt(DOM.prompt.project.dom),
};

let createEventListeners = () => {
  DOM.header.add.addEventListener('click', function (e) {
    mask.toggle();
    prompts.task.toggle();
    this.classList.toggle('inactive');
  });
  DOM.prompt.task.btn.close.addEventListener('click', function (e) {
    mask.toggle();
    prompts.task.toggle();
    DOM.header.add.classList.toggle('inactive');
  });
  DOM.prompt.task.btn.confirm.addEventListener('click', function () {});
};

export { createEventListeners };
