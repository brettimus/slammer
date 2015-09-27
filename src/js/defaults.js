const extend = require('./utils').extend;

let nav = {
  navClass: 'slam-nav-wrap',
  navItemClass: 'slam-nav-item',
  navItemActiveClass: 'slam-nav-active',
};

let triptych = {
  transitionTime: 450,
  transitionClassName: 'slammer-transitioning',
  triptychClassName: 'slam-items',
};

let slammer = {
  nav: true,
  startingIndex: 0,
};

module.exports = {
    nav: nav,
    slammer: slammer,
    triptych: triptych,
};