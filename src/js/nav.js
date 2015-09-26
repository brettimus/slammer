
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
    let clickHandler = navEltHandler.bind(slammer);

    slides.forEach(function(slide, i) {
      let slideElt = document.createElement('div');
      
      slideElt.classList.add(modOptions.slideItemClass);
      setSlideEltIndex(slideElt, i)

      navWrap.appendChild(slideElt);

      slideElt.addEventListener('click', clickHandler)
    });


    this.navWrap = navWrap;
  }
}

// The context here is an instance of Slammer
// That's something I want to fix...
function navEltHandler(evt) {

  if (this.locked) return;
  let slideElt       = evt.target || evt.srcElement;
  let i              = getSlideEltIndex(slideElt);
  let transitionTime = this.options.transitionTime;
  if (i === this.curr) return;

  // if the new slide is only offset by 1 from the current one,
  // then we can proceed as usual.
  if (Math.abs(this.curr - i) <= 1){
    this.transformTo(this.curr, i, transitionTime);
  } else {
    if (i > this.curr) {
      this.specialAdvance(i);
    } else {
      this.specialRetreat(i);
    }
  }
}

// Helpers
function setSlideEltIndex(slideElt, i) {
    slideElt.dataset = slideElt.dataset || {}; // This is a bad pattern but works in this case methinks...
    slideElt.dataset.slammerIndex = i;
}
function getSlideEltIndex(slideElt) {
    return +slideElt.dataset.slammerIndex; // the `+` is to coerce it to an integer
}

module.exports = SlammerNav; 