import { createTodo, isValidTodo } from './models/todo.js';
import { createProject } from './models/project.js';
import { createDate, isDateValid } from './models/date.js';

let testTodo = createTodo('Eat an apple');
testTodo.dueDate = createDate('day', 7);

let newDate = createDate('full', 7, 5, 1999);
console.log('newDate valid? ', isDateValid(newDate));

document.body.innerText = `${testTodo.id}\n${testTodo.title}\n${testTodo.priority}\n${testTodo.dueDate.value}\n${testTodo.checked}`;
