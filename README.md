# AMF3-TS

[![npm version](https://img.shields.io/npm/v/@zaseth/amf3-ts?style=flat-square)](https://www.npmjs.com/package/@zaseth/amf3-ts)
[![](https://data.jsdelivr.com/v1/package/npm/@zaseth/amf3-ts/badge)](https://www.jsdelivr.com/package/npm/@zaseth/amf3-ts)

Fast AMF3 library written in pure Typescript with 0 dependencies, supporting TS, Node and the browser.

# Installation

```
npm i @zaseth/amf3-ts
```

# Type compatibility table

This library replaces `Vector` for `native typed array`, `Vector object` for `Set` and `Dictionary` for `Map`.

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
| Object       |❌         |❌           | Todo                 |
| XML          |❌         |❌           | Who uses XML?        |
| ByteArray    |❌         |❌           | Todo                 |
| Vector int   |❌         |❌           | Todo                 |
| Vector uint  |❌         |❌           | Todo                 |
| Vector double|❌         |❌           | Todo                 |
| Set          |❌         |❌           | Todo                 |
| Map          |❌         |❌           | Todo                 |

# Extra compatibility table

This library also supports extra compatibility. Please note that **Dynamic property writer** and **Externalizable classes** is only compatible with Typescript.

| Name                      | Supported | Reason for exclusion |
|---------------------------|-----------|----------------------|
| Class alias               |❌         | Todo                 |
| Dynamic property writer   |❌         | Todo                 |
| Externalizable classes    |❌         | Todo                 |
