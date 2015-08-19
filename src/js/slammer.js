"use strict";

const Hammer = require('hammerjs');


/*
STEPS:
1. set first image active
2. give images data attr for index
3. remember "current", "prev", "next" indices
4. on swipe or nav tap, hide items between oldCurrIndex and newCurrIndex, and then set newCurrIndex to currIndex
*/

const activeSlideClass = "slam-item-active";
const slidePositions = ["prev", "center", "next"];

class Slammer {
  constructor(wrapperElt) {
    this.wrapper = wrapperElt;
    this.slides = this.wrapper.children;
    this.curr = 0;
    this.prev = this.slides.length - 1;
    this.next = 1;
    this.newSlammer = null;
    this.position = null;

    this.slam();
  }

  retreat() {
    // let newIndex = slidePositions.indexOf(this.position) + 1;
    // let newPos = slidePositions[newIndex < slidePositions.length ? newIndex : slidePositions.length - newIndex];
    // let newIndex = this.curr - 1 < -1 ? this.slides.length - 1 : this.curr - 1;

    let newIndex = this.curr - 1;

    this.transformTo(this.curr, newIndex, 0);
  }

  advance() {
    // console.log(this.curr);
    // let newIndex = slidePositions.indexOf(this.position) + 1;
    // let newPos = slidePositions[newIndex < slidePositions.length ? newIndex : slidePositions.length - newIndex];
    let newIndex = this.curr + 1 >= this.slides.length ? 0 : this.curr + 1;

    // console.log(newIndex);

    this.transformTo(this.curr, newIndex, 0);
  }

  transformTo(currIndex, nextIndex, time) {
    let currTransformPos = this.newSlammer.style.transform;
    let px = parseFloat(currTransformPos.split('(')[1].split('px')[0]);
    let newTransformPos = 0;

    if (nextIndex > currIndex || currIndex === this.slides.length - 1 && nextIndex === -1) {
      newTransformPos = px + this.newSlammer.offsetWidth / -3;
    }
    else {
      newTransformPos = px + this.newSlammer.offsetWidth / 3;
    }

    this.newSlammer.style.transform = "translateX(" + newTransformPos + "px)";



    // let transformPos = 0;
    // if (position === "center") {
    //   transformPos = this.newSlammer.offsetWidth/-3;
    //   this.position = "center";
    // }
    // else if (position === "next") {
    //   transformPos = this.newSlammer.offsetWidth*2/-3;
    //   this.position = "next";
    // }
    // else {
    //   this.position = "prev";
    // }
    //
    // this.newSlammer.style.transform = "translateX(" + transformPos + "px)";

  }

  acceptHammers() {
    let hammer = new Hammer(this.newSlammer);
    hammer.on('swipe', (e) => {
      if (e.direction === 2) {
        this.advance();
      }
      else if (e.direction === 4) {
        this.retreat();
      }
    });
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

    this.newSlammer.style.transform = "translateX(0px)";

    this.transformTo(-1, 0, 0);
    this.acceptHammers();

    return;
  }


}



// Create Slammers out of all elts with this class.
const slammers = document.getElementsByClassName('slam-items');

for (let i = 0; i < slammers.length; i++) {
  let slammer = new Slammer(slammers[i]);
}
