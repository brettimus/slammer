"use strict";

/*
 ON CONST:
  This declaration creates a constant that can be global or local to the function in which it is declared. 
  Constants are block-scoped. 
  The value of a constant cannot change through re-assignment, and a constant cannot be re-declared. 
  An initializer for a constant is required. 
  A constant cannot share its name with a function or a variable in the same scope.
 */

const extend = require('./utils').extend;
const Hammer = require('hammerjs');
const SlammerNav = require("./nav");

const activeSlideClass = "slam-item-active";
const slidePositions = ["prev", "center", "next"];

const transitionTime = 450;

class Slammer {

  constructor(wrapperElt, options) {

    // NYU (BB)
    let defaults = {
      activeSlideClass: "slam-item-active",
      transitionTime: 450,
    }
    this.options = extend({}, defaults, options);

    this.wrapper = wrapperElt;  // The wrapper element
    this.slides = [];           // 

    for (let i = 0; i < this.wrapper.children.length; i++) {
      this.slides.push(this.wrapper.children[i]);
    }

    this.locked = true;

    this.curr = 0;
    this.prev = this.slides.length - 1;
    this.next = 1;
    this.newSlammer = null;
    this.position = null;

    this.prevSlide = null;
    this.currSlide = null;
    this.nextSlide = null;

    this.nav = null;

    this.slam();
  }

  createNav() {
    let options = this.options;
    let nav     = new SlammerNav(this, options);

    this.nav = nav;
    this.wrapper.appendChild(this.nav.elt);
    this.nav.update(this.curr);
  }

  relativeTransition(offset) {
    if (offset === 0) return;

    let currentIndex = this.curr;
    let nextIndex    = currentIndex + offset;

    if (offset < 0) this.specialRetreat(nextIndex);
    if (offset > 0) this.specialAdvance(nextIndex);
  }

  specialAdvance(newIndex) {
    // 1. inject contents of newIndex into Next slide
    let newContent = this.slides[newIndex].innerHTML;
    this.nextSlide.innerHTML = newContent;

    // 2. transformTo(nextIndex)
    window.setTimeout(() => {
      this.transformTo(this.curr, newIndex, this.options.transitionTime);
    }, 0);

  }

  specialRetreat(newIndex) {
    // 1. inject contents of newIndex into Prev slide
    let newContent = this.slides[newIndex].innerHTML;
    this.prevSlide.innerHTML = newContent;
    // 2. transformTo(nextIndex)
    window.setTimeout(() => {
      this.transformTo(this.curr, newIndex, this.options.transitionTime);
    }, 0);
  }

  retreat() {
    let newIndex = this.curr - 1;

    this.transformTo(this.curr, newIndex, this.options.transitionTime);
  }

  advance() {
    let newIndex = this.curr + 1;

    this.transformTo(this.curr, newIndex, this.options.transitionTime);
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
    this.nav.update(this.curr);

  }

  transformTo(currIndex, nextIndex, time) {
    let currTransformPos = this.newSlammer.style.transform;
    let currTransformContent = parseFloat(currTransformPos.split('(')[1].split('%')[0]);

    let newTransformPos = 0;

    let transitionTime = this.options.transitionTime;

    if (time <= 0) {
      newTransformPos = (1/3)*-100;
    } else if (nextIndex > currIndex || currIndex === this.slides.length - 1 && nextIndex === -1) {
      newTransformPos = currTransformContent + (1/3)*-100;
    } else {
      newTransformPos = currTransformContent + (1/3)*100;
    }

    if (time > 0){
      this.locked = true;
      this.newSlammer.classList.add('slammer-transitioning');
      this.newSlammer.style.transition = 'transform ' + transitionTime/1000 + 's';
      this.newSlammer.style.WebkitTransition = '-webkit-transform ' + transitionTime/1000 + 's';
      window.setTimeout(() => {
        this.newSlammer.classList.remove('slammer-transitioning');
        this.newSlammer.style.transition = 'transform ' + 0 + 's';
        this.newSlammer.style.WebkitTransition = '-webkit-transform ' + 0 + 's';
        this.injectNewSurroundingSlides(currIndex, nextIndex);
        this.locked = false;
      }, transitionTime);
    } else if (time < 0){
      this.curr = 0;
    }

    this.newSlammer.style.WebkitTransform = "translateX(" + newTransformPos + "%)";
    this.newSlammer.style.transform = "translateX(" + newTransformPos + "%)";
  }

  acceptHammers() {
    let hammer = new Hammer(this.newSlammer);
    hammer.on('swipe', (e) => {
      if (!this.locked) {
        if (e.direction === 2) {
          this.advance();
        }
        else if (e.direction === 4) {
          this.retreat();
        }
      }
    });
    hammer.on('tap', (e) => {
      if (!this.locked) {
        this.advance();
      }
    })
  }


  /* Initializes a new slammer. */
  slam() {

    if (this.slides.length < 2) {
      return;
    }

    // create new, three-slide slammer out of curr, prev, and next
    this.newSlammer = document.createElement('div');
    this.prevSlide = document.createElement('div');
    this.currSlide = document.createElement('div');
    this.nextSlide = document.createElement('div');

    let slides = [this.prevSlide, this.currSlide, this.nextSlide];
    let origSlideCopies = [];

    for (let i = 0; i < this.slides.length; i++) {
      let curr = this.slides[i];
      let newSlide = {
        "content": curr.innerHTML,
        "classes": curr.classList,
        "style": curr.style
      };
      origSlideCopies.push(newSlide);
    }

    for (let i = 0; i < slides.length; i++) {
      this.newSlammer.appendChild(slides[i]);
      let slideIndexToUse = i - 1 >= 0 ? i - 1 : origSlideCopies.length - 1;
      slides[i].innerHTML = origSlideCopies[slideIndexToUse].content;
      for (let j = 0; j < origSlideCopies[slideIndexToUse].classes.length; j++) {
        slides[i].classList.add(origSlideCopies[slideIndexToUse].classes[j]);
      }
      for (let prop in origSlideCopies[slideIndexToUse].style) {
        if (origSlideCopies[slideIndexToUse].style[prop] && origSlideCopies[slideIndexToUse].style[prop].length > 0) {
          slides[i].style[prop] = origSlideCopies[slideIndexToUse].style[prop];
        }
      }
    }

    const realWrapper = this.wrapper.parentNode;

    realWrapper.removeChild(this.wrapper);

    this.wrapper = realWrapper;

    this.wrapper.appendChild(this.newSlammer);
    this.newSlammer.classList.add('slam-items');
    this.newSlammer.style.WebkitTransform = "translateX(0%)";
    this.newSlammer.style.transform = "translateX(0%)";

    this.transformTo(-1, 0, -1);
    this.acceptHammers();

    this.createNav();

    this.locked = false;

    return;
  }
}

module.exports = Slammer;