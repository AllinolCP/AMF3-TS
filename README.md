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
| Object       |❌         |❌           | Todo                 |
| XML          |❌         |❌           | Who uses XML?        |
| ByteArray    |✔️         |✔️           | -                    |
| Vector int   |✔️         |✔️           | -                    |
| Vector uint  |✔️         |✔️           | -                    |
| Vector double|✔️         |✔️           | -                    |
| Set          |✔️         |✔️           | -                    |
| Map          |✔️         |✔️           | -                    |

# Extra compatibility table

| Name                      | Supported | Reason for exclusion |
|---------------------------|-----------|----------------------|
| Class alias               |❌         | Todo                 |
| Dynamic property writer   |❌         | Todo                 |
| Externalizable classes    |❌         | Todo                 |

# Usage

Todo.
