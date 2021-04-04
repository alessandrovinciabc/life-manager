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

initializePrompts();
initializeTodos();
initializeMenu();
initializeProjects();

let collectionOfProjects = [];

collectionOfProjects.push(createProject('Inbox'));
collectionOfProjects.push(createProject('Demo'));

let currentProjectIndex = 0;

let inbox = collectionOfProjects[0];
let demo = collectionOfProjects[1];

//temporary default todos
inbox.todos.push(createTodo('Eat an apple', 3));
inbox.todos.push(createTodo('Workout', 2));
inbox.todos.push(createTodo('Study', 1));
inbox.todos.push(createTodo('Sleep', 0));

demo.todos.push(createTodo('Do something for the demo', 3));

let getAllTodos = () => {
  let resultingArray = [];

  collectionOfProjects.forEach((project) => {
    project.todos.forEach((todo) => {
      resultingArray.push(todo);
    });
  });

  return resultingArray;
};

let getProjectsToDisplay = () => {
  return collectionOfProjects.slice(1); //All except inbox
};

displayAllTodos(collectionOfProjects[currentProjectIndex].todos);
displayAllProjects(getProjectsToDisplay());

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
});

document.addEventListener('todochecked', function (e) {
  let idToDelete = e.detail;

  removeTodoFromProject(
    idToDelete,
    collectionOfProjects[currentProjectIndex].todos
  );
  removeTodoFromDisplay(idToDelete);
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
});

document.addEventListener('projectadded', function (e) {
  let newProjectTitle;

  newProjectTitle = e.detail;
  collectionOfProjects.push(createProject(newProjectTitle));
  resetProjectDisplay();
  displayAllProjects(getProjectsToDisplay());
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
});

document.addEventListener('projectswitch', function (e) {
  let id, projectObject, title;
  id = e.detail;

  if (id === 0) {
    //inbox
    id = inbox.id;
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
  displayAllTodos(getAllTodos());
});
