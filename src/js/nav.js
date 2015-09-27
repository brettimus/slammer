
const extend = require("./utils").extend;

class SlammerNav {

  constructor(slammer, options) {

    let defaults = {
        navItemClass: 'slam-nav-item',
        navItemActiveClass: 'slam-nav-active'
    };

    this.options = extend({}, defaults, options);
    let slides = slammer.slides;

    let navElt = document.createElement('nav');
    navElt.classList.add('slam-nav-wrap');

    // Instead of binding click handler to each list item, 
    // we could capture events by bubbling to the main nav.
    // (Not wholly necessary, but an option.)
    let clickHandler = this.navEltHandler.bind(slammer);

    slides.forEach((slide, i) => {
      let slideElt = document.createElement('div');
      
      this.addItemClass(slideElt);
      setSlideEltIndex(slideElt, i)

      navElt.appendChild(slideElt);

      slideElt.addEventListener('click', clickHandler)
    });

    this.elt = navElt;
    this.update(slammer.curr);
  }

  navEltHandler(evt) {
    // `this` (the context) is an instance of Slammer
    // that's why you see the use of `.bind` when the `clickHandler` is created upon unitialization
    // ... Not ideal, but it works for now!

    if (this.locked) return;  
    let slideElt       = evt.target || evt.srcElement;
    let currentIndex   = this.curr;
    let nextIndex      = getSlideEltIndex(slideElt);
    let offset         = nextIndex - currentIndex;

    this.relativeTransition(offset);
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

  getItems() {
    return this.elt.children;
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

  addItemClass(item) {
    let baseClass = this.options.navItemClass
    item.classList.add(baseClass);
  }
}


/*** Helpers - these need a better home. ***/
function setSlideEltIndex(slideElt, i) {
    if (!slideElt.dataset) {
        slideElt.dataset = {}; // This is potentially very :poop:
    }
    slideElt.dataset.slammerIndex = i;
}
function getSlideEltIndex(slideElt) {
    return +slideElt.dataset.slammerIndex; // the `+` is to coerce the index an integer. otherwise, it's returned as a string
}

module.exports = SlammerNav; 