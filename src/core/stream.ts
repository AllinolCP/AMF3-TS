import { Sizes } from '../enums/sizes';
import { IDataInput, IDataOutput } from '../index';

/**
 * @exports
 * @class
 * @implements IDataInput, IDataOutput
 */
export class Stream implements IDataInput, IDataOutput {
  /**
   * @public
   * @description The array holding the data
   * @type {Array<number>}
   */
  public data: number[];
  /**
   * @public
   * @description The position in the array
   * @type {number}
   */
  public position: number;
  /**
   * @public
   * @description The byte order
   * @type {boolean}
   */
  public endian: boolean;

  /**
   * @constructor
   * @param {Array<number>} data
   */
  constructor(data: number[] = []) {
    /**
     * @description Initialize the data holder
     * @type {Array<number>}
     */
    this.data = data;
    /**
     * @description Initialize the position
     * @type {number}
     */
    this.position = 0;
    /**
     * @description Initialize the byte order
     * @type {boolean}
     */
    this.endian = false;
  }

  /**
   * @description Returns the length of the data holder
   * @returns {number}
   */
  get length(): number {
    return this.data.length;
  }

  /**
   * @description Returns the amount of bytes available
   * @returns {number}
   */
  get bytesAvailable(): number {
    return this.length - this.position;
  }

  /**
   * @private
   * @description Checks if the given value can be written
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {void}
   */
  private canWrite(value: number, min: number, max: number): void {
    if ((value < min) || (value > max)) {
      throw new RangeError(`The value: '${value}' is out of range (${min}, ${max}).`);
    }
  }

  /**
   * @private
   * @description Checks if the given integer size can be read
   * @param {number} size
   * @returns {void}
   */
  private canRead(size: number): void {
    const available: number = this.bytesAvailable;

    if (available === 0) {
      throw new RangeError(`There's no data left to read.`);
    }

    if (available < size) {
      throw new RangeError(`Couldn't read an integer of '${size * 8}' bits as there's only '${available}' bytes available.`);
    }
  }

  /**
   * @private
   * @description Simulates signed overflow
   * @author truelossless
   * @param {number} value
   * @param {number} bits
   * @returns {number}
   */
  private signedOverflow(value: number, bits: number): number {
    const sign: number = 1 << bits - 1;

    return (value & sign - 1) - (value & sign);
  }

  /**
   * @public
   * @description Writes a boolean
   * @param {boolean} value
   * @returns {void}
   */
  public writeBoolean(value: boolean): void {
    this.writeByte(value ? 1 : 0);
  }

  /**
   * @public
   * @description Reads a boolean
   * @returns {boolean}
   */
  public readBoolean(): boolean {
    return this.readByte() !== 0;
  }

  /**
   * @public
   * @description Writes a signed 8-bit integer
   * @param {number} value
   * @returns {void}
   */
  public writeByte(value: number): void {
    this.canWrite(value, Sizes.INT8_MIN, Sizes.INT8_MAX);

    this.data[this.position++] = this.signedOverflow(value, 8);
  }

  /**
   * @public
   * @description Reads a signed 8-bit integer
   * @returns {number}
   */
  public readByte(): number {
    this.canRead(1);

    return this.data[this.position++];
  }

  /**
   * @public
   * @description Writes an unsigned 8-bit integer
   * @param {number} value
   * @returns {void}
   */
  public writeUnsignedByte(value: number): void {
    this.canWrite(value, Sizes.UINT8_MIN, Sizes.UINT8_MAX);

    this.data[this.position++] = value;
  }

  /**
   * @public
   * @description Reads an unsigned 8-bit integer
   * @returns {number}
   */
  public readUnsignedByte(): number {
    this.canRead(1);

    return this.data[this.position++];
  }

  /**
   * @public
   * @description Writes a signed 16-bit integer
   * @param {number} value
   * @returns {void}
   */
  public writeShort(value: number): void {
    value = this.signedOverflow(value, 16);

    this.canWrite(value, Sizes.INT16_MIN, Sizes.INT16_MAX);

    if (this.endian) {
      this.data[this.position++] = value;
      this.data[this.position++] = (value >>> 8);
    } else {
      this.data[this.position++] = (value >>> 8);
      this.data[this.position++] = value;
    }
  }

  /**
   * @public
   * @description Reads a signed 16-bit integer
   * @returns {number}
   */
  public readShort(): number {
    this.canRead(2);

    return this.endian
      ? (this.data[this.position++])
      | (this.data[this.position++] << 8)
      : (this.data[this.position++] << 8)
      | (this.data[this.position++]);
  }

