"use strict";

const Hammer = require('hammerjs');

const activeSlideClass = "slam-item-active";
const slidePositions = ["prev", "center", "next"];

const transitionTime = 450;

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

  createNav() {
    let navWrap = document.createElement('div');

    for (let i = 0; i < this.slides.length; i++) {
      let slideElt = document.createElement('div');
      slideElt.classList.add('slam-nav-item');
      navWrap.appendChild(slideElt);
    }

    navWrap.classList.add('slam-nav-wrap');
    this.wrapper.appendChild(navWrap);
  }

  retreat() {
    let newIndex = this.curr - 1;

    this.transformTo(this.curr, newIndex, transitionTime);
  }

  advance() {
    let newIndex = this.curr + 1;

    this.transformTo(this.curr, newIndex, transitionTime);
  }

  injectNewSurroundingSlides(currIndex, newIndex) {
    const actualNewIndex = (newIndex + this.slides.length)%this.slides.length;
    const actualNextIndex = (actualNewIndex + 1 + this.slides.length)%this.slides.length;
    const actualPrevIndex = (actualNewIndex - 1 + this.slides.length)%this.slides.length;

    let newCurrContent = this.slides[actualNewIndex].innerHTML;
    let newNextContent = this.slides[actualNextIndex].innerHTML;
    let newPrevContent = this.slides[actualPrevIndex].innerHTML;

    this.currSlide.innerHTML = newCurrContent;
    this.nextSlide.innerHTML = newNextContent;
    this.prevSlide.innerHTML = newPrevContent;

    this.curr = actualNewIndex;

    this.transformTo(actualNewIndex, 0, 0);

  }

  transformTo(currIndex, nextIndex, time) {
    let currTransformPos = this.newSlammer.style.transform;
    let px = parseFloat(currTransformPos.split('(')[1].split('px')[0]);
    let newTransformPos = 0;

    if (time <= 0) {
      newTransformPos = this.newSlammer.offsetWidth / -3;
    } else if (nextIndex > currIndex || currIndex === this.slides.length - 1 && nextIndex === -1) {
      newTransformPos = px + this.newSlammer.offsetWidth / -3;
    } else {
      newTransformPos = px + this.newSlammer.offsetWidth / 3;
    }

    if (time > 0){
      this.newSlammer.classList.add('slammer-transitioning');
      this.newSlammer.style.WebkitTransition = 'transform ' + transitionTime/1000 + 's';
      window.setTimeout(() => {
        this.newSlammer.classList.remove('slammer-transitioning');
        this.newSlammer.style.WebkitTransition = 'transform ' + 0 + 's';
        this.injectNewSurroundingSlides(currIndex, nextIndex);
      }, transitionTime);
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

    console.log(realWrapper);

    realWrapper.removeChild(this.wrapper);

    this.wrapper = realWrapper;

    this.wrapper.appendChild(this.newSlammer);
    this.newSlammer.classList.add('slam-items');
    this.newSlammer.style.transform = "translateX(0px)";

    this.transformTo(-1, 0, -1);
    this.acceptHammers();

    this.createNav();

    return;
  }


}



// Create Slammers out of all elts with this class.
const slammers = document.getElementsByClassName('slam-items');

for (let i = 0; i < slammers.length; i++) {
  let slammer = new Slammer(slammers[i]);
}
