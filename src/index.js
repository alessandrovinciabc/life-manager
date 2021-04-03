import { createTodo, isValidTodo } from './models/todo/todo.js';

//date.js
import { createDate, isDateValid } from './models/time/date.js';

import { getToday, isToday, getDay } from './models/time/date-util.js';
import { areEqual, getNextOccurrence } from './models/time/date-util.js';

import { createTodoCalendar } from './models/todo/todo-calendar.js';

import { initializePrompts } from './views/prompt.js';
import {
  addTodoToDisplay,
  removeTodoFromDisplay,
  displayAllTodos,
  initializeTodos,
  removeAllTodosFromDisplay,
} from './views/todo-display.js';

import { initializeMenu } from './views/menu.js';

initializePrompts();
initializeTodos();
initializeMenu();

let todoCalendar = createTodoCalendar();
let currentYear = getToday().value.year;
todoCalendar.refresh(currentYear);

let inbox = todoCalendar.project.create('inbox', 'red');

//temporary default todos
inbox.todo.add(createTodo('Eat an apple', 3));
inbox.todo.add(createTodo('Workout', 2));
inbox.todo.add(createTodo('Study', 1));
inbox.todo.add(createTodo('Sleep', 0));

displayAllTodos(inbox.todo.getAll());

document.addEventListener('taskadded', function (e) {
  let title, priority, dueDate, newTodo, native;
  title = e.detail.title;
  priority = e.detail.priority;
  dueDate = e.detail.dueDate;

  if (dueDate) {
    native = new Date(dueDate);
    dueDate = createDate(
      'full',
      native.getDate(),
      native.getMonth() + 1,
      native.getFullYear()
    );
  }

  newTodo = createTodo(title, priority - 1, dueDate);
  addTodoToDisplay(newTodo);

  inbox.todo.add(newTodo);
});

document.addEventListener('todochecked', function (e) {
  let idToDelete = e.detail;
  inbox.todo.remove(idToDelete);
  removeTodoFromDisplay(idToDelete);
});

document.addEventListener('todochanged', function (e) {
  let idOfTodoToChange = e.detail.id;
  let { title: newTitle, dueDate: newDate, priority: newPriority } = e.detail;
  let todoToChange, native;

  todoToChange = inbox.todo.get(idOfTodoToChange);
  todoToChange.title = newTitle;

  if (newDate) {
    native = new Date(newDate);
    newDate = createDate(
      'full',
      native.getDate(),
      native.getMonth() + 1,
      native.getFullYear()
    );
  }

  todoToChange.dueDate = newDate;
  todoToChange.priority = newPriority - 1;

  removeAllTodosFromDisplay();
  displayAllTodos(inbox.todo.getAll());
});
