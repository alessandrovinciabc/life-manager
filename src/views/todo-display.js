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

let addTodoToDisplay = (todo, list = defaultList) => {
  list.insertAdjacentHTML(
    'beforeend',
    createTodoHTML(todo.id, todo.title, todo.priority + 1)
  );
};

let removeTodoFromDisplay = (todoId) => {
  let todoToRemove = defaultList.querySelector(`#todo${todoId}`).parentNode;
  todoToRemove.remove();
};

let initializeTodos = () => {
  defaultList.addEventListener('change', function (e) {
    let idOfTodoThatWasChecked = e.target.id.slice(4);
    let customEvent = new CustomEvent('todochecked', {
      detail: idOfTodoThatWasChecked,
    });
    document.dispatchEvent(customEvent);
  });
};

export {
  createTodoHTML,
  addTodoToDisplay,
  removeTodoFromDisplay,
  initializeTodos,
};
