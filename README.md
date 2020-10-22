# AMF3-TS

[![npm version](https://img.shields.io/npm/v/@zaseth/amf3-ts?style=flat-square)](https://www.npmjs.com/package/@zaseth/amf3-ts)
[![](https://data.jsdelivr.com/v1/package/npm/@zaseth/amf3-ts/badge)](https://www.jsdelivr.com/package/npm/@zaseth/amf3-ts)

Fast AMF3 library written in pure Typescript with 0 dependencies, supporting TS, Node and the browser.

# Installation

```
npm i @zaseth/amf3-ts
```

# Type compatibility table

| Type         | Serialize | Deserialize | Reason for exclusion |
|--------------|-----------|-------------|----------------------|
| Undefined    |✔️         |✔️           | -                    |
| Null         |✔️         |✔️           | -                    |
| False        |✔️         |✔️           | -                    |
| True         |✔️         |✔️           | -                    |
| Integer      |✔️         |✔️           | -                    |
| Double       |✔️         |✔️           | -                    |
| String       |✔️         |✔️           | -                    |
| XML Document |❌         |❌           | Who uses XML?        |
| Date         |✔️         |✔️           | -                    |
| Array        |✔️         |✔️           | -                    |
| Object       |✔️         |✔️           | -                    |
| XML          |❌         |❌           | Who uses XML?        |
| ByteArray    |✔️         |✔️           | -                    |
| Vector int   |✔️         |✔️           | -                    |
| Vector uint  |✔️         |✔️           | -                    |
| Vector double|✔️         |✔️           | -                    |
| Set          |✔️         |✔️           | -                    |
| Map          |✔️         |✔️           | -                    |

# Extra compatibility table

| Name                      | Supported | Platform   |
|---------------------------|-----------|------------|
| Class alias               |✔️         | All        |
| Dynamic property writer   |❌         | Typescript |
| Externalizable classes    |✔️         | Typescript |

# Usage

Below you'll find simple usage examples.

### Basic types

Working with basic types is very self explanatory.

**Typescript**
```ts
import { AMF3, ECMAArray } from '@zaseth/amf3-ts';

const obj: object = { id: 1 };
const ref: object = { ref1: obj, ref2: obj };
const mixed: ECMAArray = Object.assign([], [1,2,3], { 'Key': 'Value' });
const arr: ECMAArray = [1,2,3];

AMF3.parse(AMF3.stringify(obj));
AMF3.parse(AMF3.stringify(ref));
AMF3.parse(AMF3.stringify(mixed));
AMF3.parse(AMF3.stringify(arr));
```

**Node**
```js
const { AMF3 } = require('@zaseth/amf3-ts');

const obj = { id: 1 };
const ref = { ref1: obj, ref2: obj };
const mixed = Object.assign([], [1,2,3], { 'Key': 'Value' })
const arr = [1,2,3];

AMF3.parse(AMF3.stringify(obj));
AMF3.parse(AMF3.stringify(ref));
AMF3.parse(AMF3.stringify(mixed));
AMF3.parse(AMF3.stringify(arr));
```

**Browser**
```html
<script src="https://cdn.jsdelivr.net/npm/@zaseth/amf3-ts@latest/browser/AMF3.js"></script>

<script>
  const obj = { id: 1 };
  const ref = { ref1: obj, ref2: obj };
  const mixed = Object.assign([], [1,2,3], { 'Key': 'Value' })
  const arr = [1,2,3];

  AMF3.parse(AMF3.stringify(obj));
  AMF3.parse(AMF3.stringify(ref));
  AMF3.parse(AMF3.stringify(mixed));
  AMF3.parse(AMF3.stringify(arr));
</script>
```

### Changes

This library has a few changes:

- Vector has been changed to `typed arrays`
- Vector object has been changed to `Set`
- Dictionary has been changed to `Map`
- You can freeze Vector arrays using `Object.preventExtensions`

**Typescript**
```ts
import { AMF3 } from '@zaseth/amf3-ts';

const map: Map<string | number, any> = new Map([[1, 'Value']]);
const set: Set<any> = new Set([1, 'A', 2, 'B', 3, 'C']);
const vectorInt:Int32Array = new Int32Array([1,2,3]);
const fixedVectorUint:Uint32Array = new Uint32Array([1,2,3]);

Object.preventExtensions(fixedVectorUint);

AMF3.parse(AMF3.stringify(map));
AMF3.parse(AMF3.stringify(set));
AMF3.parse(AMF3.stringify(vectorInt));
AMF3.parse(AMF3.stringify(fixedVectorUint));
```

**Node**
```js
const { AMF3 } = require('@zaseth/amf3-ts');

const map = new Map([[1, 'Value']]);
const set = new Set([1, 'A', 2, 'B', 3, 'C']);
const vectorInt = new Int32Array([1,2,3]);
const fixedVectorUint = new Uint32Array([1,2,3]);

Object.preventExtensions(fixedVectorUint);

AMF3.parse(AMF3.stringify(map));
AMF3.parse(AMF3.stringify(set));
AMF3.parse(AMF3.stringify(vectorInt));
AMF3.parse(AMF3.stringify(fixedVectorUint));
```

**Browser**
```html
<script src="https://cdn.jsdelivr.net/npm/@zaseth/amf3-ts@latest/browser/AMF3.js"></script>

<script>
  const map = new Map([[1, 'Value']]);
  const set = new Set([1, 'A', 2, 'B', 3, 'C']);
  const vectorInt = new Int32Array([1,2,3]);
  const fixedVectorUint = new Uint32Array([1,2,3]);

  Object.preventExtensions(fixedVectorUint);

  AMF3.parse(AMF3.stringify(map));
  AMF3.parse(AMF3.stringify(set));
  AMF3.parse(AMF3.stringify(vectorInt));
  AMF3.parse(AMF3.stringify(fixedVectorUint));
</script>
```

### Typed class

This library also supports typed classes.

**Typescript**
```ts
import { AMF3 } from '@zaseth/amf3-ts';

class Person {
  public name:string;
  public age:number;

  constructor(name:string, age:number) {
    this.name = name;
    this.age = age;
  }
}

AMF3.registerClassAlias('com.person', Person);
AMF3.isRegisteredClassAlias(Person); // Or 'com.person'

const person: Person = new Person('Daan', 18);

AMF3.parse(AMF3.stringify(person));
AMF3.deregisterClassAlias(Person); // Or 'com.person'
```

**Node**
```js
const { AMF3 } = require('@zaseth/amf3-ts');

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

AMF3.registerClassAlias('com.person', Person);
AMF3.isRegisteredClassAlias(Person); // Or 'com.person'

const person = new Person('Daan', 18);

AMF3.parse(AMF3.stringify(person));
AMF3.deregisterClassAlias(Person); // Or 'com.person'
```

**Browser**
```html
<script src="https://cdn.jsdelivr.net/npm/@zaseth/amf3-ts@latest/browser/AMF3.js"></script>

<script>
  class Person {
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
  }

  AMF3.registerClassAlias('com.person', Person);
  AMF3.isRegisteredClassAlias(Person); // Or 'com.person'

  const person = new Person('Daan', 18);

  AMF3.parse(AMF3.stringify(person));
  AMF3.deregisterClassAlias(Person); // Or 'com.person'
</script>
```

### Externalizable class

This library also supports externalizable classes.

```ts
import { AMF3, IExternalizable, IDataInput, IDataOutput } from '@zaseth/amf3-ts';

class Character implements IExternalizable {
  public username: string;
  public password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  public writeExternal(output: IDataOutput): void {
    output.writeUTF(this.username);
    output.writeUTF(this.password);
  }

  public readExternal(input: IDataInput): void {
    this.username = input.readUTF();
    this.password = input.readUTF();
  }
}

AMF3.registerClassAlias('src.Character', Character);

AMF3.parse(AMF3.stringify(new Character('Zaseth', '123123')));
```

### Dynamic property writer

This library also supports Dynamic property writers.

Todo.
