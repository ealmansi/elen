const elen = require('elen')
const assert = require('chai').assert

describe('ELEN - Efficient Lexicographic Encoding of Numbers', () => {
  describe('#encode()', () => {
    it('should encode 0 successfully', () => {
      assert.equal(elen.encode(0), '0')
    })
  })

  describe('#decode()', () => {
    it('should decode "0" successfully', () => {
      assert.equal(elen.decode('0'), 0)
    })
  })
})
