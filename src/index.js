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
  changeFolderName,
  removeAllTodosFromDisplay,
} from './views/todo-display.js';

import { initializeMenu } from './views/menu.js';

import {
  initializeProjects,
  displayAllProjects,
  resetProjectDisplay,
} from './views/project-display.js';

initializePrompts();
initializeTodos();
initializeMenu();
initializeProjects();

let todoCalendar = createTodoCalendar();
let currentYear = getToday().value.year;
todoCalendar.refresh(currentYear);

let inbox = todoCalendar.project.create('Inbox', 'red');
let demoProject = todoCalendar.project.create('demo', 'red');

let currentList = inbox;

//temporary default todos
inbox.todo.add(createTodo('Eat an apple', 3));
inbox.todo.add(createTodo('Workout', 2));
inbox.todo.add(createTodo('Study', 1));
inbox.todo.add(createTodo('Sleep', 0));

demoProject.todo.add(createTodo('Do something for the demo', 3));

let getProjectsToDisplay = () => {
  return todoCalendar.project.getAll().slice(1); //All except inbox
};

displayAllTodos(currentList.todo.getAll());
displayAllProjects(getProjectsToDisplay());

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

  currentList.todo.add(newTodo);
});

document.addEventListener('todochecked', function (e) {
  let idToDelete = e.detail;
  currentList.todo.remove(idToDelete);
  removeTodoFromDisplay(idToDelete);
});

document.addEventListener('todochanged', function (e) {
  let idOfTodoToChange = e.detail.id;
  let { title: newTitle, dueDate: newDate, priority: newPriority } = e.detail;
  let todoToChange, native;

  todoToChange = currentList.todo.get(idOfTodoToChange);
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
  displayAllTodos(currentList.todo.getAll());
});

document.addEventListener('projectadded', function (e) {
  let newProjectTitle;

  newProjectTitle = e.detail;
  todoCalendar.project.create(newProjectTitle, 'red');
  resetProjectDisplay();
  displayAllProjects(getProjectsToDisplay());
});

document.addEventListener('projectdeleted', function (e) {
  let idOfProjectToDelete;
  idOfProjectToDelete = e.detail;

  todoCalendar.project.remove(idOfProjectToDelete);
  resetProjectDisplay();
  displayAllProjects(getProjectsToDisplay());
});

document.addEventListener('projectchanged', function (e) {
  let id, newTitle;

  id = e.detail.id;
  newTitle = e.detail.newTitle;

  if (newTitle.length > 0) {
    todoCalendar.project.get(id).title = newTitle;
  }

  resetProjectDisplay();
  displayAllProjects(getProjectsToDisplay());
});

document.addEventListener('projectswitch', function (e) {
  let id, projectObject, title;
  id = e.detail;

  if (id === 0) {
    //inbox
    id = inbox.id;
  }

  projectObject = todoCalendar.project.get(id);
  title = projectObject.title;

  changeFolderName(title);
  currentList = projectObject;

  removeAllTodosFromDisplay();
  displayAllTodos(currentList.todo.getAll());
});

document.addEventListener('todayrequested', function (e) {
  let today = getToday();
  let day, month, year;

  day = today.value.day;
  month = today.value.month;
  year = today.value.year;

  changeFolderName('Today');
  removeAllTodosFromDisplay();
});
