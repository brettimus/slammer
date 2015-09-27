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
const getTransformPercentAsNumber = require("./utils").getTransformPercentAsNumber;
const toArray        = require("./utils").toArray;

const transitionTime = 450;

class Slammer {

  constructor(wrapperElt, options) {

    let defaults = {
      transitionTime: 450,
    };
    
    this.options = extend({}, defaults, options);
    this.slides  = toArray(wrapperElt.children);

    // Set the global lock 
    // * The lock helps to short circuit event handlers if a transition is in progress.
    this.lock();

    this.curr = 0;
    this.prev = this.indexify(-1);
    this.next = 1;

    this.nav = null; // Populated by `createNav`

    if (this.slides.length < 2) return; // This used to be in the `slam` method

    this.triptych = new SlammerTriptych(this.slides);

    this.wrapper = wrapperElt.parentNode;
    this.wrapper.removeChild(wrapperElt);
    this.wrapper.appendChild(this.triptych.root);


    this
      .transformTo(-1, 0, -1)
      .acceptHammers()
      .createNav()
      .unlock();

  }

  createNav() {
    let options = this.options;
    this.nav = new SlammerNav(this, options);
    this.wrapper.appendChild(this.nav.elt);
    return this;
  }

  relativeTransition(offset) {
    if (offset === 0) return;

    let nextIndex = this.curr + offset;
    this.specialTransition(nextIndex);
  }

  specialTransition(newIndex) {
    // 1. inject contents of newIndex into Next slide
    let newContent = this.slides[newIndex].innerHTML;
    this.triptych.nextSlide.innerHTML = newContent;

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

  // TODO - move a variant of this to triptych
  injectNewSurroundingSlides(currIndex, newIndex) {
    newIndex        = this.indexify(newIndex);
    const nextIndex = this.indexify(newIndex + 1);
    const prevIndex = this.indexify(newIndex - 1);

    // Update current index
    this.curr = newIndex;

    // Update current, next, and prev slides
    this.triptych
        .current(this.getSlideHTML(newIndex))
        .next(this.getSlideHTML(nextIndex))
        .prev(this.getSlideHTML(prevIndex));

    // Apply transforms to slides
    this.transformTo(newIndex, 0, 0); // This should be on the triptych... but we've other things to do before that.
    this.nav.update(this.curr);

    return this;
  }

  transformTo(currIndex, nextIndex, time) {

    let currTransformContent =  this.triptych.translateXPercent();

    let offset = nextIndex - currIndex;
    let isCurrentItemLast = currIndex === this.slides.length - 1;

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

  acceptHammers() {
    let hammer = new Hammer(this.triptych.root);

    hammer.on('swipe', (e) => {
      if (this.isLocked()) return;
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

  // Makes sure that a given index is in the slide range
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