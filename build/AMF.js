'use strict';

window.AMF3 = require('../dist/AMF3').AMF3;

if (!window.TextEncoder) {
  require('./EncoderDecoderTogether.min');
}
