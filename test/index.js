'use strict';

const { AMF3, Stream } = require('../dist/');
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

test('Array', (tape) => {
  const arr = [1, 2, 3];
  const values = [
    arr,
    [arr, arr],
    [],
    [, 'Hi'],
    [, 'Hi', , NaN,],
    [[1], , [2], , [3], [arr, arr]],
    Object.assign([], { associative: true, value: 'Hi' }),
    Object.assign([], [arr, arr], { mixed: true, ref1: arr, ref2: arr })
  ];

  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    tape.deepEqual(AMF3.parse(AMF3.stringify(value)), value);
  }

  tape.end();
});

test('ByteArray', (tape) => {
  const stream = new Stream();
  stream.writeUTF('Hello.');

  tape.equal(AMF3.parse(AMF3.stringify(stream)).readUTF(), 'Hello.');
  tape.end();
});

test('Vector', (tape) => {
  const vectorInt = new Int32Array([1, 2, 3]);
  const vectorUint = new Uint32Array([1, 2, 3]);
  const vectorDouble = new Float64Array([1.1, 2.2, 3.3]);

  const deserializedVectorInt = AMF3.parse(AMF3.stringify(vectorInt));
  const deserializedVectorUint = AMF3.parse(AMF3.stringify(vectorUint));
  const deserializedVectorDouble = AMF3.parse(AMF3.stringify(vectorDouble));

  tape.deepEqual(deserializedVectorInt, vectorInt);
  tape.deepEqual(deserializedVectorUint, vectorUint);
  tape.deepEqual(deserializedVectorDouble, vectorDouble);

  tape.ok(Object.isExtensible(deserializedVectorInt));
  tape.ok(Object.isExtensible(deserializedVectorUint));
  tape.ok(Object.isExtensible(deserializedVectorDouble));

  const fixedVectorInt = new Int32Array([1, 2, 3]);
  const fixedVectorUint = new Uint32Array([1, 2, 3]);
  const fixedVectorDouble = new Float64Array([1.1, 2.2, 3.3]);

  Object.preventExtensions(fixedVectorInt);
  Object.preventExtensions(fixedVectorUint);
  Object.preventExtensions(fixedVectorDouble);

  const deserializedFixedVectorInt = AMF3.parse(AMF3.stringify(fixedVectorInt));
  const deserializedFixedVectorUint = AMF3.parse(AMF3.stringify(fixedVectorUint));
  const deserializedFixedVectorDouble = AMF3.parse(AMF3.stringify(fixedVectorDouble));

  tape.deepEqual(deserializedFixedVectorInt, fixedVectorInt);
  tape.deepEqual(deserializedFixedVectorUint, fixedVectorUint);
  tape.deepEqual(deserializedFixedVectorDouble, fixedVectorDouble);

  tape.notOk(Object.isExtensible(deserializedFixedVectorInt));
  tape.notOk(Object.isExtensible(deserializedFixedVectorUint));
  tape.notOk(Object.isExtensible(deserializedFixedVectorDouble));

  tape.end();
});
