// NYI
// This should replace the "newSlammer" property in slammer

const mergeClassList = require("./utils").mergeClassList;
const mergeStyles    = require("./utils").mergeStyles;
const newDiv         = require("./utils").newDiv;

class SlammerTriptych {
  constructor(baseSlides, options) {

    this.transitionClassName = options.transitionClassName;
    this.transitionTime = options.transitionTime;

    this
      .setRoot('slam-items')
      .transform("translateX(0%)");

    this.prevSlide = newDiv();
    this.currSlide = newDiv();
    this.nextSlide = newDiv();

    this.slides().forEach((slide, i) => {

      this.root.appendChild(slide);

      let origSlideIndex = i - 1 >= 0 ? i - 1 : baseSlides.length - 1; // why?
      let origSlide = baseSlides[origSlideIndex];

      slide.innerHTML = origSlide.innerHTML;
      mergeClassList(slide, origSlide);
      mergeStyles(slide, origSlide);
    });
  }

  slides() {
    return [this.prevSlide, this.currSlide, this.nextSlide];
  }

  holdSteady() {
    let newTransformPos = (1/3) * -100;
    this.translateXPercent(newTransformPos)
    return this;
  }

  slide(direction, html, callback) {
    let translation = this.translateXPercent() + direction * (1/3) * 100;
    this
      .addClass(this.transitionClassName)
      .transition('transform ' + this.transitionTime/1000 + 's')
      .translateXPercent(translation);

    window.setTimeout(() => {
      this
        .removeClass(this.transitionClassName)
        .transition('transform 0s')
        .injectHTML(html)
        .holdSteady();

      if (callback) callback();
    }, this.transitionTime);
    return this;
  }

  injectHTML(vals) {
    this
      .current(vals.curr)
      .next(vals.next)
      .prev(vals.prev);

    return this;
  }

  current(html) {
    if (!arguments.length) return this.currSlide.innerHTML;
    this.currSlide.innerHTML = html;
    return this
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

  setRoot(className) {
    this.root = newDiv()
    this.root.classList.add(className);
    return this;
  }

  addClass(className) {
    this.root.classList.add(className)
    return this;
  }

  removeClass(className) {
    this.root.classList.remove(className)
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