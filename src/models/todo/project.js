import { generateId } from '../id.js';
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

    //Public
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
                let wasSuccesful = false;

                _findIndex(id, _collection.custom, (res) => {
                    _collection.custom.splice(found, 1);
                    wasSuccesful = true;
                });

                return wasSuccesful;
            },
            rename(id, newTitle) {
                let result = false;
                _validateTitle(newTitle);
                _findIndex(id, _collection.custom, (found) => {
                    _collection.custom[found].label = newTitle;
                    result = true;
                });
                return result;
            },
            getAll() {
                let composed;

                composed = _collection.custom.map((label) => {
                    return {
                        id: label.id,
                        label: label.label,
                        n: label.todos.length,
                    };
                });

                return composed;
            },
        },
        todo: {
            add(todoObj, list = 0) {
                let result = false;

                if (isValidTodo(todoObj)) {
                    if (list === 0) {
                        _collection.default.push(todoObj);
                        result = true;
                    } else {
                        _findIndex(list, _collection.custom, (res) => {
                            _collection.custom[res].todos.push(todoObj);
                            result = true;
                        });
                    }
                }

                return result;
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
            move(id, toWhere = 0, fromWhere = 0) {
                let temp,
                    result = false;

                if (fromWhere === 0) {
                    _findIndex(id, _collection.default, (res) => {
                        temp = _collection.default.splice(res, 1)[0];
                        this.add(temp, toWhere);
                        result = true;
                    });
                } else {
                    _findIndex(fromWhere, _collection.custom, (res) => {
                        _findIndex(
                            id,
                            _collection.custom[res].todos,
                            (found) => {
                                temp = _collection.custom[res].todos.splice(
                                    found,
                                    1
                                )[0];
                                this.add(temp, toWhere);
                                result = true;
                            }
                        );
                    });
                }

                return result;
            },
        },
    });
};

export { createProject };

//Projects can have "labels" inside them to group activities together
//There must be an "Inbox" which will be the default "project" where todos will be put
