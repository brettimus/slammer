# Come on and [slam](https://www.youtube.com/watch?v=3_vz-DzVm4I)

Slammer is a vanilla, lightweight, and touch-friendly 
slider written with [Hammer](http://hammerjs.github.io/).

## Usage

If you just want to use it, all you need is `slammer.js` and `hammer.js`. 
And example index page is included in this repository.

## Development

If you want to dev with it:

- `npm install`
- in top level: `grunt watch`
- ???
- profit


## Options
Slammer comes with configurable defaults _**free of charge**_!

### `startingIndex: 0` 
The slide on which `Slammer` should start.

### `transitionTime: 450`
The transition duration.

### `transitionClassName: 'slammer-transitioning'`
The class assigned to the parent element of images _while they are transitioning_.

### `nav: true`
If falsey, omits the nav.

### `navClass: 'slam-nav-wrap'`
The class assigned to the nav.

### `navItemClass: 'slam-nav-item'`
The class assigned to the nav items.

### `navItemActiveClass: 'slam-nav-active'`
The class assigned to the active nav item.

## Planned Options
Someday, these will be configurable defaults, but for now they're set in stone:

- Slideshow expands to fill 100% of its container's width
- One slide is visible at once
- ~There is a nav~

## Future plans
- ~detecting load of injected slides and not using a timeout to perform nonadjacent slide transformations~
- load subset of Hammer instead of the entire thing

## _Boots's notes_
I'll move these somewhere else sometime soon I promise.

- Compass hangs on my machine. See: https://github.com/gruntjs/grunt-contrib-compass/issues/204
- In general, the build is super slow for me. Is there a browserify transform for babel, or a babel transform for browserify? Could speed things up.
- ~Should add a `touchend` listener to the nav items as well~ Used `Hammer` instead! :heart: :hammer: :heart:

