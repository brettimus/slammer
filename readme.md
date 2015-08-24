#Come on and slam

Slammer is a lightweight (at least it tries to be) slider written in vanilla JS with [Hammer](http://hammerjs.github.io/) to provide touch support.


##Getting started

If you just want to use it, all you need is `slammer.js` and `hammer.js`.

If you want to dev with it:

- `npm install`
- in top level: `grunt watch`
- in top level: `http-server`
- ???
- profit

##"Options"
Someday, these will be configurable defaults, but for now they're set in stone:

- Slideshow expands to fill 100% of its container's width
- One slide is visible at once
- There is a nav

###Future plans
- detecting load of injected slides and not using a timeout to perform nonadjacent slide transformations
- load subset of Hammer instead of the entire thing
