import DOM from './dom.js';

let display = DOM.todosDisplay;
let defaultList = display.querySelector('.todos');

const todoTemplateInHTML =
  '<li><input class="todo-checkbox" type="checkbox" name="todo%todoId%" id="todo%todoId%" autocomplete="off"/><label for="todo%todoId%"><div class="circle-check p%todoPriority%"></div></label>%todoText%</li>';

let createTodoHTML = (id, text, priority = 1) => {
  let template, newTodo;

  template = todoTemplateInHTML.slice();

  newTodo = template.replace(/%todoId%/g, id);
  newTodo = newTodo.replace(/%todoText%/g, text);
  newTodo = newTodo.replace(/%todoPriority%/g, priority);

  return newTodo;
};

let addTodoToDisplay = (todoInHTML, list = defaultList) => {
  list.insertAdjacentHTML('beforeend', todoInHTML);
};

export { createTodoHTML, addTodoToDisplay };
