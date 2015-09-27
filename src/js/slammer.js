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
      startingIndex: 0,
      transitionTime: 450,
      transitionClassName: 'slammer-transitioning',
    };
    
    this.options = extend({}, defaults, options);
    this.slides  = toArray(wrapperElt.children);

    if (this.slides.length < 2) return; // This used to be in the `slam` method. Could probably remove or modify.

    this
      .lock()        // * The lock helps to short circuit event handlers if a transition is in progress.
      .currentIndex(this.options.startingIndex)
      .setWrapper(wrapperElt)
      .triptych(new SlammerTriptych(this.wrapper, this.slides, this.options))
      .createNav(new SlammerNav(this, this.options))
      .acceptHammers(new Hammer(this.triptych().root))
      .unlock();

  }

  triptych(value) {
    if (!arguments.length) return this._triptych;
    this._triptych = value;
    return this;
  }

  // TODO - get rid of setWrapper and createNav
  // (notice how they are the only ones that use `this.wrapper`)
  setWrapper(elt) {
    this.wrapper = elt.parentNode;
    this.wrapper.removeChild(elt);
    return this;
  }

  createNav(value) {
    this.nav = value;
    return this;
  }

  updateNav() {
    this.nav.update(this.currentIndex());
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