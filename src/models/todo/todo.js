import { generateId } from '../id.js';
import { isDateValid } from '../time/date.js';

//dueDate = 0 means there's no date to the todo
let createTodo = (title, priority = 0, dueDate = 0) => {
    //Private
    let _id, _title, _priority, _dueDate, _checked, _notes;
    const TITLE_LIMIT = 100;
    const NOTE_LIMIT = 1024;

    let _validateNote = (newNote) => {
        if (typeof newNote === 'string' && newNote.length <= NOTE_LIMIT) {
            _notes = newNote;
        } else {
            throw `Error: must assign a string that has a maximum of ${NOTE_LIMIT} characters as the 'notes' section for a todo.`;
        }
    };

    let _validateTitle = (newTitle) => {
        if (typeof newTitle === 'string' && newTitle.length <= TITLE_LIMIT) {
            _title = newTitle;
        } else {
            throw `Error: must assign a string that has a maximum of ${TITLE_LIMIT} characters as the title for a todo.`;
        }
    };

    let _validatePriority = (newPriority) => {
        if (
            typeof newPriority === 'number' &&
            newPriority >= 0 &&
            newPriority <= 3
        ) {
            _priority = newPriority;
        } else {
            throw 'Error: must assign a number between 0 and 3 as the priority value for a todo.';
        }
    };

    let _validateDueDate = (newDate) => {
        if (isDateValid(newDate) || newDate === 0) {
            _dueDate = newDate;
        } else {
            throw 'Invalid date for todo.';
        }
    };

    _id = generateId();
    _validateTitle(title);
    _validatePriority(priority);
    _validateDueDate(dueDate);
    _checked = false;
    _notes = '';

    //Public
    return Object.assign(
        {
            //id
            get id() {
                return _id;
            },

            //Title
            get title() {
                return _title;
            },
            set title(newTitle) {
                _validateTitle(newTitle);
            },

            //Priority
            get priority() {
                return _priority;
            },
            set priority(newPriority) {
                _validatePriority(newPriority);
            },

            //Due date
            get dueDate() {
                return _dueDate;
            },
            set dueDate(newDate) {
                _validateDueDate(newDate);
            },

            //Checked
            get checked() {
                return _checked;
            },
            toggleCheck() {
                _checked = _checked === false ? true : false;
                return _checked;
            },

            //Notes
            get notes() {
                return _notes;
            },

            set notes(newNote) {
                _validateNote(newNote);
            },
        },
        {}
    );
};

let isValidTodo = (obj) => {
    let result = true;
    try {
        createTodo(obj.title, obj.priority, obj.dueDate);
    } catch (err) {
        result = false;
    }
    return result;
};

export { createTodo, isValidTodo };
