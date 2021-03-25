import { generateId } from './id.js';
import { isValidTodo } from './todo.js';

const AvailableColors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];

let createProject = (title, color) => {
    //Private
    let _id, _title, _color, _collection;
    let _validateTitle = (newTitle) => {
        if (typeof newTitle === 'string' && newTitle.length <= 100) {
            _title = newTitle;
        } else {
            throw 'Error: must assign a string that has a maximum of 100 characters as the title for a project.';
        }
    };
    let _validateColor = (newColor) => {
        if (
            typeof newColor === 'string' &&
            AvailableColors.includes(newColor)
        ) {
            _color = newColor.toLowerCase();
        } else {
            throw 'Invalid color for project.';
        }
    };

    _id = generateId();
    _title = _validateTitle(title);
    _color = _validateColor(color);
    _collection = [];

    return Object.assign({
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
        //Color
        get color() {
            return _color;
        },
        set color(newColor) {
            _validateColor(newColor);
        },
        //Collection
    });
};

//Projects can have "labels" inside them to group activities together
//There must be a "Inbox" which will be the default "project" where todos will be put
