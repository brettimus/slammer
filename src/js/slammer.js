"use strict";

/*** NOTES ***
 *
 * Slammer should have a Nav and a Triptych
 * 
 * For each transition, the Triptych is injected with information about the new slides.
 *
 */

const SlammerNav      = require('./nav');
const SlammerTriptych = require('./triptych');

const extend         = require('./utils').extend;
const isNumeric      = require('./utils').isNumeric;
const toArray        = require('./utils').toArray;

class Slammer {

  constructor(wrapperElt, options) {

    let defaults = {
      startingIndex: 0,
      transitionTime: 450,
      transitionClassName: 'slammer-transitioning',
    };
    
    this.options = extend({}, defaults, options);
    this.slides  = toArray(wrapperElt.children);

    if (this.slides.length < 2) return; // This used to be in the `slam` method. Could probably remove or modify.

    this
      .lock()        // The lock helps to short circuit event handlers if a transition is in progress.
      .currentIndex(this.options.startingIndex)
      .wrapper(wrapperElt)
      .triptych(new SlammerTriptych(this.wrapper(), this.slides, this.options))
      .nav(new SlammerNav(this.wrapper(), this.slides, this.options))
      .unlock();
  }

  triptych(value) {
    if (!arguments.length) return this._triptych;
    value
      .swipe(this.swipeHandler.bind(this))
      .tap(this.tapHandler.bind(this));
    this._triptych = value;
    return this;
  }

  swipeHandler(direction) {
      if (this.isLocked()) return;
      if (direction > 0) this.advance();
      if (direction < 0) this.retreat();
  }

  tapHandler() {
    if (this.isLocked()) return;
    this.advance();
  }

  wrapper(elt) {
    if (!arguments.length) return this._wrapper;
    this._wrapper = elt.parentNode;
    this._wrapper.removeChild(elt);
    return this;
  }

  nav(value) {
    if (!arguments.length) return this._nav;
    value.click(this.navEltHandler.bind(this))
    this._nav = value;
    return this;
  }

  navEltHandler(index) {
    if (this.isLocked()) return;
    if (isNumeric(index)) {
      this.transformTo(index);
    }
    else {
      // This means the list container was clicked, but no specific list item was clicked
    }
  }

  updateNav() {
    this.nav().update(this.currentIndex());
    return this;
  }

  relativeTransition(offset) {
    if (offset === 0) return;
    return this.transformTo(this.currentIndex() + offset);
  }

  retreat() {
    return this.relativeTransition(-1);
  }

  advance() {
    return this.relativeTransition(1);
  }

  transformTo(nextIndex) {
    nextIndex = this.indexify(nextIndex);
    let offset = nextIndex - this.currentIndex();
    if (offset === 0) return;

    let html = {
      prev: this.getSlideHTML(nextIndex - 1),
      curr: this.getSlideHTML(nextIndex),
      next: this.getSlideHTML(nextIndex + 1),
    };

    let callback = () => {
      this
        .unlock()
        .currentIndex(nextIndex)
        .updateNav();
    };

    this
      .lock()
      .triptych()
        .slide(offset, html, callback.bind(this));

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