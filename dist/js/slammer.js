"use strict";

/*
STEPS:
1. set first image active
2. give images data attr for index
3. remember "current", "prev", "next" indices
4. on swipe or nav tap, hide items between oldCurrIndex and newCurrIndex, and then set newCurrIndex to currIndex
*/

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var activeSlideClass = "slam-item-active";

var Slammer = (function () {
  function Slammer(wrapperElt) {
    _classCallCheck(this, Slammer);

    this.wrapper = wrapperElt;
    this.slides = this.wrapper.children;
    this.curr = 0;
    this.prev = this.slides.length - 1;
    this.next = 1;
    this.newSlammer = null;

    this.slam();
  }

  // Create Slammers out of all elts with this class.

  _createClass(Slammer, [{
    key: "setActiveItem",
    value: function setActiveItem(item) {
      item.classList.add(activeSlideClass);
    }
  }, {
    key: "transformTo",
    value: function transformTo(position, time) {
      var transformPos = 0;
      if (position === "center") {
        transformPos = this.newSlammer.offsetWidth / -3;
      } else if (position === "next") {
        transformPos = this.newSlammer.offsetWidth * 2 / -3;
      }

      this.newSlammer.style.transform = "translateX(" + transformPos + "px)";
    }

    /*
    Initializes a new slammer.
     */
  }, {
    key: "slam",
    value: function slam() {

      // create new, three-slide slammer out of curr, prev, and next
      this.newSlammer = document.createElement('div');
      var prev = document.createElement('div');
      var curr = document.createElement('div');
      var next = document.createElement('div');

      var slides = [prev, curr, next];
      var origSlideCopies = [];

      for (var i = 0; i < this.slides.length; i++) {
        origSlideCopies.push(this.slides[i].innerHTML);
      }

      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.add('slam-item');
        this.newSlammer.appendChild(slides[i]);
        slides[i].innerHTML += origSlideCopies[i - 1 >= 0 ? i - 1 : origSlideCopies.length - 1];
      }

      var realWrapper = this.wrapper.parentNode;

      realWrapper.removeChild(this.wrapper);

      realWrapper.appendChild(this.newSlammer);

      this.newSlammer.classList.add('slam-items');

      this.transformTo("center", 0);

      return;
    }
  }]);

  return Slammer;
})();

var slammers = document.getElementsByClassName('slam-items');

for (var i = 0; i < slammers.length; i++) {
  var slammer = new Slammer(slammers[i]);
}
//# sourceMappingURL=slammer.js.map
