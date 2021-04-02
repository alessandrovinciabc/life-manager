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
  initializeTodos,
} from './views/todo-display.js';

initializePrompts();
initializeTodos();

let todoCalendar = createTodoCalendar();
let currentYear = getToday().value.year;
todoCalendar.refresh(currentYear);

let inbox = todoCalendar.project.create('inbox', 'red');

//temporary default todos

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
      native.getMonth(),
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
