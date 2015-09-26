
const extend = require("./utils").extend;

class SlammerNav {

  constructor(slammer, options) {

    let defaults = {
        slideItemClass: 'slam-nav-item',
        slideItemActiveClass: 'slam-nav-active'
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
      
      slideElt.classList.add(this.options.slideItemClass);
      setSlideEltIndex(slideElt, i)

      navElt.appendChild(slideElt);

      slideElt.addEventListener('click', clickHandler)
    });


    this.elt = navElt;
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
      if (item.classList.contains('slam-nav-active')) {
        item.classList.remove('slam-nav-active')
      }
      else if (index === currentIndex) {
        item.classList.add('slam-nav-active');
      }
    });
  }

  getItems() {
    return this.elt.children;
  }
}


// Helpers
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