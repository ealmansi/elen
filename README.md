# ELEN - Efficient Lexicographic Encoding of Numbers

[![Build Status](https://travis-ci.org/ealmansi/elen.svg?branch=master)](https://travis-ci.com/ealmansi/elen)

Based on the [paper](https://github.com/ealmansi/elen/blob/master/resources/elen.pdf) by Peter Seymour.

## Installation

`$ npm install --save elen`

## Why would I want to use ELEN?

ELEN provides a way of textually representing numbers such that their natural order is preserved as a lexicographical order (i.e. alphabetical order) of their representations.

Imagine you need to represent numbers textually. A simple solution would be to simply call `num.toString()`. E.g.:

```
7..toString() // '7'
11..toString() // '11'
```

For many applications, this will suffice. However, notice that the natural order of the input numbers does not match the lexicographical order of the generated strings. I.e.:

```
[7, 11].sort((a, b) => a - b)    // [ 7, 11 ]
['7', '11'].sort()               // [ '11', '7' ]
```

That's where ELEN comes in. ELEN provides a way of textually representing numbers such that the following property is fulfilled:

```
assert.deepEqual(
  nums.map(elen.encode).sort().map(elen.decode),
  nums.sort((a, b) => a - b)
)
```

## Usage

### In Node.js

```
const elen = require('elen')

const encoded = [
  elen.encode(0),
  elen.encode(42),
  elen.encode(1),
  elen.encode(-10),
  elen.encode(5e100),
  elen.encode(-Infinity),
]

encoded.sort()

elen.decode(encoded[4]) // 42
```

### Browser

#### Script Tag

```
<html>
  <head>
    ...
    <script src="https://cdn.rawgit.com/ealmansi/elen/master/dist/elen-1.0.10.min.js"></script>
  </head>
  ...
</html>
```

## Documentation

### Generate and Browse Locally

```
$ npm run docs
```

### Online

Browse automatically generated jsdocs [online](https://cdn.rawgit.com/ealmansi/elen/master/docs/global.html#encode).
