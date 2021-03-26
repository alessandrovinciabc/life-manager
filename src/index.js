import { createTodo, isValidTodo } from './models/todo.js';
import { createProject } from './models/project.js';
import { createDate, isDateValid } from './models/date.js';

let testTodo = createTodo('Eat an apple');
testTodo.dueDate = createDate('day', 7);

console.log(isValidTodo({ bananabread: 5, title: 666 }));
console.log(isValidTodo(testTodo));

let newProject = createProject('Epic stuff', 'red');
newProject.todo.add(testTodo);
newProject.todo.add(createTodo('do this'));
newProject.todo.add(createTodo('do that'));

console.log(
    newProject.todo.getAll().forEach((el) => {
        console.log(el.title);
    })
);

document.body.innerText = `${testTodo.id}\n${testTodo.title}\n${testTodo.priority}\n${testTodo.dueDate.value}\n${testTodo.checked}`;
