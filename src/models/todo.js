import { generateId } from './id.js';

let createTodo = (title, priority = 0, dueDate = 0, recurring = false) => {
    //Private
    let _id = generateId(),
        _title = title,
        _priority = priority,
        _dueDate = dueDate,
        _recurring = recurring,
        _checked = false;

    //Public
    return Object.assign(
        {},
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
                //To be filled...
                //
                //
                //
                //
            },

            //Recurring
            get recurring() {
                return _recurring;
            },
            toggleRecurrency() {
                _recurring = _recurring === false ? true : false;
                return _recurring;
            },

            //Checked
            get isChecked() {
                return _checked;
            },
            toggleCheck() {
                _checked = _checked === false ? true : false;
                return _checked;
            },
        }
    );
};

export { createTodo };
