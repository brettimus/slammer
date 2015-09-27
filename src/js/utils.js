module.exports = {
    extend: extend,
    mergeClassList: mergeClassList,
    mergeStyles: mergeStyles,
    newDiv: newDiv,
    toArray: toArray,
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

/* Coerces array-like object into an array */
function toArray(elt) {
  return [].slice.call(elt, 0);
}