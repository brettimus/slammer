const Hammer = require('hammerjs');

const extend = require("./utils").extend;
const newDiv = require("./utils").newDiv;

let defaults = require("./defaults").nav;

class SlammerNav {

  constructor(wrapper, slides, options) {

    this.options = extend({}, defaults, options);

    this.navClass = this.options.navClass;
    this.navItemClass = this.options.navItemClass;
    this.navItemActiveClass = this.options.navItemActiveClass;

    this
      .setRoot()
      .hammer(new Hammer(this.root))
      .setItems(slides)
      .update(this.options.startingIndex); // sketchy but passable...

    wrapper.appendChild(this.root);
  }

  setRoot() {
    let navElt = document.createElement('nav');
    navElt.classList.add(this.navClass);
    this.root = navElt;
    return this;
  }

  hammer(value) {
    if (!arguments.length) return this._hammer;
    this._hammer = value;
    return this;
  }

  setItems(slides) {
    // Right now, the only thing we really care about with these slides is their index.
    slides.forEach((slide, i) => {
      this.addItem(i);
    });
    return this;
  }

  tap(callback) {
    let eventProxy = (evt) => {
      let navItem = evt.target || evt.srcElement;
      let index   = this.getNavItemIndex(navItem);
      if (callback) callback(index);
    };

    this.hammer().on("tap", eventProxy.bind(this));

    return this;
  }

  update(currentIndex) {
    this
      .forEachItem((item, index) => {
        if (index === currentIndex) {
          this.activateItem(item);
          return;
        }
        this.deactivateItem(item);
      });

    return this;
  }

  addItem(index) {
    let navItem = newDiv();
    navItem.classList.add(this.navItemClass);

    this.setNavItemIndex(navItem, index)
    this.root.appendChild(navItem);

    return this;
  }

  forEachItem(fun) {
    let items = [].slice.call(this.root.children, 0);
    items.forEach(fun, this);
    return this;
  }

  isActiveItem(item) {
    let activeClass = this.navItemActiveClass;
    return item.classList.contains(activeClass)
  }

  activateItem(item) {
    let activeClass = this.navItemActiveClass;
    item.classList.add(activeClass);
  }

  deactivateItem(item) {
    let activeClass = this.navItemActiveClass;
    item.classList.remove(activeClass);
  }

  setNavItemIndex(elt, i) {
      if (!elt.dataset) {
          elt.dataset = {}; // WARNING This is potentially very :poop:
      }
      elt.dataset.slammerIndex = i;
      return this;
  }

  getNavItemIndex(elt) {
      return +elt.dataset.slammerIndex; // the `+` is to coerce the index an integer. otherwise, it's returned as a string
  }
}

module.exports = SlammerNav; 