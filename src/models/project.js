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

    let _findIndex = (id, where, callback) => {
        let found,
            returnValue = -1;
        found = where.findIndex((el) => el.id === id);
        if (found !== -1) {
            if (callback !== undefined) {
                callback(found);
            }
            returnValue = found;
        }

        return returnValue;
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
                let found;

                found = _findIndex(id, _collection.custom, (res) => {
                    _collection.custom.splice(found, 1);
                });

                return found !== -1 ? true : false;
            },
            get(id) {
                let found;

                found = _findIndex(id, _collection.custom);

                return found !== -1 ? _collection.custom[found] : -1;
            },
            getAll() {
                let returnValue;

                returnValue = _collection.custom;

                return returnValue;
            },
        },
        todo: {
            add(todoObj, list = 0) {
                let foundList;

                if (isValidTodo(todoObj)) {
                    if (list === 0) {
                        _collection.default.push(todoObj);
                    } else {
                        foundList = _findIndex(
                            list,
                            _collection.custom,
                            (res) => {
                                _collection.custom[res].todos.push(todoObj);
                            }
                        );
                    }
                }

                return foundList !== -1 ? true : false;
            },
            remove(id, list = 0) {
                let todoArray,
                    wasSuccesful = false;

                if (list === 0) {
                    _findIndex(id, _collection.default, (res) => {
                        _collection.default.splice(res, 1);
                        wasSuccesful = true;
                    });
                } else {
                    _findIndex(list, _collection.custom, (res) => {
                        todoArray = _collection.custom[res].todos;

                        _findIndex(id, todoArray, (found) => {
                            todoArray.splice(found, 1);
                            wasSuccesful = true;
                        });
                    });
                }

                return wasSuccesful;
            },
            get(id, list = 0) {
                let returnValue = -1;
                if (list === 0) {
                    _findIndex(id, _collection.default, (res) => {
                        returnValue = _collection.default[res];
                    });
                } else {
                    _findIndex(list, _collection.custom, (res) => {
                        _findIndex(
                            id,
                            _collection.custom[res].todos,
                            (found) => {
                                returnValue =
                                    _collection.custom[res].todos[found];
                            }
                        );
                    });
                }

                return returnValue;
            },
            getAll(list = 0) {
                let returnValue;
                if (list === 0) {
                    returnValue = _collection.default;
                } else {
                    _findIndex(list, _collection.custom, (res) => {
                        returnValue = _collection.custom[res].todos;
                    });
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
