export default {
  header: {
    menu: document.querySelector('button.btn-menu'),
    add: document.querySelector('button.btn-add'),
  },
  prompt: {
    task: {
      dom: document.querySelector('.prompt.add-task'),
      input: document.querySelector('#new-task'),
      btn: {
        close: document.querySelector('.prompt.add-task .btn-close'),
        confirm: document.querySelector('.prompt.add-task .btn-confirm'),
      },
    },
    project: { dom: document.querySelector('.prompt.add-project') },
  },
  listTitle: document.querySelector('.folder-name'),
  todos: document.querySelector('.folder-content'),
  mask: document.querySelector('.mask'),
};
