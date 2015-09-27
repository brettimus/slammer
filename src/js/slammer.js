"use strict";

/*
 ON CONST:
  This declaration creates a constant that can be global or local to the function in which it is declared. 
  Constants are block-scoped. 
  The value of a constant cannot change through re-assignment, and a constant cannot be re-declared. 
  An initializer for a constant is required. 
  A constant cannot share its name with a function or a variable in the same scope.
 */

const Hammer = require('hammerjs');
const SlammerNav = require("./nav");

const extend         = require('./utils').extend;
const getTransformPercentAsNumber = require("./utils").getTransformPercentAsNumber;
const mergeClassList = require("./utils").mergeClassList;
const mergeStyles    = require("./utils").mergeStyles;
const newDiv         = require("./utils").newDiv;
const setTransform   = require("./utils").setTransform;
const setTransition  = require("./utils").setTransition;

const activeSlideClass = "slam-item-active";
const slidePositions = ["prev", "center", "next"];

const transitionTime = 450;

class Slammer {

  constructor(wrapperElt, options) {

    let defaults = {
      activeSlideClass: "slam-item-active",
      transitionTime: 450,
    };
    
    this.options = extend({}, defaults, options);

    this.slides  = [].slice.call(wrapperElt.children, 0);

    // Global lock. (?? I think this short circuits event handlers _while_ a transition is occurring.)
    this.lock();

    this.curr = 0;
    this.prev = this.slides.length - 1;
    this.next = 1;

    this.newSlammer = null;
    this.position = null;

    this.prevSlide = null;
    this.currSlide = null;
    this.nextSlide = null;

    this.nav = null;

    this.slam(wrapperElt);
  }

  createNav() {
    let options = this.options;
    this.nav = new SlammerNav(this, options);
    this.wrapper.appendChild(this.nav.elt);
    return this;
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
    newIndex        = this.indexify(newIndex);
    const nextIndex = this.indexify(newIndex + 1);
    const prevIndex = this.indexify(newIndex - 1);

    // Update current index
    this.curr = newIndex;

    // Update current, next, and prev slides
    this.currSlide.innerHTML = this.getSlideHTML(newIndex);
    this.nextSlide.innerHTML = this.getSlideHTML(nextIndex);
    this.prevSlide.innerHTML = this.getSlideHTML(prevIndex);

    // Apply proper transforms to slides
    this.transformTo(newIndex, 0, 0);
    this.nav.update(this.curr);

    return this;
  }

  transformTo(currIndex, nextIndex, time) {

    let currTransformContent = getTransformPercentAsNumber(this.newSlammer.style.transform)

    let offset = nextIndex - currIndex;
    let isCurrentItemLast = currIndex === this.slides.length - 1;

    let transitionTime = this.options.transitionTime;

    if (nextIndex === -1) debugger; /* ?? What causes this case ?? I couldn't trigger it. (BB) */

    let newTransformPos;
    if (time <= 0) {
      newTransformPos = (1/3) * -100;
    }
    else if (offset > 0 || isCurrentItemLast && nextIndex === -1) {
      newTransformPos = currTransformContent + (1/3) * -100;
    }
    else {
      newTransformPos = currTransformContent + (1/3) * 100;
    }

    if (time > 0) {
      let transitionProperty = 'transform ' + transitionTime/1000 + 's';
      this.lock();
      this.newSlammer.classList.add('slammer-transitioning');
      setTransition(this.newSlammer, transitionProperty)

      // TODO - call this function when the transition end event fires instead of using setTimeout
      // (although, transitionend event has spotty browser support...)
      window.setTimeout(() => {

        this.newSlammer.classList.remove('slammer-transitioning');
        setTransition(this.newSlammer, 'transform 0s')

        this
          .injectNewSurroundingSlides(currIndex, nextIndex)
          .unlock();

      }, transitionTime);

    } 
    else if (time < 0){
      this.curr = 0;
    }

    setTransform(this.newSlammer, "translateX(" + newTransformPos + "%)")
    return this;
  }

  acceptHammers() {
    let hammer = new Hammer(this.newSlammer);

    hammer.on('swipe', (e) => {
      if (this.isLocked) return;

      if (e.direction === 2) {
        this.advance();
      }
      if (e.direction === 4) {
        this.retreat();
      }
    });

    hammer.on('tap', (e) => {
      if (this.isLocked()) return;

      this.advance();
    })

    return this;
  }


  /* Initializes a new slammer. */
  slam(wrapperElt) {

    if (this.slides.length < 2) return;

    // create new, three-slide slammer out of curr, prev, and next
    this.newSlammer = newDiv();
    this.newSlammer.classList.add('slam-items');

    this.prevSlide = newDiv();
    this.currSlide = newDiv();
    this.nextSlide = newDiv();

    let slides = [this.prevSlide, this.currSlide, this.nextSlide];

    slides.forEach((slide, i) => {

      this.newSlammer.appendChild(slide);

      let origSlideIndex = i - 1 >= 0 ? i - 1 : this.slides.length - 1; // why?

      let origSlide = this.slides[origSlideIndex];

      slide.innerHTML = origSlide.innerHTML;
      mergeClassList(slide, origSlide);
      mergeStyles(slide, origSlide);
    });


    this.wrapper = wrapperElt.parentNode;
    this.wrapper.removeChild(wrapperElt);
    this.wrapper.appendChild(this.newSlammer);

    setTransform(this.newSlammer, "translateX(0%)");

    this
      .transformTo(-1, 0, -1)
      .acceptHammers()
      .createNav()
      .unlock();

    return;
  }

  // Make sure that index is in our slide range
  indexify(index) {
    while (index < 0) index += this.slides.length;
    return index % this.slides.length;
  }

  getSlideHTML(index) {
    return this.slides[index].innerHTML;
  }

  // The `lock` interface.
  lock() {
    this.locked = true;
    return this;
  }

  unlock() {
    this.locked = false;
    return this;
  }

  isLocked() {
    return this.locked;
  }
}

module.exports = Slammer;