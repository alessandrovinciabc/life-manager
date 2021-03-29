import { createTodo, isValidTodo } from './models/todo/todo.js';
import { createProject } from './models/todo/project.js';

//date.js
import { createDate, isDateValid } from './models/time/date.js';

import { getToday, isToday, getDay } from './models/time/date-util.js';
import { areEqual, getNextOccurrence } from './models/time/date-util.js';

import { createTodoCalendar } from './models/todo/todo-calendar.js';

let testTodo = createTodo('Eat an apple');
testTodo.dueDate = createDate('day', 7);
console.log(getNextOccurrence(testTodo.dueDate));

let todos = [];
todos.push(
    createTodo('Do something important', 0, createDate('daymonth', 20, 'may'))
);
todos.push(createTodo('Buy new shoes', 0, createDate('daymonth', 30, 'jun')));
todos.push(createTodo('Do a flip', 0, createDate('full', 31, 'march', 2021)));

let calendar = createTodoCalendar();
let proj = calendar.project.create('Inbox', 'red');
let proj2 = calendar.project.create('Lifestyle', 'green');

let label = proj.label.add('Health');
let label2 = proj2.label.add('Shopping');

proj.todo.add(testTodo, label);
proj.todo.add(todos[0]);

proj2.todo.add(todos[1]);
proj2.todo.add(todos[2], label2);
calendar.refresh(getToday().value.year);
console.log(calendar.get());

document.body.innerText = `${testTodo.id}\n${testTodo.title}\n${testTodo.priority}\n${testTodo.dueDate.value}\n${testTodo.checked}`;
