# https://github.com/ealmansi/elen
# Copyright (c) 2017 Emilio Almansi
# Distributed under the MIT software license, see the accompanying
# file LICENSE or http://www.opensource.org/licenses/mit-license.php.

npm install && \

npx browserify src/elen.js --s elen -t [ babelify --presets [ env ] ] \
  | npx uglifyjs -c --comments \
  > dist/elen.min.js
