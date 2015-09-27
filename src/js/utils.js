module.exports = {
    extend: extend,
    getTransformPercentAsNumber: getTransformPercentAsNumber,
    mergeClassList: mergeClassList,
    mergeStyles: mergeStyles,
    newDiv: newDiv,
    setTransform: setTransform,
    setTransition: setTransition,
};

/*
 * My shitty replacement for Object.assign
 */
function extend() {
  if (!arguments.length) return;

  let args = [].slice.call(arguments, 0);
  let result = args.shift();

  args.forEach(function(o) {
    for (let prop in o)
      if (o.hasOwnProperty(prop))
        result[prop] = o[prop];
  });

  return result;
}

/*
 * Parses a transform string and extracts the percentage by which it has been translated.
 */
function getTransformPercentAsNumber(transform) {
  return parseFloat(transform.split('(')[1].split('%')[0]);
}

/*
 * Sets transform property on given elt
 */
function setTransform(elt, transform) {
  elt.style.WebkitTransform = transform;
  elt.style.transform       = transform;
}

/*
 * Sets transition property on given elt
 */
function setTransition(elt, transition) {
  elt.style.WebkitTransition = transition;
  elt.style.transition       = transition;
}

/*
 * Merges all classes from elt2 into elt1 
 */
function mergeClassList(elt1, elt2) {
  [].forEach.call(elt2.classList, (className) => {
    elt1.classList.add(className);
  })
}

/*
 * Merges all styles from elt2 into elt1 
 */
function mergeStyles(elt1, elt2) {
  for (let prop in elt2.style) {
    if (elt2.style.hasOwnProperty(prop)) {
      if (elt2.style[prop] && elt2.style[prop].length) { // Don't copy over blank style rules
        elt1.style[prop] = elt2.style[prop];        
      }
    }
  }
}

function newDiv() {
  return document.createElement('div');
}