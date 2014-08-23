# deps-normalize

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

This module used to normalize `require` and `expect` properties in BEM object.

## Usage

```js

var normalize = require('deps-normalize');

normalize(undefined);               // []
normalize({ block: 'block' });      // [ { block: 'block' } ]
normalize({ elem: 'elem' });        // [ { elem: 'elem' } ]

// See more examples in tests
```

## API

### normalize(dependencies)

Runs normalization of dependencies. Returns array of normalized dependencies.

## Normalization

Dependencies should contain [deps objects](http://bem.info/tools/bem/bem-tools/depsjs/). We do not support full specification. Those objects are equivalents of BEM objects, but with additional properties, that reduces boilerplate code. After they are normalized, they can be converted to BEM objects.

 * `elems` - contains `Array` of `String` (if it contains `String` it will be wrapped in array).
 * `mods` - contains `Object` with keys as modificators names and values as modificators values. Values can be `String` or `Array` of `String`.

If deps object contain `elems` or `mods` it will be splitted in multiple BEM objects. It will not take multiplication of `elems` and `mods`, if both are present in deps object. Instead it will be interpretated as two deps objects: one with `elems` and other with `mods`.

```js
normalize({ elems: ['e1', 'e2'], mods: {m1: 1, m2: [2, 3]} });

// [
//     { block: 'b', elem: 'e1' },
//     { block: 'b', elem: 'e2' },
//     { block: 'b', mod: 'm1', val: 1 },
//     { block: 'b', mod: 'm2', val: 2 },
//     { block: 'b', mod: 'm2', val: 3 }
// ]
```

`level`, `block`, `elem`, `mod` and `value` properties will be taken from current processing object.

__Note:__ you can not have `elem` with `elems` in one deps object (same applies to `mod` and `mods`).

## License

MIT (c) 2014 Vsevolod Strukchinsky

[npm-url]: https://npmjs.org/package/deps-normalize
[npm-image]: http://img.shields.io/npm/v/deps-normalize.svg?style=flat

[travis-url]: http://travis-ci.org/floatdrop/deps-normalize
[travis-image]: http://img.shields.io/travis/floatdrop/deps-normalize.svg?branch=master&style=flat

[depstat-url]: https://david-dm.org/floatdrop/deps-normalize
[depstat-image]: http://img.shields.io/david/floatdrop/deps-normalize.svg?style=flat

[coveralls-url]: https://coveralls.io/r/floatdrop/deps-normalize
[coveralls-image]: http://img.shields.io/coveralls/floatdrop/deps-normalize.svg?style=flat
