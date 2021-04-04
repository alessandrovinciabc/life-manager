import { generateId } from '../id.js';
import { isValid } from 'date-fns';

let createTodo = (newTitle, newPriority = 0, newDueDate = 0) => {
  let id, title, priority, dueDate;
  const TITLE_LIMIT = 100;

  let _validateTitle = (newTitle) => {
    if (typeof newTitle === 'string' && newTitle.length <= TITLE_LIMIT) {
      return true;
    } else {
      return false;
    }
  };

  let _validateDueDate = (newDate) => {
    if (isValid(newDate) || newDate === 0) {
      return true;
    } else {
      return false;
    }
  };

  let _validatePriority = (newPriority) => {
    let isANumber, isInCorrectRange, maxForRange, minForRange;

    minForRange = 0;
    maxForRange = 3;

    isANumber = typeof newPriority === 'number';
    isInCorrectRange = newPriority >= minForRange && newPriority <= maxForRange;

    if (isANumber && isInCorrectRange) {
      return true;
    } else {
      return false;
    }
  };

  id = generateId();
  title = _validateTitle(newTitle) ? newTitle : ' ';
  dueDate = _validateDueDate(newDueDate) ? newDueDate : 0;
  priority = _validatePriority(newPriority) ? newPriority : 0;

  return {
    id,
    title,
    dueDate,
    priority,
  };
};

export { createTodo };
