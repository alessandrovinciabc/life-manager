import { generateId } from './id.js';
import { isValidTodo } from './todo.js';

const AvailableColors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];

let createProject = (title, color) => {
    //Private
    let _id, _title, _color, _collection;
    let _validateTitle = (newTitle) => {
        let returnValue;
        if (typeof newTitle === 'string' && newTitle.length <= 100) {
            returnValue = newTitle;
        } else {
            throw 'Error: must assign a string that has a maximum of 100 characters as the title for a project/label.';
        }

        return returnValue;
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
        custom: [] /*labelled groups*/,
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
            _title = newTitle;
        },
        //Color
        get color() {
            return _color;
        },
        set color(newColor) {
            _validateColor(newColor);
        },
        //Collection
        label: {
            add(name) {
                let newLabel = {
                    id: generateId(),
                    label: _validateTitle(name),
                    todos: [],
                };

                _collection.custom.push(newLabel);
            },
            remove(id) {
                let found,
                    returnValue = false;
                found = _collection.custom.findIndex((el) => el.id === id);
                if (found !== -1) {
                    _collection.custom.splice(found, 1);
                    returnValue = true;
                }

                return returnValue;
            },
            get(id) {
                let found,
                    returnValue = -1;
                found = _collection.custom.findIndex((el) => el.id === id);
                if (found !== -1) {
                    returnValue = _collection.custom[found];
                }

                return returnValue;
            },
            getAll() {
                let returnValue;

                returnValue = _collection.custom;

                return returnValue;
            },
        },
        todo: {
            add(todoObj, list = 0) {
                let foundList,
                    returnValue = false;

                if (isValidTodo(todoObj)) {
                    if (list === 0) {
                        _collection.default.push(todoObj);
                    } else {
                        foundList = _collection.custom.finIndex(
                            (el) => el.id === list
                        );
                        if (foundList !== -1) {
                            _collection.custom[foundList].todos.push(todoObj);
                            returnValue = true;
                        }
                    }
                }

                return returnValue;
            },
            remove(id, list = 0) {
                let found,
                    returnValue = false;
                if (list === 0) {
                    found = _collection.default.findIndex((el) => el.id === id);
                    if (found !== -1) {
                        _collection.default.splice(found, 1);
                        returnValue = true;
                    }
                } else {
                    let foundList = _collection.custom.findIndex(
                        (el) => el.id === list
                    );
                    if (foundList !== -1) {
                        let todoArray, indexToDelete;
                        todoArray = _collection.custom[foundList].todos;
                        indexToDelete = todos.findIndex((el) => el.id === id);
                        if (indexToDelete !== -1) {
                            returnValue = true;
                            todoArray.splice(indexToDelete, 1);
                        }
                    }
                }

                return returnValue;
            },
            get(id, list = 0) {
                let found,
                    foundList,
                    returnValue = -1;
                if (list === 0) {
                    found = _collection.default.findIndex((el) => el.id === id);
                    if (found !== -1) {
                        returnValue = _collection.default[found];
                    }
                } else {
                    foundList = _collection.custom.findIndex(
                        (el) => el.id === list
                    );
                    if (foundList !== -1) {
                        found = _collection.custom[foundList].todos.findIndex(
                            (el) => el.id === id
                        );
                        if (found !== -1) {
                            returnValue =
                                _collection.custom[foundList].todos[found];
                        }
                    }
                }

                return returnValue;
            },
            getAll(list = 0) {
                let foundList, returnValue;
                if (list === 0) {
                    returnValue = _collection.default;
                } else {
                    foundList = _collection.custom.finIndex(
                        (el) => el.id === list
                    );
                    if (foundList !== -1) {
                        returnValue = _collection.custom[foundList].todos;
                    }
                }

                return returnValue;
            },
            move(id, destinationList) {},
        },
    });
};

export { createProject };

//Projects can have "labels" inside them to group activities together
//There must be an "Inbox" which will be the default "project" where todos will be put
