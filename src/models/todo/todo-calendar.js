import { createProject, findIndex } from './project.js';
import { createCalendar } from '../time/calendar.js';
import { Months } from '../time/date.js';
import {
  lookupDictionary,
  getNextOccurrence,
  getToday,
} from '../time/date-util.js';

let createTodoCalendar = () => {
  let currentYear, calendar, _projects;

  currentYear = getToday().value.year;

  calendar = createCalendar();
  calendar.addYear(currentYear);

  _projects = [];

  let _getAndGroupTodos = () => {
    let groups = [];

    _projects.forEach((project) => {
      let labels = project.label.getAll();

      //gets the default list
      groups.push({ name: project.title, todos: project.todo.getAll() });

      labels.forEach((label) => {
        if (label.n > 0) {
          groups.push({
            name: project.title + '/' + label.label,
            todos: project.todo.getAll(label.id),
          });
        }
      });
    });

    return groups;
  };

  let refresh = (year) => {
    let groups;

    if (!(year >= 0)) {
      throw 'Invalid year for calendar.';
    }
    calendar = createCalendar();
    calendar.addYear(year);

    groups = _getAndGroupTodos();

    groups.forEach((group) => {
      console.log(group);
      group.todos.forEach((todo) => {
        let { day, month, year } = getNextOccurrence(todo.dueDate).value;
        month = lookupDictionary(month, Months, 3) + 1;

        if (year === currentYear) {
          calendar
            .getDay(day, month, year)
            .contents.push({ group: group.name, todo: todo });
        }
      });
    });
  };

  return Object.assign({
    project: {
      create(title, color) {
        let newProject = createProject(title, color);

        _projects.push(newProject);

        return newProject;
      },
      getAll() {
        let composed;

        composed = _projects.map((proj) => {
          return {
            id: proj.id,
            title: proj.title,
          };
        });

        return composed;
      },
      get(id) {
        let result = -1;

        findIndex(id, _projects, (res) => {
          result = _projects[res];
        });

        return result;
      },
      remove(id) {
        let result = false;

        findIndex(id, _projects, (res) => {
          _projects.splice(res, 1);
          result = true;
        });

        return result;
      },
    },
    refresh,
    get() {
      return calendar;
    },
  });
};

export { createTodoCalendar };

// todoCalendar = {
//     project: {
//         create() {},
//         get() {},
//         getAll() {},
//         remove() {},
//     },
//     refresh() {}, //Resets the calendar and reassigns all todos to their dates
// };
