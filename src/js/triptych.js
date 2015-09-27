const Hammer = require('hammerjs');

const extend         = require("./utils").extend;
const mergeClassList = require("./utils").mergeClassList;
const mergeStyles    = require("./utils").mergeStyles;
const newDiv         = require("./utils").newDiv;

const translationConstant = (1/3) * 100;

let defaults = require("./defaults").triptych;

class SlammerTriptych {
  constructor(wrapper, baseSlides, options) {

    this.options = extend({}, defaults, options);

    this.triptychClassName   = this.options.triptychClassName;
    this.transitionClassName = this.options.transitionClassName;
    this.transitionTime      = this.options.transitionTime;

    this
      .setRoot()
      .setSlides()
      .hammer(new Hammer(this.root))
      .transform("translateX(0%)")
      .forEachSlide((slide, i) => {

        this.root.appendChild(slide);

        // ?? TODO - cleanup ?? 
        let origSlideIndex = i - 1 >= 0 ? i - 1 : baseSlides.length - 1;
        let origSlide      = baseSlides[origSlideIndex];

        slide.innerHTML = origSlide.innerHTML;
        mergeClassList(slide, origSlide);
        mergeStyles(slide, origSlide);
      });

    wrapper.appendChild(this.root);
    this.center();
  }

  addClass(className) {
    this.root.classList.add(className)
    return this;
  }

  center() {
    this.translateXPercent(-translationConstant)
    return this;
  }

  current(html) {
    if (!arguments.length) return this.currSlide.innerHTML;
    this.currSlide.innerHTML = html;
    return this
  }

  direction(offset) {
    return offset > 0 ? -1 : 1;
  }

  forEachSlide(fun) {
    let slides = [this.prevSlide, this.currSlide, this.nextSlide];
    slides.forEach(fun, this)
    return this;
  }

  hammer(value) {
    if (!arguments.length) return this._hammer;
    this._hammer = value;
    return this;
  }


  injectHTML(html) {
    this
      .current(html.curr)
      .next(html.next)
      .prev(html.prev);

    return this;
  }

  next(html) {
    if (!arguments.length) return this.nextSlide.innerHTML;
    this.nextSlide.innerHTML = html;
    return this
  }

  prev(html) {
    if (!arguments.length) return this.prevSlide.innerHTML;
    this.prevSlide.innerHTML = html;
    return this
  }

  removeClass(className) {
    this.root.classList.remove(className)
    return this;
  }

  setRoot() {
    this.root = newDiv()
    this.root.classList.add(this.triptychClassName);
    return this;
  }

  setSlides() {
    this.prevSlide = newDiv();
    this.currSlide = newDiv();
    this.nextSlide = newDiv();
    return this;
  }

  slide(offset, html, callback) {
    if (offset === 0) return;
    if (offset < -1) this.prev(html.curr);
    if (offset > 1)  this.next(html.curr);

    let direction = this.direction(offset);
    let translation = this.translateXPercent() + direction * translationConstant;

    this
      .addClass(this.transitionClassName)
      .transition('transform ' + this.transitionTime/1000 + 's')
      .translateXPercent(translation);

    let afterTransition = () => {
      this
        .removeClass(this.transitionClassName)
        .transition('transform 0s')
        .injectHTML(html)
        .center();
      if (callback) callback();
    };

    setTimeout(afterTransition, this.transitionTime);
    return this;
  }

  swipe(callback) {
    this.hammer().on('swipe', (evt) => {
      if (evt.direction === 2)
        callback(-1);
      if (evt.direction === 4)
        callback(1);
    });
    return this;
  }

  tap(callback) {
    this.hammer().on('tap', callback)
    return this;
  }

  transform(value) {
    if (!arguments.length) return this.root.style.transform;
    this.root.style.WebkitTransform = value;
    this.root.style.transform       = value;
    return this;
  }

  translateXPercent(value) {
    // Extracts translation percentage
    if (!arguments.length) {
        return parseFloat(this.transform().split('(')[1].split('%')[0]);        
    }
    return this.transform("translateX(" + value + "%)")
  }

  transition(value) {
    if (!arguments.length) return this.root.style.transition;
    this.root.style.WebkitTransition = value;
    this.root.style.transition       = value;
    return this;
  }
}

module.exports = SlammerTriptych;