import { addTodoToDisplay } from '../../views/todo-display.js';
import { generateId } from '../id.js';

let createProject = (newTitle) => {
  let id, title, todos;
  const TITLE_LIMIT = 100;

  let _validateTitle = (newTitle) => {
    if (typeof newTitle === 'string' && newTitle.length <= TITLE_LIMIT) {
      return true;
    } else {
      return false;
    }
  };

  id = generateId();
  title = _validateTitle(newTitle) ? newTitle : ' ';
  todos = [];

  return {
    id,
    title,
    todos,
  };
};

let findId = (id, where) => {
  return where.findIndex((el) => {
    return el.id === id;
  });
};

let removeTodoFromProject = (id, where) => {
  let indexOfTodoToDelete = findId(id, where);
  if (indexOfTodoToDelete !== -1) {
    where.splice(indexOfTodoToDelete, 1);
  }
};

export { createProject, removeTodoFromProject, findId };
