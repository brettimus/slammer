module.exports = {
    extend: extend,
};

/*
 * My shitty replacement for Object.assign
 */
function extend() {
  if (!arguments.length) return;

  let args = [].slice.call(arguments, 0);
  let result = args.unshift();

  args.forEach(function(o) {
    for (let prop in o)
      if (o.hasOwnProperty(prop))
        result[prop] = o[prop];
  });
}