
const extend = require("./utils").extend;

class SlammerNav {

  constructor(slammer, options) {

    let defaults = {
        slideItemClass: 'slam-nav-item',
    };

    let modOptions = extend({}, defaults, options);
    let slides = slammer.slides;

    let navWrap = document.createElement('nav');
    navWrap.classList.add('slam-nav-wrap');

    // Instead of binding click handler to each list item, 
    // we could capture events by bubbling to the main nav.
    // (Not wholly necessary, but an option.)
    let clickHandler = this.navEltHandler.bind(slammer);

    slides.forEach(function(slide, i) {
      let slideElt = document.createElement('div');
      
      slideElt.classList.add(modOptions.slideItemClass);
      setSlideEltIndex(slideElt, i)

      navWrap.appendChild(slideElt);

      slideElt.addEventListener('click', clickHandler)
    });


    this.navWrap = navWrap;
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