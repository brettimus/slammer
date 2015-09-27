#Come on and [slam](https://www.youtube.com/watch?v=3_vz-DzVm4I)

Slammer is a lightweight (at least it tries to be) slider written in vanilla JS with [Hammer](http://hammerjs.github.io/) to provide touch support.


##Getting started

If you just want to use it, all you need is `slammer.js` and `hammer.js`.

If you want to dev with it:

- `npm install`
- in top level: `grunt watch`
- in top level: `http-server`
- ???
- profit

## "Options"
Someday, these will be configurable defaults, but for now they're set in stone:

- Slideshow expands to fill 100% of its container's width
- One slide is visible at once
- There is a nav

##Future plans
- ~detecting load of injected slides and not using a timeout to perform nonadjacent slide transformations~
- load subset of Hammer instead of the entire thing


## Boots's notes

- Compass hangs on my machine. See: https://github.com/gruntjs/grunt-contrib-compass/issues/204
- In general, the build is super slow for me. Is there a browserify transform for babel, or a babel transform for browserify? Could speed things up.
- ~Should add a `touchend` listener to the nav items as well~ Used `Hammer` instead! 


## Options

`startingIndex: 0`
`transitionTime: 450`
`transitionClassName: 'slammer-transitioning'`

`navClass: 'slam-nav-wrap'`
`navItemClass: 'slam-nav-item'`
`navItemActiveClass: 'slam-nav-active'`