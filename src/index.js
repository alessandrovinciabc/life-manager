import { createTodo } from './models/todo.js';
import {
    createDate,
    isDayValid,
    isMonthValid,
    isDayMonthValid,
    isFullDateValid,
} from './models/date.js';

let testTodo = createTodo('Eat an apple');

document.body.innerText = `${testTodo.id}\n${testTodo.title}`;

let testFull = createDate('full', 20, 5, 1999);
console.log(testFull);
console.log(isFullDateValid(testFull));

let testDate = createDate('daymonth', 25, 'may');
console.log(testDate);
console.log(isDayMonthValid(testDate));
let testDate2 = createDate('daymonth', 29, 'feb');
console.log(testDate2);
console.log(isDayMonthValid(testDate2));
let testDate3 = { type: 'daymonth', value: { day: 30, month: 'February' } };
console.log(testDate3);
console.log(isDayMonthValid(testDate3));

let testDay = createDate('day', 'mon');
console.log(testDay);
console.log(isDayValid(testDay));
let testDay2 = createDate('day', 7);
console.log(testDay2);
console.log(isDayValid(testDay2));

let testMonth = createDate('month', 12);
console.log(testMonth);
console.log(isMonthValid(testMonth));
let testMonth2 = createDate('month', 'december');
console.log(testMonth2);
console.log(isMonthValid(testMonth2));
