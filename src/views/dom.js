export default {
  header: {
    menu: document.querySelector('button.btn-menu'),
    add: document.querySelector('button.btn-add'),
  },
  prompt: {
    task: {
      dom: document.querySelector('.prompt.add-task'),
      btn: {
        close: document.querySelector('.prompt.add-task .btn-close'),
        confirm: document.querySelector('.prompt.add-task .btn-confirm'),
      },
    },
    project: { dom: document.querySelector('.prompt.add-project') },
  },
  mask: document.querySelector('.mask'),
};
