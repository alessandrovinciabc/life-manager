import { generateId } from './id.js';
import { isDateValid } from './date.js';

let createTodo = (title, priority = 0, dueDate = 0) => {
    //Private
    let _id = generateId(),
        _title = title,
        _priority = priority,
        _dueDate = dueDate,
        _checked = false;

    //Public
    return Object.assign(
        {
            //Id
            get id() {
                return _id;
            },

            //Title
            get title() {
                return _title;
            },
            set title(newTitle) {
                if (typeof newTitle === 'string' && newTitle.length <= 100) {
                    _title = newTitle;
                } else {
                    throw 'Error: must assign a string that has a maximum of 100 characters as the title for a todo.';
                }
            },

            //Priority
            get priority() {
                return _priority;
            },
            set priority(newPriority) {
                if (
                    typeof newPriority === 'number' &&
                    newPriority >= 0 &&
                    newPriority <= 3
                ) {
                    _priority = newPriority;
                } else {
                    throw 'Error: must assign a number between 0 and 3 as the priority value for a todo.';
                }
            },

            //Due date
            get dueDate() {
                return _dueDate;
            },
            set dueDate(newDate) {
                if (isDateValid(newDate)) {
                    _dueDate = newDate;
                } else {
                    throw 'Invalid date for todo.';
                }
            },

            //Checked
            get isChecked() {
                return _checked;
            },
            toggleCheck() {
                _checked = _checked === false ? true : false;
                return _checked;
            },
        },
        {}
    );
};

export { createTodo };
