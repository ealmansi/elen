# Efficient Lexicographic Encoding of Numbers.

[![Build Status](https://travis-ci.org/ealmansi/elen.svg?branch=master)](https://travis-ci.com/ealmansi/elen)

Based on the [paper](https://github.com/ealmansi/elen/blob/master/resources/elen.pdf) by Peter Seymour.

## Installation

`npm install --save elen`

### Usage

#### In Node.js

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

#### Browser

##### Script Tag

```
<script src="https://cdn.rawgit.com/ealmansi/elen/master/dist/elen-1.0.4.min.js"></script>
```

### Documentation

#### Generate and browse locally

```
npm run docs
```

#### Browse online

Automatically generated [jsdocs](https://cdn.rawgit.com/ealmansi/elen/master/docs/global.html#encode).
