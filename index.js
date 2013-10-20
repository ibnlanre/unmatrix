/**
 * Module dependencies
 */

var style = require('computed-style');
var prefix = require('prefix');

/**
 * Expose `unmatrix` and helpers
 */

module.exports = exports = unmatrix;
exports.decompose = decompose;
exports.parse = parse;

/**
 * Unmatrix
 *
 * @param {Element} el
 * @return {Object}
 */

function unmatrix(el) {
  var prop = style(el)[prefix('transform')];
  var matrix = parse(prop);
  return decompose(matrix);
}

/**
 * Unmatrix: parse the values of the matrix
 *
 * Algorithm from:
 *
 * - http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp
 *
 * @param {Array} m (matrix)
 * @return {Object}
 * @api private
 */

function decompose(m) {
  var A = m[0];
  var B = m[1];
  var C = m[2];
  var D = m[3];
  var determinant = A * D - B * C;

  // step(1)
  if (!determinant) throw new Error('transform#unmatrix: matrix is singular');

  // step (3)
  var scaleX = Math.sqrt(A * A + B * B);
  A /= scaleX;
  B /= scaleX;

  // step (4)
  var skew = A * C + B * D;
  C -= A * skew;
  D -= B * skew;

  // step (5)
  var scaleY = Math.sqrt(C * C + D * D);
  C /= scaleY;
  D /= scaleY;
  skew /= scaleY;

  // step (6)
  if (determinant < 0) {
    A = -A;
    B = -B;
    skew = -skew;
    scaleX = -scaleX;
  }

  return {
    translateX: m[4],
    translateY: m[5],
    rotate: rtod(Math.atan2(B, A)),
    skew: rtod(Math.atan(skew)),
    scaleX: round(scaleX),
    scaleY: round(scaleY)
  };
}

/**
 * String to matrix
 *
 * @param {String} style
 * @return {Array}
 * @api private
 */

function parse(str) {
  var m = str.slice(7).match(/[\d\.\-]+/g);
  if (!m) return [1, 0, 0, 1, 0, 0]
  return m.length == 6
    ? m.map(Number)
    : [
        +m[0] , +m[1],
        +m[4] , +m[5],
        +m[12], +m[13]
      ];
}

/**
 * Radians to degrees
 *
 * @param {Number} radians
 * @return {Number} degrees
 * @api private
 */

function rtod(radians) {
  var deg = radians * 180 / Math.PI;
  return round(deg);
}

/**
 * Round to the nearest hundredth
 *
 * @param {Number} n
 * @return {Number}
 * @api private
 */

function round(n) {
  return Math.round(n * 100) / 100;
}
