// NYI
// This should replace the "newSlammer" property in slammer

const mergeClassList = require("./utils").mergeClassList;
const mergeStyles    = require("./utils").mergeStyles;
const newDiv         = require("./utils").newDiv;

class SlammerTriptych {
  constructor(baseSlides) {

    this
      .setRoot('slam-items')
      .transform("translateX(0%)");

    this.prevSlide = newDiv();
    this.currSlide = newDiv();
    this.nextSlide = newDiv();

    let slides = [this.prevSlide, this.currSlide, this.nextSlide];
    slides.forEach((slide, i) => {

      this.root.appendChild(slide);

      let origSlideIndex = i - 1 >= 0 ? i - 1 : baseSlides.length - 1; // why?

      let origSlide = baseSlides[origSlideIndex];

      slide.innerHTML = origSlide.innerHTML;
      mergeClassList(slide, origSlide);
      mergeStyles(slide, origSlide);
    });
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

  transition(value) {
    if (!arguments.length) return this.root.style.transition;
    this.root.style.WebkitTransition = value;
    this.root.style.transition       = value;
    return this;
  }

}

module.exports = SlammerTriptych;