#Come on and slam

Slammer is a lightweight (at least it tries to be) slider written in vanilla JS with [Hammer](http://hammerjs.github.io/) to provide touch support.


##Getting started

If you just want to use it, all you need is `slammer.js` and `hammer.js`. **Note: I think the prod-dist version of this should even have the option of one pre-concatenated file?**

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
- Slider is not able to handle text, etc. within each slide

## Thoughts

I might have this work by generating a completely new DOM based on the input. Then I could keep track of curr, prev, and next more dynamically and sizing the container would also be simpler.
