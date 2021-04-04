import { createTodo } from './models/todo/todo.js';
import {
  createProject,
  findId,
  removeTodoFromProject,
} from './models/todo/project.js';

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

import { isToday } from 'date-fns';

import storage from './models/storage.js';

let collectionOfProjects = [],
  currentProjectIndex = 0;

if (storage.hasData()) {
  collectionOfProjects = storage.getCollection();
} else {
  collectionOfProjects.push(createProject('Inbox'));
}

let getAllTodos = () => {
  let resultingArray = [];

  collectionOfProjects.forEach((project) => {
    project.todos.forEach((todo) => {
      resultingArray.push(todo);
    });
  });

  return resultingArray;
};

let getTodosForToday = () => {
  let allTodos = getAllTodos();

  return allTodos.filter((todo) => {
    return todo.dueDate !== 0 && isToday(new Date(todo.dueDate));
  });
};

let getProjectsToDisplay = () => {
  return collectionOfProjects.slice(1); //All except inbox
};

let init = () => {
  initializePrompts();
  initializeTodos();
  initializeMenu();
  initializeProjects();

  displayAllTodos(collectionOfProjects[currentProjectIndex].todos);
  displayAllProjects(getProjectsToDisplay());
};

//Handle FrontEnd Events
document.addEventListener('taskadded', function (e) {
  let title, priority, dueDate, newTodo;
  title = e.detail.title;
  priority = e.detail.priority;
  dueDate = e.detail.dueDate;

  if (dueDate) {
    dueDate = new Date(dueDate);
  }

  newTodo = createTodo(title, priority - 1, dueDate);
  addTodoToDisplay(newTodo);

  collectionOfProjects[currentProjectIndex].todos.push(newTodo);
  storage.saveCollection(collectionOfProjects);
});

document.addEventListener('todochecked', function (e) {
  let idToDelete = e.detail;

  removeTodoFromProject(
    idToDelete,
    collectionOfProjects[currentProjectIndex].todos
  );

  removeTodoFromDisplay(idToDelete);

  storage.saveCollection(collectionOfProjects);
});

document.addEventListener('todochanged', function (e) {
  let idOfTodoToChange = e.detail.id;
  let { title: newTitle, dueDate: newDate, priority: newPriority } = e.detail;
  let todoToChange;

  todoToChange = findId(
    idOfTodoToChange,
    collectionOfProjects[currentProjectIndex].todos
  );
  collectionOfProjects[currentProjectIndex].todos[
    todoToChange
  ].title = newTitle;

  if (newDate) {
    newDate = new Date(newDate);
  }

  collectionOfProjects[currentProjectIndex].todos[
    todoToChange
  ].dueDate = newDate;
  collectionOfProjects[currentProjectIndex].todos[todoToChange].priority =
    newPriority - 1;

  removeAllTodosFromDisplay();
  displayAllTodos(collectionOfProjects[currentProjectIndex].todos);
  storage.saveCollection(collectionOfProjects);
});

document.addEventListener('projectadded', function (e) {
  let newProjectTitle;

  newProjectTitle = e.detail;
  collectionOfProjects.push(createProject(newProjectTitle));
  resetProjectDisplay();
  displayAllProjects(getProjectsToDisplay());
  storage.saveCollection(collectionOfProjects);
});

document.addEventListener('projectdeleted', function (e) {
  let idOfProjectToDelete;
  idOfProjectToDelete = e.detail;

  let indexToDelete = findId(idOfProjectToDelete, collectionOfProjects);
  if (indexToDelete !== -1) {
    collectionOfProjects.splice(indexToDelete, 1);
  }

  resetProjectDisplay();
  displayAllProjects(getProjectsToDisplay());
  storage.saveCollection(collectionOfProjects);
});

document.addEventListener('projectchanged', function (e) {
  let id, newTitle;

  id = e.detail.id;
  newTitle = e.detail.newTitle;

  if (newTitle.length > 0) {
    let indexToChange = findId(id, collectionOfProjects);
    if (indexToChange !== -1) {
      collectionOfProjects[indexToChange].title = newTitle;
    }
  }

  resetProjectDisplay();
  displayAllProjects(getProjectsToDisplay());
  storage.saveCollection(collectionOfProjects);
});

document.addEventListener('projectswitch', function (e) {
  let id, projectObject, title;
  id = e.detail;

  if (id === 0) {
    //inbox
    id = collectionOfProjects[0].id;
  }

  let newIndex = findId(id, collectionOfProjects);

  projectObject = collectionOfProjects[newIndex];

  title = projectObject.title;

  changeFolderName(title);
  currentProjectIndex = newIndex;

  removeAllTodosFromDisplay();
  displayAllTodos(collectionOfProjects[currentProjectIndex].todos);
});

document.addEventListener('todayrequested', function (e) {
  let today = new Date();

  changeFolderName('Today');
  removeAllTodosFromDisplay();
  displayAllTodos(getTodosForToday());
});

init();
