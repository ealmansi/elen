/***
 * https://github.com/ealmansi/elen
 * Copyright (c) 2017 Emilio Almansi
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or http://www.opensource.org/licenses/mit-license.php.
 */

const MAX_EXPONENT = 2047
const MAX_MANTISSA = 4503599627370495

/**
 * Constructs a JavaScript number given the values for the sign, exponent,
 * and mantissa in its binary64 representation.
 * 
 * @param {object} - Object containing sign, exponent, and mantissa.
 * @throws {Error}
 */
function construct({ sign, exponent, mantissa }) {
  if (sign !== 0 && sign !== 1) {
    throw new Error(`Invalid value for sign: ${sign}.`)
  }
  if (typeof exponent !== 'number' || exponent < 0 || MAX_EXPONENT < exponent) {
    throw new Error(`Invalid value for exponent: ${exponent}.`)
  }
  if (typeof mantissa !== 'number' || mantissa < 0 || MAX_MANTISSA < mantissa) {
    throw new Error(`Invalid value for mantissa: ${mantissa}.`)
  }
  const buffer = new ArrayBuffer(8)
  const floatArray = new Float64Array(buffer)
  const intArray = new Uint8Array(buffer)
  setSign(sign, intArray)
  setExponent(exponent, intArray)
  setMantissa(mantissa, intArray)
  return floatArray[0]
}

/**
 * Returns an object with the values for the sign, exponent, and mantissa
 * in the binary64 representation of the number n.
 * 
 * @param {number} n - Number to deconstruct.
 * @returns {object}
 * @throws {Error}
 */
function deconstruct(n) {
  if (typeof n !== 'number') {
    throw new Error(`Value is not of type number: ${n}.`)
  }
  const buffer = new ArrayBuffer(8)
  const floatArray = new Float64Array(buffer)
  const intArray = new Uint8Array(buffer)
  floatArray[0] = n
  return {
    sign: getSign(intArray),
    exponent: getExponent(intArray),
    mantissa: getMantissa(intArray),
  }
}

function getSign(intArray) {
  return shiftRight(intArray[7], 7)
}

function setSign(sign, intArray) {
  intArray[7] |= shiftLeft(sign, 7)
}

function getExponent(intArray) {
  let r = 0
  r += shiftLeft(intArray[7] & 0x7F, 4)
  r += shiftRight(intArray[6], 4)
  return r
}

function setExponent(exponent, intArray) {
  intArray[7] |= shiftRight(exponent, 4)
  intArray[6] |= shiftLeft(exponent & 0xF, 4)
}

function getMantissa(intArray) {
  let r = 0
  r += shiftLeft(intArray[6] & 0x0F, 48)
  r += shiftLeft(intArray[5], 40)
  r += shiftLeft(intArray[4], 32)
  r += shiftLeft(intArray[3], 24)
  r += shiftLeft(intArray[2], 16)
  r += shiftLeft(intArray[1], 8)
  r += intArray[0]
  return r
}

function setMantissa(mantissa, intArray) {
  intArray[6] |= shiftRight(mantissa, 48) & 0xFF
  intArray[5] |= shiftRight(mantissa, 40) & 0xFF
  intArray[4] |= shiftRight(mantissa, 32) & 0xFF
  intArray[3] |= shiftRight(mantissa, 24) & 0xFF
  intArray[2] |= shiftRight(mantissa, 16) & 0xFF
  intArray[1] |= shiftRight(mantissa, 8) & 0xFF
  intArray[0] |= mantissa & 0xFF
}

function shiftLeft(n, bits) {
  return n * Math.pow(2, bits)
}

function shiftRight(n, bits) {
  return Math.floor(n / Math.pow(2, bits))
}

module.exports = { MAX_EXPONENT, MAX_MANTISSA, construct, deconstruct }
