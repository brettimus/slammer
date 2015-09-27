// NYI
// This should replace the "newSlammer" property in slammer

const mergeClassList = require("./utils").mergeClassList;
const mergeStyles    = require("./utils").mergeStyles;
const newDiv         = require("./utils").newDiv;

const translationConstant = (1/3) * 100;

class SlammerTriptych {
  constructor(wrapper, baseSlides, options) {

    this.transitionClassName = options.transitionClassName;
    this.transitionTime = options.transitionTime;

    this
      .setRoot('slam-items')
      .transform("translateX(0%)")
      .slides()
      .forEach((slide, i) => {

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

  slides() {
    this.prevSlide = this.prevSlide || newDiv();
    this.currSlide = this.currSlide || newDiv();
    this.nextSlide = this.nextSlide || newDiv();
    return [this.prevSlide, this.currSlide, this.nextSlide];
  }

  center() {
    this.translateXPercent(-translationConstant)
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

    let transitionEnd = () => {
      this
        .removeClass(this.transitionClassName)
        .transition('transform 0s')
        .injectHTML(html)
        .center();
      if (callback) callback();
    };

    setTimeout(transitionEnd, this.transitionTime);
    return this;
  }

  injectHTML(html) {
    this
      .current(html.curr)
      .next(html.next)
      .prev(html.prev);

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

  direction(offset) {
    return offset > 0 ? -1 : 1;
  }
}

module.exports = SlammerTriptych;