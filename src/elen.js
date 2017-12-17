/***
 * @license
 * https://github.com/ealmansi/elen
 * Copyright (c) 2017 Emilio Almansi
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or http://www.opensource.org/licenses/mit-license.php.
 */

const binary64 = require('./binary64')

const LENGTH_MARKER = ';'

const SIGN_NON_NEGATIVE = '>'
const SIGN_NEGATIVE = '<'

/**
 * Encodes a number as a string using ELEN encoding. <br/>
 * ELEN encoding has the property that the lexicographical order of a set of
 * ELEN-encoded numbers matches the natural ordering of the original numbers. <br/>
 * Based on the algorithm for efficient lexicographic encoding of natural
 * numbers by Peter Seymour. 
 * 
 * @param {number} n - Number to encode
 * @returns {string}
 * @throws {InvalidArgumentException}
 */
function encode(n) {
  if (typeof n !== 'number') {
    throw new InvalidArgumentException(`Value is not of type number: ${n}.`)
  }
  const isNegative = Object.is(n, -0) || n < 0
  const { sign, exponent, mantissa } = binary64.deconstruct(n)
  let r = ''
  r += isNegative ? SIGN_NEGATIVE : SIGN_NON_NEGATIVE
  r += elen(isNegative ? binary64.MAX_EXPONENT - exponent : exponent)
  r += elen(isNegative ? binary64.MAX_MANTISSA - mantissa : mantissa)
  return r
}

/**
 * Decodes an ELEN encoded number back into the original number.
 * See [#encode()]{@link encode}.
 * 
 * @param {string} s - ELEN encoded number
 * @returns {number}
 * @throws {InvalidArgumentException}
 */
function decode(s) {
  if (typeof s !== 'string') {
    throw new InvalidArgumentException(`Value is not of type string: ${s}.`)
  }
  const { signLength, sign } = parseSign(s, 0)
  const { exponentLength, exponent } = parseExponent(s, sign, signLength)
  const { mantissa } = parseMantissa(s, sign, signLength + exponentLength)
  return binary64.construct({ sign, exponent, mantissa })
}

function elen(n) {
  let r = ''
  if (n > 0) {
    r += LENGTH_MARKER
  }
  const s = n.toString()
  if (s.length > 1) {
    r += elen(s.length)
  }
  r += s
  return r
}

function parseSign(s, i) {
  if (s.length <= i) {
    throw new InvalidArgumentException(`Value is not a valid ELEN encoded number: ${s}.`)
  }
  if (s[i] === SIGN_NON_NEGATIVE) {
    return { signLength: 1, sign: 0 }
  }
  if (s[i] === SIGN_NEGATIVE) {
    return { signLength: 1, sign: 1 }
  }
  throw new InvalidArgumentException(`Value is not a valid ELEN encoded number: ${s}.`)
}

function parseExponent(s, sign, i) {
  if (s.length <= i) {
    throw new InvalidArgumentException(`Value is not a valid ELEN encoded number: ${s}.`)
  }
  if (s[i] === '0') {
    return { exponentLength: 1, exponent: sign === 0 ? 0 : binary64.MAX_EXPONENT }
  }
  let j = i, l = 0, t, n
  while (s[j] === LENGTH_MARKER) {
    l = l + 1
    j = j + 1
  }
  if (l === 0) {
    throw new InvalidArgumentException(`Value is not a valid ELEN encoded number: ${s}.`)
  }
  n = 1
  while (l > 0) {
    t = n
    n = Number.parseInt(s.substr(j, n))
    j = j + t
    l = l - 1
  }
  return { exponentLength: j - i, exponent: sign === 0 ? n : binary64.MAX_EXPONENT - n }
}

function parseMantissa(s, sign, i) {
  if (s.length <= i) {
    throw new InvalidArgumentException(`Value is not a valid ELEN encoded number: ${s}.`)
  }
  if (s[i] === '0') {
    return { mantissaLength: 1, mantissa: sign === 0 ? 0 : binary64.MAX_MANTISSA }
  }
  let j = i, l = 0, t, n
  while (s[j] === LENGTH_MARKER) {
    l = l + 1
    j = j + 1
  }
  if (l === 0) {
    throw new InvalidArgumentException(`Value is not a valid ELEN encoded number: ${s}.`)
  }
  n = 1
  while (l > 0) {
    t = n
    n = Number.parseInt(s.substr(j, n))
    j = j + t
    l = l - 1
  }
  return { mantissaLength: j - i, mantissa: sign === 0 ? n : binary64.MAX_MANTISSA - n }
}

module.exports = { encode, decode }
