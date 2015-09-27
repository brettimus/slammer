// NYI
// This should replace the "newSlammer" property in slammer

const mergeClassList = require("./utils").mergeClassList;
const mergeStyles    = require("./utils").mergeStyles;
const newDiv         = require("./utils").newDiv;

class SlammerTriptych {
  constructor(baseSlides) {

    this.root = newDiv(); // More expressive name?
    this.root.classList.add('slam-items');

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


}

module.exports = SlammerTriptych;