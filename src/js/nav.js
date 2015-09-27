
const extend = require("./utils").extend;

class SlammerNav {

  constructor(slammer, options) {

    let defaults = {
        navClass: 'slam-nav-wrap',
        navItemClass: 'slam-nav-item',
        navItemActiveClass: 'slam-nav-active'
    };
    this.options = extend({}, defaults, options);

    let navElt = document.createElement('nav');
    navElt.classList.add(this.options.navClass);
    this.root = navElt;

    // Instead of binding click handler to each list item, 
    // we could capture events by bubbling to the main nav.
    // (Not wholly necessary, but an option.)
    let clickHandler = this.navEltHandler.bind(slammer);

    let slides = slammer.slides;
    slides.forEach((slide, i) => {

      let navItem = document.createElement('div');
      navItem.addEventListener('click', clickHandler)
      
      this
        .setNavItemIndex(navItem, i)
        .addItem(navItem);
    });

    this.update(slammer.currentIndex());
    slammer.wrapper.appendChild(this.root);
  }

  navEltHandler(evt) {

    /*** For the record I dislike what I did here. Not happy about it at all. ***/
    //
    // `this` (the context) is an instance of Slammer
    // that's why you see the use of `.bind` when the `clickHandler` is created upon unitialization
    // ... Not ideal, but it works for now!

    if (this.isLocked()) return;  
    let navItem      = evt.target || evt.srcElement;
    let nextIndex    = this.nav.getNavItemIndex(navItem);
    let offset       = nextIndex - this.currentIndex();

    this
      .updateNav()
      .relativeTransition(offset);
  }


  update(currentIndex) {

    let navItems = this.getItems();
    
    [].forEach.call(navItems, (item, index) => {

      if (this.isActiveItem(item)) {
        this.deactivateItem(item);
      }
      else if (index === currentIndex) {
        this.activateItem(item);
      }

    });

    return this;
  }

  addItem(navItem) {
    navItem.classList.add(this.options.navItemClass);
    this.root.appendChild(navItem);
    return this;
  }

  getItems() {
    return this.root.children;
  }

  isActiveItem(item) {
    let activeClass = this.options.navItemActiveClass;
    return item.classList.contains(activeClass)
  }

  activateItem(item) {
    let activeClass = this.options.navItemActiveClass;
    item.classList.add(activeClass);
  }

  deactivateItem(item) {
    let activeClass = this.options.navItemActiveClass;
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