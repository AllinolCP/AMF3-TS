'use strict';

const { AMF0, AMF3 } = require('../dist/');

window.AMF0 = AMF0;
window.AMF3 = AMF3;

if (!window.TextEncoder) {
  require('./EncoderDecoderTogether.min');
}
