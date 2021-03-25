import { createTodo, isValidTodo } from './models/todo.js';
import { createDate, isDateValid } from './models/date.js';

let testTodo = createTodo('Eat an apple');
console.log(testTodo);
testTodo.dueDate = createDate('day', 7);

console.log(isValidTodo({ bananabread: 5, title: 666 }));
console.log(isValidTodo(testTodo));

document.body.innerText = `${testTodo.id}\n${testTodo.title}\n${testTodo.priority}\n${testTodo.dueDate.value}\n${testTodo.checked}`;
