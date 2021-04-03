import DOM from './dom.js';

let menu = DOM.sideMenu;
let buttonToOpenMenu = DOM.header.menu;

let initializeMenu = () => {
  buttonToOpenMenu.addEventListener('click', function (e) {
    menu.classList.toggle('d-none');
  });
};

export { initializeMenu };
