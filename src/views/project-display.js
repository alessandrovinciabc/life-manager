import { createProject } from '../models/todo/project.js';
import DOM from './dom.js';

let list, inputForProjectName, confirmButton;

list = DOM.projectsDisplay;
inputForProjectName = DOM.newProjectText;
confirmButton = DOM.confirmProjectBtn;

const projectListItemTemplate =
  '<li data-id="%projectId%" data-title="%projectTitle%">%projectTitle%</li>';

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
};

export { initializeProjects, displayAllProjects, resetProjectDisplay };
