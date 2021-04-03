import DOM from './dom.js';
import { Months } from '../models/time/date.js';
import { lookupDictionary } from '../models/time/date-util.js';

let display = DOM.todosDisplay;
let defaultList = display.querySelector('.todos');

const todoTemplateInHTML =
  '<li><input class="todo-checkbox" type="checkbox" name="todo%todoId%" id="todo%todoId%" autocomplete="off"/><label for="todo%todoId%"><div class="circle-check p%todoPriority%"></div></label><span class="todo-text">%todoText%</span><div class="edit-stuff vis-hidden "><input type="text" autocomplete="off" minlength="1"/><input type="date" autocomplete="off" /><input type="number" min="1" max="4"/><button class="confirm-edit">Confirm</button><button class="cancel-edit">Cancel</button></div><button class="edit-btn"></button><span class="d-none todo-date">%todoDueDate%</span><span class="d-none todo-priority-n">%todoPriority%</span></li>';

let createTodoHTML = (id, text, priority = 1, date = 0) => {
  let template, newTodo;

  template = todoTemplateInHTML.slice();

  newTodo = template.replace(/%todoId%/g, id);
  newTodo = newTodo.replace(/%todoText%/g, text);
  newTodo = newTodo.replace(/%todoPriority%/g, priority);
  newTodo = newTodo.replace(/%todoDueDate%/g, date);

  return newTodo;
};

let addTodoToDisplay = (todo, list = defaultList) => {
  if (todo.dueDate !== 0) {
    let newMonth = lookupDictionary(todo.dueDate.value.month, Months, 3) + 1;
    if (newMonth < 10) {
      newMonth = `0${newMonth}`;
    }
    let newDay = todo.dueDate.value.day;
    if (newDay < 10) {
      newDay = `0${newDay}`;
    }
    list.insertAdjacentHTML(
      'beforeend',
      createTodoHTML(
        todo.id,
        todo.title,
        todo.priority + 1,
        `${todo.dueDate.value.year}-${newMonth}-${newDay}`
      )
    );
  } else {
    list.insertAdjacentHTML(
      'beforeend',
      createTodoHTML(todo.id, todo.title, todo.priority + 1)
    );
  }
};

let removeTodoFromDisplay = (todoId) => {
  let todoToRemove = defaultList.querySelector(`#todo${todoId}`).parentNode;
  todoToRemove.remove();
};

let removeAllTodosFromDisplay = () => {
  display.querySelector('.todos').textContent = '';
};

let displayAllTodos = (arrayOfTodos) => {
  arrayOfTodos.forEach((el) => {
    addTodoToDisplay(el);
  });
};

let initializeTodos = () => {
  defaultList.addEventListener('change', function (e) {
    if (e.target.id.slice(0, 4) === 'todo') {
      let idOfTodoThatWasChecked = e.target.id.slice(4);
      let customEvent = new CustomEvent('todochecked', {
        detail: idOfTodoThatWasChecked,
      });
      document.dispatchEvent(customEvent);
    }
  });

  defaultList.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-btn')) {
      let todoListItem, editForm, currentDate, currentTitle, currentPriority;

      let datePicker, titleInput, priorityInput;

      todoListItem = e.target.parentNode;

      currentDate = todoListItem.querySelector('.todo-date').innerText;
      currentTitle = todoListItem.querySelector('.todo-text').innerText;
      currentPriority = todoListItem.querySelector('.todo-priority-n')
        .innerText;

      editForm = todoListItem.querySelector('.edit-stuff');
      datePicker = editForm.querySelector('input[type="date"]');
      titleInput = editForm.querySelector('input[type="text"]');
      priorityInput = editForm.querySelector('input[type="number"]');

      datePicker.value = currentDate;
      titleInput.value = currentTitle;
      priorityInput.value = currentPriority;

      editForm.classList.toggle('vis-hidden');
    } else if (e.target.classList.contains('confirm-edit')) {
      let todoListItem, id, editForm, newDate, newTitle, newPriority;

      todoListItem = e.target.parentNode.parentNode;
      id = todoListItem
        .querySelector('.todo-checkbox')
        .getAttribute('id')
        .slice(4);

      editForm = e.target.parentNode;

      newDate = editForm.querySelector('input[type="date"]').value || 0;
      newTitle = editForm.querySelector('input[type="text"]').value || ' ';
      newPriority = editForm.querySelector('input[type="number"]').value;

      document.dispatchEvent(
        new CustomEvent('todochanged', {
          detail: {
            id: id,
            dueDate: newDate,
            title: newTitle,
            priority: newPriority,
          },
        })
      );

      editForm.classList.toggle('vis-hidden');
    } else if (e.target.classList.contains('cancel-edit')) {
      editForm.classList.toggle('vis-hidden');
    }
  });
};

export {
  createTodoHTML,
  addTodoToDisplay,
  removeTodoFromDisplay,
  removeAllTodosFromDisplay,
  displayAllTodos,
  initializeTodos,
};
