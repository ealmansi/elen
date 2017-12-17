
// const MAX_EXPONENT = 2047
// const MAX_MANTISSA = 4503599627370495

// const ELEN_MARKER = ';'
// const ELEN_SIGN_POS = '>'
// const ELEN_SIGN_NEG = '<'

// function elen_encode(n) {
//   if (typeof n !== 'number') {
//     throw new Error(`Value is not of type Number: ${n}.`)
//   }
//   const { sign, exponent, mantissa } = binary64_deconstruct(n)
//   const isPositiveOrZero = sign === 0 || (exponent === 0 && mantissa === 0)
//   let r = ''
//   r += isPositiveOrZero ? ELEN_SIGN_POS : ELEN_SIGN_NEG
//   r += elen_encode_non_negative(isPositiveOrZero ? exponent : MAX_EXPONENT - exponent)
//   r += elen_encode_non_negative(isPositiveOrZero ? mantissa : MAX_MANTISSA - mantissa)
//   return r
// }

// function elen_encode_non_negative(n) {
//   let r = ''
//   if (n > 0) {
//     r += ELEN_MARKER
//   }
//   const s = n.toString()
//   if (s.length > 1) {
//     r += elen_encode_non_negative(s.length)
//   }
//   r += s
//   return r
// }

// function elen_decode(s) {
//   if (typeof s !== 'string') {
//     throw new Error(`Value is not of type string: ${s}.`)
//   }
//   let i = 0, l, n, t
//   let sign, exponent, mantissa
//   // Sign.
//   sign = s[i] === '>' ? 0 : 1
//   i = i + 1
//   // Exponent.
//   l = 0
//   while (s[i] === ';') {
//     l = l + 1
//     i = i + 1
//   }
//   if (l === 0) {
//     exponent = sign === 0 ? 0 : MAX_EXPONENT
//     i = i + 1
//   }
//   else {
//     n = 1
//     while (l > 0) {
//       t = n
//       n = Number.parseInt(s.substr(i, n))
//       i = i + t
//       l = l - 1
//     }
//     exponent = sign === 0 ? n : MAX_EXPONENT - n
//   }
//   // Mantissa.
//   l = 0
//   while (s[i] === ';') {
//     l = l + 1
//     i = i + 1
//   }
//   if (l === 0) {
//     mantissa = sign === 0 ? 0 : MAX_MANTISSA
//     i = i + 1
//   }
//   else {
//     n = 1
//     while (l > 0) {
//       t = n
//       n = Number.parseInt(s.substr(i, n))
//       i = i + t
//       l = l - 1
//     }
//     mantissa = sign === 0 ? n : MAX_MANTISSA - n
//   }
//   return binary64_construct({ sign, exponent, mantissa })
// }

// function binary64_deconstruct(n) {
//   const buffer = new ArrayBuffer(8)
//   const floatArray = new Float64Array(buffer)
//   const intArray = new Uint8Array(buffer)
//   floatArray[0] = n
//   return {
//     sign: get_sign(intArray),
//     exponent: get_exponent(intArray),
//     mantissa: get_mantissa(intArray),
//   }
// }

// function binary64_construct({ sign, exponent, mantissa }) {
//   const buffer = new ArrayBuffer(8)
//   const floatArray = new Float64Array(buffer)
//   const intArray = new Uint8Array(buffer)
//   set_sign(sign, intArray)
//   set_exponent(exponent, intArray)
//   set_mantissa(mantissa, intArray)
//   return floatArray[0]
// }

// function get_sign(intArray) {
//   return intArray[7] >> 7
// }

// function set_sign(sign, intArray) {
//   intArray[7] |= (sign << 7)
// }

// function get_exponent(intArray) {
//   let r = 0
//   r += (intArray[7] & 0x7F) << 4
//   r += intArray[6] >> 4
//   return r
// }

// function set_exponent(exponent, intArray) {
//   intArray[7] |= exponent >> 4
//   intArray[6] |= (exponent & 0xF) << 4
// }

// function get_mantissa(intArray) {
//   let r = 0
//   r += (intArray[6] & 0x0F) * Math.pow(2, 48)
//   r += intArray[5] * Math.pow(2, 40)
//   r += intArray[4] * Math.pow(2, 32)
//   r += intArray[3] * Math.pow(2, 24)
//   r += intArray[2] * Math.pow(2, 16)
//   r += intArray[1] * Math.pow(2, 8)
//   r += intArray[0]
//   return r
// }

// function set_mantissa(mantissa, intArray) {
//   intArray[6] |= (mantissa / Math.pow(2, 48)) & 0xFF
//   intArray[5] |= (mantissa / Math.pow(2, 40)) & 0xFF
//   intArray[4] |= (mantissa / Math.pow(2, 32)) & 0xFF
//   intArray[3] |= (mantissa / Math.pow(2, 24)) & 0xFF
//   intArray[2] |= (mantissa / Math.pow(2, 16)) & 0xFF
//   intArray[1] |= (mantissa / Math.pow(2, 8)) & 0xFF
//   intArray[0] |= mantissa & 0xFF
// }

// const all = [
//   -9,
//   Infinity,
//   1234567891,
//   -Infinity,
//   -1,
//   0,
//   -1234567891,
//   -0,
//   -5e-324,
//   2,
//   -1234567890,
//   9,
//   -1234567889,
//   1234567890,
//   -10,
//   11,
//   7,
//   1234567889,
//   5e-324,
//   123,
//   -11,
//   1,
//   10,
//   -2,
//   1e10,
//   -1e10,
//   9e200,
//   -9e200,
//   4e-150,
//   -4e-150,
// ]

// if (!isNaN(elen_decode(elen_encode(NaN)))) {
//   throw new Error(`Failed test: ${NaN}.`);
// }

// all.forEach(test => {
//   const actual = elen_decode(elen_encode(test))
//   if (test !== actual) {
//     throw new Error(`Failed test: ${test} with value ${actual}.`);
//   }
// })

// const allIndexed = all.map((v, i) => [i, v])
// const allEncodedIndexed = all.map((v, i) => [i, elen_encode(v)])

// allIndexed.sort(compareIndexedValues)
// allEncodedIndexed.sort(compareIndexedValues)

// for (let i = 0; i < all.length; ++i) {
//   if (allIndexed[i][0] !== allEncodedIndexed[i][0]) {
//     throw new Error('Order differed.')
//   }
// }

// console.log(allIndexed)
// console.log(allEncodedIndexed)

// function compareIndexedValues([i1, v1], [i2, v2]) {
//   if (v1 === v2) {
//     return i1 - i2
//   }
//   return v1 < v2 ? -1 : 1
// }