  /**
   * @public
   * @description Writes an unsigned 16-bit integer
   * @param {number} value
   * @returns {void}
   */
  public writeUnsignedShort(value: number): void {
    this.canWrite(value, Sizes.UINT16_MIN, Sizes.UINT16_MAX);

    if (this.endian) {
      this.data[this.position++] = value;
      this.data[this.position++] = (value >>> 8);
    } else {
      this.data[this.position++] = (value >>> 8);
      this.data[this.position++] = value;
    }
  }

  /**
   * @public
   * @description Reads an unsigned 16-bit integer
   * @returns {number}
   */
  public readUnsignedShort(): number {
    this.canRead(2);

    return this.endian
      ? (this.data[this.position++])
      | (this.data[this.position++] << 8)
      : (this.data[this.position++] << 8)
      | (this.data[this.position++]);
  }

  /**
   * @public
   * @description Writes a signed 32-bit integer
   * @param {number} value
   * @returns {void}
   */
  public writeInt(value: number): void {
    value = this.signedOverflow(value, 32);

    this.canWrite(value, Sizes.INT32_MIN, Sizes.INT32_MAX);

    if (this.endian) {
      this.data[this.position++] = value;
      this.data[this.position++] = (value >>> 8);
      this.data[this.position++] = (value >>> 16);
      this.data[this.position++] = (value >>> 24);
    } else {
      this.data[this.position++] = (value >>> 24);
      this.data[this.position++] = (value >>> 16);
      this.data[this.position++] = (value >>> 8);
      this.data[this.position++] = value;
    }
  }

  /**
   * @public
   * @description Reads a signed 32-bit integer
   * @returns {number}
   */
  public readInt(): number {
    this.canRead(4);

    return this.endian
      ? (this.data[this.position++])
      | (this.data[this.position++] << 8)
      | (this.data[this.position++] << 16)
      | (this.data[this.position++] << 24)
      : (this.data[this.position++] << 24)
      | (this.data[this.position++] << 16)
      | (this.data[this.position++] << 8)
      | (this.data[this.position++]);
  }

  /**
   * @public
   * @description Writes an unsigned 32-bit integer
   * @param {number} value
   * @returns {void}
   */
  public writeUnsignedInt(value: number): void {
    this.canWrite(value, Sizes.UINT32_MIN, Sizes.UINT32_MAX);

    if (this.endian) {
      this.data[this.position++] = value;
      this.data[this.position++] = (value >>> 8);
      this.data[this.position++] = (value >>> 16);
      this.data[this.position++] = (value >>> 24);
    } else {
      this.data[this.position++] = (value >>> 24);
      this.data[this.position++] = (value >>> 16);
      this.data[this.position++] = (value >>> 8);
      this.data[this.position++] = value;
    }
  }

  /**
   * @public
   * @description Reads an unsigned 32-bit integer
   * @returns {number}
   */
  public readUnsignedInt(): number {
    this.canRead(4);

    return this.endian
      ? (this.data[this.position++])
      | (this.data[this.position++] << 8)
      | (this.data[this.position++] << 16)
      | (this.data[this.position++] << 24)
      : (this.data[this.position++] << 24)
      | (this.data[this.position++] << 16)
      | (this.data[this.position++] << 8)
      | (this.data[this.position++]);
  }

  /**
   * @public
   * @description Writes an UTF8 string
   * @param {string} value
   * @returns {void}
   */
  public writeUTF(value: string): void {
    const bytes: number[] = Array.from(new TextEncoder().encode(value));

    this.writeUnsignedShort(bytes.length);

    this.position += bytes.length;
    this.data = this.data.concat(bytes);
  }

  /**
   * @public
   * @description Reads an UTF8 string
   * @returns {string}
   */
  public readUTF(): string {
    const length: number = this.readUnsignedShort();
    const bytes: Uint8Array = Uint8Array.from(this.data.slice(this.position, this.position + length));

    this.position += bytes.length;

    return new TextDecoder().decode(bytes);
  }

  /**
   * @public
   * @description Writes an UTF8 string without the length
   * @param {string} value
   * @returns {void}
   */
  public writeUTFBytes(value: string): void {
    const bytes: number[] = Array.from(new TextEncoder().encode(value));

    this.position += bytes.length;
    this.data = this.data.concat(bytes);
  }

  /**
   * @public
   * @description Reads an amount of UTF8 bytes based on the length
   * @param {number} length
   * @returns {string}
   */
  public readUTFBytes(length: number): string {
    this.canRead(length);

    const bytes: Uint8Array = Uint8Array.from(this.data.slice(this.position, this.position + length));

    this.position += length;

    return new TextDecoder().decode(bytes);
  }

