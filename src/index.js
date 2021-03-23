import { createTodo } from './models/todo.js';

let testTodo = createTodo('Eat an apple');

document.body.innerText = `${testTodo.id}\n${testTodo.title}`;
