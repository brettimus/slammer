"use strict";

const Hammer = require('hammerjs');

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

    this.prevSlide = null;
    this.currSlide = null;
    this.nextSlide = null;

    this.slam();
  }

  retreat() {
    let newIndex = this.curr - 1;

    this.transformTo(this.curr, newIndex, 1);
  }

  advance() {
    let newIndex = this.curr + 1;

    this.transformTo(this.curr, newIndex, 1);
  }

  injectNewSurroundingSlides(currIndex, newIndex) {
    console.log('--------');
    console.log(currIndex);
    console.log(newIndex);

    this.curr = newIndex;


    // let newCurrSlideContents = this.slides[currIndex].innerHTML;
    //
    // this.currSlide.innerHTML = newCurrSlideContents;
    // this.transformTo(currIndex, 0, 0);
    //
    // let nextIndex = currIndex + 1;
    // let prevIndex = currIndex - 1;
    //
    // if (nextIndex >= this.slides.length) {
    //   nextIndex = 0;
    // }
    // if (prevIndex < 0) {
    //   prevIndex = this.slides.length - 1;
    // }
    //
    // let newNextSlideContents = this.slides[nextIndex].innerHTML;
    // let newPrevSlideContents = this.slides[prevIndex].innerHTML;
    // this.nextSlide.innerHTML = newNextSlideContents;
    // this.prevSlide.innerHTML = newPrevSlideContents;

  }

  transformTo(currIndex, nextIndex, time) {
    let currTransformPos = this.newSlammer.style.transform;
    let px = parseFloat(currTransformPos.split('(')[1].split('px')[0]);
    let newTransformPos = 0;

    if (nextIndex > currIndex || currIndex === this.slides.length - 1 && nextIndex === -1 || time < 0) {
      newTransformPos = px + this.newSlammer.offsetWidth / -3;
    }
    else {
      newTransformPos = px + this.newSlammer.offsetWidth / 3;
    }

    if (time > 0){
      this.newSlammer.classList.add('slammer-transitioning');
      window.setTimeout(() => {
        this.newSlammer.classList.remove('slammer-transitioning');
        this.injectNewSurroundingSlides(currIndex, nextIndex);
      }, 400);
    } else if (time < 0){
      this.curr = 0;
    }

    this.newSlammer.style.transform = "translateX(" + newTransformPos + "px)";


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
    this.prevSlide = document.createElement('div');
    this.currSlide = document.createElement('div');
    this.nextSlide = document.createElement('div');

    let slides = [this.prevSlide, this.currSlide, this.nextSlide];
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

    this.transformTo(-1, 0, -1);
    this.acceptHammers();

    return;
  }


}



// Create Slammers out of all elts with this class.
const slammers = document.getElementsByClassName('slam-items');

for (let i = 0; i < slammers.length; i++) {
  let slammer = new Slammer(slammers[i]);
}
