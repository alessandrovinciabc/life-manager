import { createTodo } from './models/todo.js';
import { createDate, isDateValid } from './models/date.js';

let testTodo = createTodo('Eat an apple');
testTodo.dueDate = createDate('day', 3);
console.log(testTodo.dueDate);

let testTodo2 = createTodo(
    'Eat an apple. And then another one. And then another one. And then another. And then maybe... another one? Really cool! Amazing! Stunning! Beautiful!'
);
testTodo2.dueDate = createDate('day', 7);
console.log(testTodo2.dueDate);

document.body.innerText = `${testTodo.id}\n${testTodo.title}`;

let testFull = createDate('full', 20, 5, 1999);
console.log(testFull);
console.log(isDateValid(testFull));

let testDate = createDate('daymonth', 25, 'may');
console.log(testDate);
console.log(isDateValid(testDate));
let testDate2 = createDate('daymonth', 29, 'feb');
console.log(testDate2);
console.log(isDateValid(testDate2));
let testDate3 = { type: 'daymonth', value: { day: 30, month: 'February' } };
console.log(testDate3);
console.log(isDateValid(testDate3));

let testDay = createDate('day', 'mon');
console.log(testDay);
console.log(isDateValid(testDay));
let testDay2 = createDate('day', 7);
console.log(testDay2);
console.log(isDateValid(testDay2));

let testMonth = createDate('month', 12);
console.log(testMonth);
console.log(isDateValid(testMonth));
let testMonth2 = createDate('month', 'december');
console.log(testMonth2);
console.log(isDateValid(testMonth2));
