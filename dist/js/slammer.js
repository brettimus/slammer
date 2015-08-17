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

    this.slam();
  }

  // Create Slammers out of all elts with this class.

  _createClass(Slammer, [{
    key: "setActiveItem",
    value: function setActiveItem(item) {
      item.classList.add(activeSlideClass);
    }

    /*
    Initializes a new slammer.
     */
  }, {
    key: "slam",
    value: function slam() {

      // set first slide active.
      this.setActiveItem(this.slides[0]);

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
