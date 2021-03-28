import { createTodo, isValidTodo } from './models/todo.js';
import { createProject } from './models/project.js';
import {
    createDate,
    isDateValid,
    getToday,
    areEqual,
    isToday,
    getNextOccurrence,
} from './models/date.js';

let testTodo = createTodo('Eat an apple');
testTodo.dueDate = createDate('day', 7);

let newDate = createDate('full', 7, 5, 1999);
console.log('newDate valid? ', isDateValid(newDate));
console.log(getToday());
console.log('is it saturday today?', isToday(createDate('day', 'saturday')));
console.log('is it sunday today?', isToday(createDate('day', 'sunday')));
console.log(getNextOccurrence(createDate('day', 'monday')));
console.log(getNextOccurrence(createDate('month', 'jan')));
console.log(getNextOccurrence(createDate('month', 'sep')));
console.log(getNextOccurrence(createDate('day', 'sunday')));
console.log(getNextOccurrence(createDate('daymonth', 28, 'march')));
console.log(getNextOccurrence(createDate('daymonth', 29, 'march')));
console.log(getNextOccurrence(createDate('daymonth', 20, 'may')));
console.log(getNextOccurrence(createDate('daymonth', 1, 'jan')));

document.body.innerText = `${testTodo.id}\n${testTodo.title}\n${testTodo.priority}\n${testTodo.dueDate.value}\n${testTodo.checked}`;
