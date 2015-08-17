"use strict";

/*
STEPS:
1. set first image active
2. give images data attr for index
3. remember "current", "prev", "next" indices
4. on swipe or nav tap, hide items between oldCurrIndex and newCurrIndex, and then set newCurrIndex to currIndex
*/

const activeSlideClass = "slam-item-active";

class Slammer {
  constructor(wrapperElt) {
    this.wrapper = wrapperElt;
    this.slides = this.wrapper.children;

    this.slam();
  }

  setActiveItem(item) {
    item.classList.add(activeSlideClass);
  }


  /*
  Initializes a new slammer.

  */
  slam() {

    // set first slide active.
    this.setActiveItem(this.slides[0]);

    return;
  }


}



// Create Slammers out of all elts with this class.
const slammers = document.getElementsByClassName('slam-items');

for (let i = 0; i < slammers.length; i++) {
  let slammer = new Slammer(slammers[i]);
}
