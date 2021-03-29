import { createTodo, isValidTodo } from './models/todo/todo.js';
import { createProject } from './models/todo/project.js';

//date.js
import { createDate, isDateValid } from './models/time/date.js';

import { getToday, isToday, getDay } from './models/time/date-util.js';
import { areEqual, getNextOccurrence } from './models/time/date-util.js';

import { createCalendar } from './models/time/calendar.js';

let testTodo = createTodo('Eat an apple');
testTodo.dueDate = createDate('day', 7);

let newDate = createDate('full', 7, 5, 1999);
console.log('newDate valid? ', isDateValid(newDate));
console.log(getToday());
console.log('is it saturday today?', isToday(createDate('day', 'saturday')));
console.log('is it sunday today?', isToday(createDate('day', 'sunday')));

console.log(getDay(createDate('full', 20, 5, 1999), true));
console.log(getDay(createDate('full', 20, 5, 2021)));

let newCalendar = createCalendar();
newCalendar.addYear(1999);
newCalendar.getDay(20, 5, 1999).contents.push(testTodo.id);
console.log(newCalendar.getDay(20, 5, 1999));

document.body.innerText = `${testTodo.id}\n${testTodo.title}\n${testTodo.priority}\n${testTodo.dueDate.value}\n${testTodo.checked}`;
