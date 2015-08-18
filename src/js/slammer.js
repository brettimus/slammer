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
    this.curr = 0;
    this.prev = this.slides.length - 1;
    this.next = 1;
    this.newSlammer = null;

    this.slam();
  }

  setActiveItem(item) {
    item.classList.add(activeSlideClass);
  }

  transformTo(position, time) {
    let transformPos = 0;
    if (position === "center") {
      transformPos = this.newSlammer.offsetWidth/-3;
    }
    else if (position === "next") {
      transformPos = this.newSlammer.offsetWidth*2/-3;
    }

    this.newSlammer.style.transform = "translateX(" + transformPos + "px)";

  }


  /*
  Initializes a new slammer.

  */
  slam() {

    // create new, three-slide slammer out of curr, prev, and next
    this.newSlammer = document.createElement('div');
    let prev = document.createElement('div');
    let curr = document.createElement('div');
    let next = document.createElement('div');

    let slides = [prev, curr, next];
    let origSlideCopies = [];

    for (let i = 0; i < this.slides.length; i++) {
      origSlideCopies.push(this.slides[i].innerHTML);
    }

    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.add('slam-item');
      this.newSlammer.appendChild(slides[i]);
      slides[i].innerHTML += origSlideCopies[i - 1 >= 0 ? i - 1 : origSlideCopies.length - 1];
    }


    const realWrapper = this.wrapper.parentNode;

    realWrapper.removeChild(this.wrapper);

    realWrapper.appendChild(this.newSlammer);

    this.newSlammer.classList.add('slam-items');

    this.transformTo("center", 0);


    return;
  }


}



// Create Slammers out of all elts with this class.
const slammers = document.getElementsByClassName('slam-items');

for (let i = 0; i < slammers.length; i++) {
  let slammer = new Slammer(slammers[i]);
}
