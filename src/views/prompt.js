import DOM from './dom.js';
import mask from './mask.js';

let promptToAddNewTodo = DOM.prompt.task.dom;
let promptToAddNewProject = DOM.prompt.project.dom;

let togglePromptVisibility = (prompt) => {
  prompt.classList.toggle('inactive');
};

let isPromptActive = (prompt) => {
  let hasInactiveClass = prompt.classList.contains('inactive');
  if (hasInactiveClass) {
    return false;
  } else {
    return true;
  }
};

let turnOnButton = (button) => {
  button.classList.remove('inactive');
};

let turnOffButton = (button) => {
  button.classList.add('inactive');
};

let isButtonDisabled = (button) => {
  return button.classList.contains('inactive');
};

let openPrompt = (prompt) => {
  let promptIsNotActive = !isPromptActive(prompt);
  if (promptIsNotActive) {
    mask.toggle();
    togglePromptVisibility(prompt);
  }
};

let closePrompt = (prompt) => {
  let promptIsActive = isPromptActive(prompt);
  if (promptIsActive) {
    mask.toggle();
    togglePromptVisibility(prompt);
  }
};

let getInputValue = (inputDOM) => {
  return inputDOM.value;
};

let resetInputValue = (inputDOM) => {
  inputDOM.value = '';
};

let isInputValid = (inputDOM) => {
  let result = inputDOM.value.length > 0;
  return result;
};

let btnForOpeningPromptToAddNewTodo = DOM.header.add;
let btnForClosingPromptToAddNewTodo = DOM.prompt.task.btn.close;
let btnForConfirmingPromptToAddNewTodo = DOM.prompt.task.btn.confirm;
let textInputOfPromptToAddNewTodo = DOM.prompt.task.input;

let initializePrompts = () => {
  btnForOpeningPromptToAddNewTodo.addEventListener('click', function (e) {
    openPrompt(promptToAddNewTodo);
    turnOffButton(this);
  });
  btnForClosingPromptToAddNewTodo.addEventListener('click', function (e) {
    closePrompt(promptToAddNewTodo);
    resetInputValue(textInputOfPromptToAddNewTodo);
    turnOnButton(btnForOpeningPromptToAddNewTodo);
  });
  btnForConfirmingPromptToAddNewTodo.addEventListener('click', function (e) {
    let buttonIsNotDisabled = !isButtonDisabled(this);
    if (buttonIsNotDisabled) {
      let textForNewTodo = getInputValue(textInputOfPromptToAddNewTodo);
      console.log(textForNewTodo);
    }
  });
  textInputOfPromptToAddNewTodo.addEventListener('input', function (e) {
    let inputIsValid = isInputValid(textInputOfPromptToAddNewTodo);
    if (inputIsValid) {
      turnOnButton(btnForConfirmingPromptToAddNewTodo);
    } else {
      turnOffButton(btnForConfirmingPromptToAddNewTodo);
    }
  });
};

export { initializePrompts };
