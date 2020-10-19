'use strict';

const { AMF3 } = require('../dist/');
const test = require('tape');

test('Null', (tape) => {
  tape.equal(AMF3.parse(AMF3.stringify(null)), null);
  tape.end();
});

test('Undefined', (tape) => {
  tape.equal(AMF3.parse(AMF3.stringify(undefined)), undefined);
  tape.end();
});

test('Boolean', (tape) => {
  tape.equal(AMF3.parse(AMF3.stringify(true)), true);
  tape.equal(AMF3.parse(AMF3.stringify(false)), false);
  tape.end();
});

test('Integer', (tape) => {
  const values = [
    1,
    1.12,
    0.005,
    55555,
    -55555,
    Infinity,
    -Infinity,
    Math.PI,
    Math.E,
    NaN
  ];

  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    tape.equal(AMF3.parse(AMF3.stringify(value)), value);
  }

  tape.end();
});

test('String', (tape) => {
  const values = [
    'ABC',
    'ABC'.repeat(100),
    'I ❤ π',
    '',
    ' ',
    'Thìs ïs ä tÉst!',
    'Long'.repeat(65535),
    'Very long'.repeat(65500)
  ];

  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    tape.equal(AMF3.parse(AMF3.stringify(value)), value);
  }

  tape.end();
});

test('Date', (tape) => {
  const date = new Date(2001, 11, 25);

  tape.deepEqual(AMF3.parse(AMF3.stringify(date)), date);
  tape.end();
})
