'use strict';

window.AMF3 = require('../dist/AMF3').AMF3;
window.Stream = require('../dist/core/stream').Stream;

if (!window.TextEncoder) {
  require('./EncoderDecoderTogether.min');
}
