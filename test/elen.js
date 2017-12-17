/***
 * @license
 * https://github.com/ealmansi/elen
 * Copyright (c) 2017 Emilio Almansi
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or http://www.opensource.org/licenses/mit-license.php.
 */

/* global describe it */

const elen = require('elen')
const assert = require('chai').assert

describe('ELEN - Efficient Lexicographic Encoding of Numbers', () => {
  describe('#encode()', () => {
    it('should encode numbers successfully', () => {
      assert.equal(elen.encode(-0), '<;;42047;;;2164503599627370495')
      assert.equal(elen.encode(0), '>00')
      assert.equal(elen.encode(-5e-324), '<;;42047;;;2164503599627370494')
      assert.equal(elen.encode(5e-324), '>0;1')
      assert.equal(elen.encode(-6), '<;;41022;;;2162251799813685247')
      assert.equal(elen.encode(6), '>;;41025;;;2162251799813685248')
      assert.equal(elen.encode(-9), '<;;41021;;;2163940649673949183')
      assert.equal(elen.encode(9), '>;;41026;;;215562949953421312')
      assert.equal(elen.encode(-7), '<;;41022;;;2161125899906842623')
      assert.equal(elen.encode(7), '>;;41025;;;2163377699720527872')
      assert.equal(elen.encode(-1), '<;;41024;;;2164503599627370495')
      assert.equal(elen.encode(1), '>;;410230')
      assert.equal(elen.encode(-2), '<;;41023;;;2164503599627370495')
      assert.equal(elen.encode(2), '>;;410240')
      assert.equal(elen.encode(-Infinity), '<0;;;2164503599627370495')
      assert.equal(elen.encode(Infinity), '>;;420470')
      assert.equal(elen.encode(NaN), '>;;42047;;;2162251799813685248')
    })
  })

  describe('#decode()', () => {
    it('should decode numbers successfully', () => {
      assert.equal(elen.decode('<;;42047;;;2164503599627370495'), -0)
      assert.equal(elen.decode('>00'), 0)
      assert.equal(elen.decode('<;;42047;;;2164503599627370494'), -5e-324)
      assert.equal(elen.decode('>0;1'), 5e-324)
      assert.equal(elen.decode('<;;41022;;;2162251799813685247'), -6)
      assert.equal(elen.decode('>;;41025;;;2162251799813685248'), 6)
      assert.equal(elen.decode('<;;41021;;;2163940649673949183'), -9)
      assert.equal(elen.decode('>;;41026;;;215562949953421312'), 9)
      assert.equal(elen.decode('<;;41022;;;2161125899906842623'), -7)
      assert.equal(elen.decode('>;;41025;;;2163377699720527872'), 7)
      assert.equal(elen.decode('<;;41024;;;2164503599627370495'), -1)
      assert.equal(elen.decode('>;;410230'), 1)
      assert.equal(elen.decode('<;;41023;;;2164503599627370495'), -2)
      assert.equal(elen.decode('>;;410240'), 2)
      assert.equal(elen.decode('<0;;;2164503599627370495'), -Infinity)
      assert.equal(elen.decode('>;;420470'), Infinity)
      assert.isTrue(Object.is(elen.decode('>;;42047;;;2162251799813685248'), NaN))
    })
  })

  describe('#encode() #decode()', () => {
    const TEST_CASES = [
      11,
      9e200,
      1234567891,
      -0,
      1,
      -2,
      -10,
      7,
      10,
      -4e-150,
      9,
      1234567889,
      -9,
      -1234567890,
      1e10,
      -1234567889,
      -1e10,
      Infinity,
      -1234567891,
      2,
      5e-324,
      4e-150,
      123,
      -1,
      -9e200,
      1234567890,
      0,
      -Infinity,
      -11,
      -5e-324,
    ]

    const compareNumbers = (a, b) => {
      // Arbitrarily choose -0 to be less than 0 in order to
      // work around the following JavaScript limitations:
      // 1) -0 === 0
      // 2) sort() is not guaranteed to be a stable sort.
      if (Object.is(a, -0) && Object.is(b, 0)) {
        return -1
      }
      if (Object.is(a, 0) && Object.is(b, -0)) {
        return 1
      }
      return a - b
    }

    it('encode and decode should be inverse functions', () => {
      for (let n of TEST_CASES) {
        assert.equal(elen.decode(elen.encode(n)), n)
      }
    })

    it('ELEN encoding should preserve order', () => {
      assert.deepEqual(
        TEST_CASES.map(elen.encode).sort().map(elen.decode),
        TEST_CASES.sort(compareNumbers)
      )
    })
  })

  describe('#encode() #decode() error handling', () => {
    it('encode should throw if given input of type other than number', () => {
      assert.throws(() => elen.encode(''))
      assert.throws(() => elen.encode(null))
      assert.throws(() => elen.encode(undefined))
      assert.throws(() => elen.encode({}))
      assert.throws(() => elen.encode(() => {}))
    })

    it('decode should throw if given input of type other than string', () => {
      assert.throws(() => elen.decode(123.456))
      assert.throws(() => elen.decode(null))
      assert.throws(() => elen.decode(undefined))
      assert.throws(() => elen.decode({}))
      assert.throws(() => elen.decode(() => {}))
    })

    it('decode should throw if given invalid string input', () => {
      assert.throws(() => elen.decode(''))
      assert.throws(() => elen.decode('abcdefg'))
      assert.throws(() => elen.decode('<'))
      assert.throws(() => elen.decode('>'))
      assert.throws(() => elen.decode('<;;0'))
      assert.throws(() => elen.decode('<;;01;0'))
      assert.throws(() => elen.decode('<;0;0'))
      assert.throws(() => elen.decode('<;;212'))
      assert.throws(() => elen.decode('>0;212'))
    })
  })
})
