import DOM from './dom.js';
import mask from './mask.js';

import { createTodoHTML, addTodoToDisplay } from './todo-display.js';

let turnOnButton = (button) => {
  button.classList.remove('inactive');
};

let turnOffButton = (button) => {
  button.classList.add('inactive');
};

let isButtonDisabled = (button) => {
  return button.classList.contains('inactive');
};

let createPrompt = (promptDOM) => {
  let whole, btnForOpening, btnForClosing, btnForConfirming, textInput;

  whole = promptDOM;

  let _togglePromptVisibility = function () {
    whole.classList.toggle('inactive');
  };

  let isPromptActive = function () {
    let hasInactiveClass = this.whole.classList.contains('inactive');
    if (hasInactiveClass) {
      return false;
    } else {
      return true;
    }
  };

  let open = function () {
    let promptIsNotActive = !this.isPromptActive();
    if (promptIsNotActive) {
      mask.toggle();
      _togglePromptVisibility();
    }
  };

  let close = function () {
    let promptIsActive = this.isPromptActive();
    if (promptIsActive) {
      mask.toggle();
      _togglePromptVisibility();
    }
  };

  let getInputValue = function () {
    return this.textInput.value;
  };

  let resetInputValue = function () {
    this.textInput.value = '';
  };

  let isInputValid = function () {
    return this.textInput.value.length > 0;
  };

  return {
    //fields
    whole,
    btnForOpening,
    btnForClosing,
    btnForConfirming,
    textInput,
    //methods
    isPromptActive,
    open,
    close,
    isInputValid,
    getInputValue,
    resetInputValue,
  };
};

let promptToAddNewTodo = createPrompt(DOM.prompt.task.dom);
promptToAddNewTodo.btnForOpening = DOM.header.add;
promptToAddNewTodo.btnForClosing = DOM.prompt.task.btn.close;
promptToAddNewTodo.btnForConfirming = DOM.prompt.task.btn.confirm;
promptToAddNewTodo.textInput = DOM.prompt.task.input;

//Additional stuff
promptToAddNewTodo.dateInput = DOM.prompt.task.dateInput;

promptToAddNewTodo.priorityBtn = DOM.prompt.task.btn.priority;
promptToAddNewTodo.priorityInput = DOM.prompt.task.priorityInput;

let promptToAddNewProject = createPrompt(DOM.prompt.project.dom);

let getPriorityLevel = () => {
  let checkedCheckbox = promptToAddNewTodo.priorityInput.querySelector(
    'input[type="radio"]:checked'
  );

  if (checkedCheckbox) {
    return +checkedCheckbox.getAttribute('id').slice(1);
  } else {
    return 1;
  }
};

let initializePrompts = () => {
  promptToAddNewTodo.btnForOpening.addEventListener('click', function (e) {
    promptToAddNewTodo.open();
    turnOffButton(this);
  });
  promptToAddNewTodo.btnForClosing.addEventListener('click', function (e) {
    promptToAddNewTodo.close();
    promptToAddNewTodo.resetInputValue();
    turnOnButton(promptToAddNewTodo.btnForOpening);
    turnOffButton(promptToAddNewTodo.btnForConfirming);
  });
  promptToAddNewTodo.btnForConfirming.addEventListener('click', function (e) {
    let buttonIsNotDisabled = !isButtonDisabled(this);
    if (buttonIsNotDisabled) {
      let textForNewTodo, priorityLevel, date, newTodoHTML, customEvent;

      textForNewTodo = promptToAddNewTodo.getInputValue();
      priorityLevel = getPriorityLevel();
      date = promptToAddNewTodo.dateInput.value || 0;

      customEvent = new CustomEvent('taskadded', {
        detail: {
          title: textForNewTodo,
          priority: priorityLevel,
          dueDate: date,
        },
      });

      document.dispatchEvent(customEvent);

      promptToAddNewTodo.close();
      promptToAddNewTodo.resetInputValue();
      turnOnButton(promptToAddNewTodo.btnForOpening);
      turnOffButton(promptToAddNewTodo.btnForConfirming);
    }
  });
  promptToAddNewTodo.textInput.addEventListener('input', function (e) {
    let inputIsValid = promptToAddNewTodo.isInputValid();
    if (inputIsValid) {
      turnOnButton(promptToAddNewTodo.btnForConfirming);
    } else {
      turnOffButton(promptToAddNewTodo.btnForConfirming);
    }
  });
};

export { initializePrompts };
