import { createProject } from '../models/todo/project.js';
import DOM from './dom.js';

let list, inputForProjectName, confirmButton;

list = DOM.projectsDisplay;
inputForProjectName = DOM.newProjectText;
confirmButton = DOM.confirmProjectBtn;

const projectListItemTemplate =
  '<li data-id="%projectId%" data-title="%projectTitle%">%projectTitle%<span><input class="input-project-edit soft-d-none" type="text" autocomplete="off"/><button class="edit-project">Toggle Edit</button><button class="delete-project">X</button></span></li>';

let getNewProjectInput = () => {
  return inputForProjectName.value;
};

let resetNewProjectInput = () => {
  inputForProjectName.value = '';
};

let createProjectHTML = (id, text) => {
  let template, newProject;

  template = projectListItemTemplate.slice();

  newProject = template.replace(/%projectId%/g, id);
  newProject = newProject.replace(/%projectTitle%/g, text);

  return newProject;
};

let addProjectToList = (project) => {
  list.insertAdjacentHTML(
    'beforeend',
    createProjectHTML(project.id, project.title)
  );
};

let displayAllProjects = (projects) => {
  projects.forEach((project) => {
    addProjectToList(project);
  });
};

let resetProjectDisplay = () => {
  list.innerText = '';
};

let initializeProjects = () => {
  confirmButton.addEventListener('click', function (e) {
    let newProjectTitle;

    newProjectTitle = getNewProjectInput();
    if (newProjectTitle.length > 0) {
      resetNewProjectInput();
      document.dispatchEvent(
        new CustomEvent('projectadded', { detail: newProjectTitle })
      );
    }
  });
  list.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-project')) {
      let idToDelete = e.target.parentNode.parentNode.dataset.id;
      document.dispatchEvent(
        new CustomEvent('projectdeleted', { detail: idToDelete })
      );
    } else if (e.target.classList.contains('edit-project')) {
      let listItem, currentTitle, textInputDOM;

      listItem = e.target.parentNode.parentNode;
      currentTitle = listItem.dataset.title;
      textInputDOM = listItem.querySelector('input[type="text"]');

      if (!textInputDOM.classList.contains('soft-d-none')) {
        let newTitle, idOfProjectToChange;
        idOfProjectToChange = listItem.dataset.id;
        newTitle = textInputDOM.value;

        document.dispatchEvent(
          new CustomEvent('projectchanged', {
            detail: { id: idOfProjectToChange, newTitle: newTitle },
          })
        );
      } else {
        textInputDOM.value = currentTitle;
      }

      textInputDOM.classList.toggle('soft-d-none');
    } else if (e.target.dataset.id) {
      let idOfProjectThatWasClicked;

      idOfProjectThatWasClicked = e.target.dataset.id;

      document.dispatchEvent(
        new CustomEvent('projectswitch', { detail: idOfProjectThatWasClicked })
      );
    }
  });
  document
    .querySelector('.icon-inbox')
    .parentNode.addEventListener('click', function (e) {
      document.dispatchEvent(new CustomEvent('projectswitch', { detail: 0 }));
    });
  document
    .querySelector('.icon-calendar-number')
    .addEventListener('click', function (e) {});
};

export { initializeProjects, displayAllProjects, resetProjectDisplay };
