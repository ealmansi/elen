# https://github.com/ealmansi/elen
# Copyright (c) 2017 Emilio Almansi
# Distributed under the MIT software license, see the accompanying
# file LICENSE or http://www.opensource.org/licenses/mit-license.php.

npx jsdoc -d docs src/elen.js \
  && npx http-server docs
