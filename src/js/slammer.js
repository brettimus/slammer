"use strict";

const SlammerNav      = require('./nav');
const SlammerTriptych = require('./triptych');

const extend         = require('./utils').extend;
const isNumeric      = require('./utils').isNumeric;
const toArray        = require('./utils').toArray;

let defaults = require('./defaults').slammer;

class Slammer {

  constructor(wrapperElt, options) {
    if (wrapperElt.children.length < 2) {
      throw new Error("The wrapping element must have at least two children in order to SLAM!");
    }

    this.options       = extend({}, defaults, options);
    this.hasNav        = this.options.nav;
    this.startingIndex = this.options.startingIndex;

    this.slides        = toArray(wrapperElt.children); // TODO - abstract the idea of a `slide`

    this
      .lock() // See note on lock method
      .currentIndex(this.startingIndex)
      .wrapper(wrapperElt)
      .triptych(new SlammerTriptych(this.wrapper(), this.slides, this.options))
      .unlock();

    if (this.hasNav) {
      this.nav(new SlammerNav(this.wrapper(), this.slides, this.options))      
    }
  }

  wrapper(elt) {
    if (!arguments.length) return this._wrapper;
    this._wrapper = elt.parentNode;
    this._wrapper.removeChild(elt);
    return this;
  }

  /*** triptych-related ***/
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

  /*** nav-related ***/
  nav(value) {
    if (!arguments.length) return this._nav;
    value.tap(this.navTapHandler.bind(this))
    this._nav = value;
    return this;
  }

  navTapHandler(index) {
    if (this.isLocked()) return;
    if (isNumeric(index)) {
      this.transformTo(index);
    }
    else {
      // This means the list container was clicked, but no specific list item was clicked
    }
  }

  updateNav() {
    if (!this.hasNav) return this;
    this.nav().update(this.currentIndex());
    return this;
  }


  /*** transition related ***/
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

  /*** slide-accessor helpers ***/
  currentIndex(value) {
    if (!arguments.length) return this.curr;
    this.curr = this.indexify(value);
    return this;
  }

  getSlideHTML(index) {
    index = this.indexify(index);
    return this.slides[index].innerHTML;
  }

  indexify(index) {
    // Makes sure that a given index is in the slide range
    while (index < 0) index += this.slides.length;
    return index % this.slides.length;
  }

  /*** lock-related ***/
  /*** The lock helps to short circuit event handlers if a transition is in progress. ***/
  isLocked() {
    return this.locked;
  }

  lock() {
    this.locked = true;
    return this;
  }

  unlock() {
    this.locked = false;
    return this;
  }

}

module.exports = Slammer;