  /**
   * @public
   * @description Writes a signed 32-bit float
   * @param {number} value
   * @returns {void}
   */
  public writeFloat(value: number): void {
    const dv: DataView = new DataView(new ArrayBuffer(4));
    dv.setFloat32(0, value, this.endian);

    const bytes: number[] = [...new Uint8Array(dv.buffer)];

    this.position += 4;
    this.data = this.data.concat(bytes);
  }

  /**
   * @public
   * @description Reads a signed 32-bit float
   * @returns {number}
   */
  public readFloat(): number {
    this.canRead(4);

    const bytes: number[] = this.data.slice(this.position, this.position + 4);
    const value: number = new Float32Array(Uint8Array.from(this.endian ? bytes : bytes.reverse()).buffer)[0];

    this.position += 4;

    return value;
  }

  /**
   * @public
   * @description Writes a signed 64-bit float
   * @param {number} value
   * @returns {void}
   */
  public writeDouble(value: number): void {
    const dv: DataView = new DataView(new ArrayBuffer(8));
    dv.setFloat64(0, value, this.endian);

    const bytes: number[] = [...new Uint8Array(dv.buffer)];

    this.position += 8;
    this.data = this.data.concat(bytes);
  }

  /**
   * @public
   * @description Reads a signed 64-bit float
   * @returns {number}
   */
  public readDouble(): number {
    this.canRead(8);

    const bytes: number[] = this.data.slice(this.position, this.position + 8);
    const value: number = new Float64Array(Uint8Array.from(this.endian ? bytes : bytes.reverse()).buffer)[0];

    this.position += 8;

    return value;
  }

  /**
   * @public
   * @description Writes multiple signed bytes
   * @param {Stream} stream
   * @param {number} offset
   * @param {number} length
   * @returns {void}
   */
  public writeBytes(stream: Stream, offset: number = 0, length: number = 0): void {
    if (length === 0) {
      length = stream.length - offset;
    }

    for (let i: number = 0; i < length; i++) {
      this.data[i + this.position] = stream.data[i + offset];
    }

    this.position += length;
  }

  /**
   * @public
   * @description Reads multiple signed bytes
   * @param {Stream} stream
   * @param {number} offset
   * @param {number} length
   * @returns {void}
   */
  public readBytes(stream: Stream, offset: number = 0, length: number = 0): void {
    if (length === 0) {
      length = this.bytesAvailable;
    }

    for (let i: number = 0; i < length; i++) {
      stream.data[i + offset] = this.data[i + this.position];
    }

    this.position += length;
  }

  /**
   * @public
   * @description Writes an unsigned 29-bit integer
   * @param {number} value
   * @returns {void}
   */
  public writeUInt29(value: number): void {
    if (value < Sizes.UINT29_1) {
      this.writeUnsignedByte(value);
    } else if (value < Sizes.UINT29_2) {
      this.writeUnsignedByte(((value >> 7) & Sizes.INT8_MAX) | Sizes.UINT29_1);
      this.writeUnsignedByte(value & Sizes.INT8_MAX);
    } else if (value < Sizes.UINT29_3) {
      this.writeUnsignedByte(((value >> 14) & Sizes.INT8_MAX) | Sizes.UINT29_1);
      this.writeUnsignedByte(((value >> 7) & Sizes.INT8_MAX) | Sizes.UINT29_1);
      this.writeUnsignedByte(value & Sizes.INT8_MAX);
    } else if (value < Sizes.UINT29_4) {
      this.writeUnsignedByte(((value >> 22) & Sizes.INT8_MAX) | Sizes.UINT29_1);
      this.writeUnsignedByte(((value >> 15) & Sizes.INT8_MAX) | Sizes.UINT29_1);
      this.writeUnsignedByte(((value >> 8) & Sizes.INT8_MAX) | Sizes.UINT29_1);
      this.writeUnsignedByte(value & Sizes.UINT8_MAX);
    } else {
      throw new RangeError(`The value: '${value}' is out of range.`);
    }
  }

  /**
   * @public
   * @description Reads an unsigned 29-bit integer
   * @returns {number}
   */
  public readUInt29(): number {
    let value: number = 0;

    for (let i: number = 0; i < 4; i++) {
      const byte: number = this.readUnsignedByte();

      value = (i === 3) ? (value << 8) + byte : (value << 7) + (byte & Sizes.INT8_MAX);

      if (!(byte & Sizes.UINT29_1)) {
        break;
      }
    }

    return value;
  }
}
