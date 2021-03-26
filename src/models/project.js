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
    _collection = {
        default: [
            /*todos without a label*/
        ],
        custom: [
            {
                /*id: ..., title: ..., todos: []*/
            },
            {},
            {},
        ] /*todos from labels*/,
    };

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
        getCollection() {},
        label: {
            add() {},
            remove() {},
            get() {},
        },
        todo: {
            add(todoObj, list = 0) {
                if (isValidTodo(todoObj)) {
                    if (list === 0) {
                        _collection.default.push(todoObj);
                    }
                }
            },
            remove(id, list = 0) {
                let found;
                if (list === 0) {
                    found = _collection.default.findIndex((el) => el.id === id);
                    if (found !== -1) {
                        _collection.default.splice(found, 1);
                    }
                }
            },
            get(id, list = 0) {
                let found,
                    returnValue = -1;
                if (list === 0) {
                    found = _collection.default.findIndex((el) => el.id === id);
                    if (found !== -1) {
                        returnValue = _collection.default[found];
                    }
                }

                return returnValue;
            },
            getAll(list = 0) {
                let returnValue;
                if (list === 0) {
                    returnValue = _collection.default;
                }

                return returnValue;
            },
        },
    });
};

let exampleCollection = [
    [], //this one is reserved and is the default spot for all todos without a category
    { label: 'Getting leads', todos: [] },
    { label: 'Skill development', todos: [] },
];

export { createProject };

//Projects can have "labels" inside them to group activities together
//There must be an "Inbox" which will be the default "project" where todos will be put
