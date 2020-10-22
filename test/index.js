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

test('Object', (tape) => {
  const obj = { id: 1 };
  const values = [
    obj,
    { ref1: obj, ref2: obj },
    { obj },
    { 1: obj, 2: obj }
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

test('Set', (tape) => {
  const set = new Set([1, 2, 3]);
  const values = [
    set,
    new Set([set, set]),
    new Set()
  ];

  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    tape.deepEqual(AMF3.parse(AMF3.stringify(value)), value);
  }

  tape.end();
});

test('Map', (tape) => {
  const map = new Map([['id', 1]]);
  const values = [
    map,
    new Map([['ref1', map], ['ref2', map]]),
    new Map(),
    new Map([['map', map]]),
    new Map([['1', map], ['2', map]]),
    new Map([['1', map], [2, map]]),
    new Map([[1, map], [2, map]])
  ];

  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    tape.deepEqual(AMF3.parse(AMF3.stringify(value)), value);
  }

  tape.end();
});

test('Typed object', (tape) => {
  class Person {
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
  }

  class Car {
    constructor(brand, series) {
      this.brand = brand;
      this.series = series;
    }
  }

  AMF3.registerClassAlias('test.person', Person);
  AMF3.registerClassAlias('test.car', Car);

  const values = [
    new Person('Daan', 18),
    new Person('Gravix', 16),
    new Car('BMW', 'M3'),
    new Car('Mercedes-AMG', 'C63')
  ];

  tape.ok(AMF3.isRegisteredClassAlias(Person));
  tape.ok(AMF3.isRegisteredClassAlias(Car));
  tape.ok(AMF3.isRegisteredClassAlias('test.person'));
  tape.ok(AMF3.isRegisteredClassAlias('test.car'));

  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    tape.deepEqual(AMF3.parse(AMF3.stringify(value)), value);
  }

  AMF3.deregisterClassAlias(Person);
  AMF3.deregisterClassAlias('test.car');

  tape.notOk(AMF3.isRegisteredClassAlias(Person));
  tape.notOk(AMF3.isRegisteredClassAlias(Car));
  tape.notOk(AMF3.isRegisteredClassAlias('test.person'));
  tape.notOk(AMF3.isRegisteredClassAlias('test.car'));

  tape.end();
});

test('Anonymous object', (tape) => {
  class Person {
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
  }

  class Car {
    constructor(brand, series) {
      this.brand = brand;
      this.series = series;
    }
  }

  const values = [
    new Person('Daan', 18),
    new Person('Gravix', 16),
    new Car('BMW', 'M3'),
    new Car('Mercedes-AMG', 'C63')
  ];

  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    tape.deepLooseEqual(AMF3.parse(AMF3.stringify(value)), value);
  }

  tape.notOk(AMF3.isRegisteredClassAlias(Person));
  tape.notOk(AMF3.isRegisteredClassAlias(Car));

  tape.end();
});
