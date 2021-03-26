import { createTodo, isValidTodo } from './models/todo.js';
import { createProject } from './models/project.js';
import { createDate, isDateValid } from './models/date.js';

let testTodo = createTodo('Eat an apple');
testTodo.dueDate = createDate('day', 7);
console.log(testTodo.notes);
testTodo.notes = 'this is a test';
console.log(testTodo.notes);

console.log(isValidTodo({ bananabread: 5, title: 666 }));
console.log(isValidTodo(testTodo));

let newProject = createProject('Epic stuff', 'red');
newProject.todo.add(testTodo);
newProject.todo.add(createTodo('do this'));
newProject.todo.add(createTodo('do that'));
newProject.label.add('Epic label for epic stuff');

console.log(newProject);

console.log(
    newProject.todo.getAll().forEach((el) => {
        console.log(el.title);
    })
);

let idForLabel = newProject.label.getAll()[0].id;
newProject.todo.add(createTodo('make banana bread'), idForLabel);

document.body.innerText = `${testTodo.id}\n${testTodo.title}\n${testTodo.priority}\n${testTodo.dueDate.value}\n${testTodo.checked}`;
