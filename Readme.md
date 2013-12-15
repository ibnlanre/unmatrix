
# unmatrix

  Parse and normalize the individual values of a css transform.
  Uses the same algorithm that Firefox uses to parse the transform string.
  Only parses the 2D transform attributes. This library is intentionally low-level
  and should probably be used within another library.

  If you'd like to parse 3D transforms take a look at:
  http://www.w3.org/TR/css3-transforms/#matrix-decomposing.

## Installation

  Install with [component(1)](http://component.io):

    $ component install matthewmueller/unmatrix

Then in you code:

```js
var parse = require('unmatrix')
```

## API

### parse(str)

Parse a CSS transformation matrix into its semantic components:

```js
parse('matrix(1 1.7320508075688772, -1.3680805733026749, 1.6304149381918094, 400, 200)') == {
  translateX: 400, // px
  translateY: 200, // px
  rotate: 60, // deg
  skew: 20, // deg
  scaleX: 2,
  scaleY: 2
}
```

## TODO

- support for 3D transforms
- tests would be nice

## License

  MIT
