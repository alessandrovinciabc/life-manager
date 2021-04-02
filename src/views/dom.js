export default {
  header: {
    menu: document.querySelector('button.btn-menu'),
    add: document.querySelector('button.btn-add'),
  },
  prompt: {
    task: {
      dom: document.querySelector('.prompt.add-task'),
      input: document.querySelector('#new-task'),
      dateInput: document.querySelector('input[type="date"]'),
      priorityInput: document.querySelector('.priority-picker'),
      btn: {
        close: document.querySelector('.prompt.add-task .btn-close'),
        confirm: document.querySelector('.prompt.add-task .btn-confirm'),
        priority: document.querySelector('priority-picker-btn'),
      },
    },
    project: { dom: document.querySelector('.prompt.add-project') },
  },
  listTitle: document.querySelector('.folder-name'),
  todosDisplay: document.querySelector('.folder-content'),
  mask: document.querySelector('.mask'),
};
