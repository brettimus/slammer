"use strict";

/*** NOTES ***
 *
 * Slammer should have a Nav and a Triptych
 * 
 * For each transition, the Triptych should be injected with information about the new slides
 * I.e.,
 *   The Slammer should tell the Triptych how to update itself,
 *     then the Slammer should tell the triptych to transition.
 *
 */

const Hammer          = require('hammerjs');
const SlammerNav      = require("./nav");
const SlammerTriptych = require("./triptych");

const extend         = require('./utils').extend;
const toArray        = require("./utils").toArray;

class Slammer {

  constructor(wrapperElt, options) {

    let defaults = {
      transitionTime: 450,
    };
    
    this.options = extend({}, defaults, options);
    this.slides  = toArray(wrapperElt.children);

    if (this.slides.length < 2) return; // This used to be in the `slam` method. Could probably remove or modify.

    this
      .lock()        // * The lock helps to short circuit event handlers if a transition is in progress.
      .currIndex(0)
      .prevIndex(-1)
      .nextIndex(1)
      .setTriptych(new SlammerTriptych(this.slides, this.options))
      .setWrapper(wrapperElt)
      .transformTo(-1, 0, -1) // The third argument is time. It being negative signifies something. 
      .acceptHammers(new Hammer(this.triptych.root))
      .createNav(new SlammerNav(this, this.options))
      .unlock();

  }

  setTriptych(value) {
    this.triptych = value;
    return this;
  }

  // TODO - get rid of setWrapper and createNav
  // (notice how they are the only ones that use `this.wrapper`)
  setWrapper(elt) {
    this.wrapper = elt.parentNode;
    this.wrapper.removeChild(elt);
    this.wrapper.appendChild(this.triptych.root);
    return this;
  }

  createNav(value) {
    this.nav = value;
    return this;
  }

  relativeTransition(offset) {
    if (offset === 0) return;

    let nextIndex = this.curr + offset;
    return this.specialTransition(nextIndex);
  }

  specialTransition(newIndex) {
    // 1. inject contents of newIndex into Next slide
    let newContents = this.getSlideHTML(newIndex);
    if (newIndex < this.curr) {
      this.triptych.prev(newContents)
    }
    else {
      this.triptych.next(newContents);
    }

    // 2. transformTo(nextIndex)
    window.setTimeout(() => {
      this.transformTo(this.curr, newIndex, this.options.transitionTime);
    }, 10);
  }

  retreat() {
    let newIndex = this.curr - 1;
    this.transformTo(this.curr, newIndex, this.options.transitionTime);
  }

  advance() {
    let newIndex = this.curr + 1;
    this.transformTo(this.curr, newIndex, this.options.transitionTime);
  }

  // TODO - move a variant of this to triptych
  injectNewSurroundingSlides(currIndex, newIndex) {

    // Update current index
    // Update current, next, and prev slides
    this
      .currentIndex(newIndex)
      .triptych
        .current(this.getSlideHTML(newIndex))
        .next(this.getSlideHTML(newIndex + 1))
        .prev(this.getSlideHTML(newIndex - 1));

    // Apply transforms to slides
    this
      .transformTo(newIndex, 0, 0) // This method really should be on the triptych... and it should probably take a callback (for the locking, unlocking thing)
      .nav
        .update(this.currentIndex());

    return this;
  }

  transformTo(currIndex, nextIndex, time) {

    let currTransformContent =  this.triptych.translateXPercent();

    let offset = nextIndex - currIndex;
    let isCurrentItemLast = (currIndex === this.slides.length - 1);

    let transitionTime = this.options.transitionTime;

    if (nextIndex === -1) debugger; /* ?? What causes this case ?? I couldn't trigger it. (BB) */

    let newTransformPos;
    if (time <= 0) { // What is this case for? It seems to have a special meaning
      newTransformPos = (1/3) * -100;
    }
    else if (offset > 0 || isCurrentItemLast && nextIndex === -1) {
      newTransformPos = currTransformContent + (1/3) * -100;
    }
    else {
      newTransformPos = currTransformContent + (1/3) * 100;
    }

    if (time > 0) {

      let transitionClassName = 'slammer-transitioning';
      let transitionProperty = 'transform ' + transitionTime/1000 + 's';

      this
        .lock()
        .triptych
          .addClass(transitionClassName)
          .transition(transitionProperty);

      // TODO - call this function when the transition end event fires instead of using setTimeout
      // (although, transitionend event has spotty browser support...)
      window.setTimeout(() => {

        this.triptych
          .removeClass(transitionClassName)
          .transition('transform 0s');

        this
          .injectNewSurroundingSlides(currIndex, nextIndex)
          .unlock();

      }.bind(this), transitionTime);

    } 
    else if (time < 0){ // ?? When is this case reached?
      this.curr = 0;
    }

    this.triptych.translateXPercent(newTransformPos)
    return this;
  }

  acceptHammers(hammer) {
    hammer.on('swipe', (e) => {
      if (this.isLocked())
        return;
      if (e.direction === 2)
        this.advance();
      if (e.direction === 4)
        this.retreat();
    });

    hammer.on('tap', (e) => {
      if (this.isLocked()) return;
      this.advance();
    })

    return this;
  }

  currentIndex(value) {
    return this.currIndex.apply(this, arguments);
  }

  currIndex(value) {
    if (!arguments.length) return this.curr;
    this.curr = this.indexify(value);
    return this;
  }

  prevIndex(value) {
    if (!arguments.length) return this.prev;
    this.prev = this.indexify(value);
    return this;
  }

  nextIndex(value) {
    if (!arguments.length) return this.next;
    this.next = this.indexify(value);
    return this;
  }

  // Makes sure that a given index is in the slide range
  indexify(index) {
    while (index < 0) index += this.slides.length;
    return index % this.slides.length;
  }

  getSlideHTML(index) {
    index = this.indexify(index);
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