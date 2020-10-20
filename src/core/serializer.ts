import { Stream, ECMAArray } from '../index';
import { Mapping } from '../utils/mapping';
import { Reference } from '../utils/reference';
import { Markers } from '../enums/markers';
import Utils from '../utils/index';

/**
 * @exports
 * @class
 */
export class Serializer {
  /**
   * @private
   * @description The stream holder
   * @type {Stream}
   */
  private stream: Stream;
  /**
   * @private
   * @description The mapping holder
   * @type {Mapping}
   */
  private mapping: Mapping;
  /**
   * @private
   * @description The reference holder
   * @type {Reference}
   */
  private reference: Reference;

  /**
   * @constructor
   * @param {object} options
   */
  constructor(options: { [key: string]: Stream | Mapping; }) {
    /**
     * @description Initialize the stream holder
     * @type {Stream}
     */
    this.stream = options.stream as Stream;
    /**
     * @description Initialize the mapping holder
     * @type {Mapping}
     */
    this.mapping = options.mapping as Mapping;
    /**
     * @description Initialize the reference holder
     * @type {Reference}
     */
    this.reference = new Reference();
  }

  /**
   * @public
   * @description Serializes data to AMF3 bytes
   * @param {any} data
   * @returns {Array<number>}
   */
  public serialize(data: any): number[] {
    if (data === null) {
      this.serializeNull();
    } else if (data === undefined) {
      this.serializeUndefined();
    } else {
      const type: Function = data.constructor;

      switch (type) {
        case Boolean: this.serializeBoolean(data); break;
        case Number: this.serializeInteger(data); break;
        case String: this.serializeString(data); break;
        case Date: this.serializeDate(data); break;
        case Array: this.serializeArray(data); break;
        //case Object: this.serializeObject(data); break;
        case Stream: this.serializeByteArray(data); break;
        case Int32Array: this.serializeVectorInt(data); break;
        case Uint32Array: this.serializeVectorUint(data); break;
        case Float64Array: this.serializeVectorDouble(data); break;
        case Set: this.serializeSet(data); break;
        default: throw new TypeError('Todo.');
      }
    }

    return this.stream.data;
  }

  /**
   * @private
   * @description Serializes a null
   * @returns {void}
   */
  private serializeNull(): void {
    this.stream.writeUnsignedByte(Markers.NULL);
  }

  /**
   * @private
   * @description Serializes an undefined
   * @returns {void}
   */
  private serializeUndefined(): void {
    this.stream.writeUnsignedByte(Markers.UNDEFINED);
  }

  /**
   * @private
   * @description Serializes a boolean
   * @param {boolean|Boolean} value
   * @returns {void}
   */
  private serializeBoolean(value: boolean | Boolean): void {
    // Primitive Boolean can't be compared
    if (value instanceof Boolean) {
      value = value.valueOf();
    }

    this.stream.writeUnsignedByte(value ? Markers.TRUE : Markers.FALSE);
  }

  /**
   * @private
   * @description Serializes an integer/double
   * @param {number} value
   * @returns {void}
   */
  private serializeInteger(value: number): void {
    const UINT29_MASK: number = 0x1FFFFFFF;

    if ((value << 3 >> 3) === value) {
      this.stream.writeUnsignedByte(Markers.INTEGER);
      this.stream.writeUInt29(value & UINT29_MASK);
    } else {
      this.stream.writeUnsignedByte(Markers.DOUBLE);
      this.stream.writeDouble(value);
    }
  }

  /**
   * @private
   * @description Serializes a string
   * @param {string} value
   * @returns {void}
   */
  private serializeString(value: string, type: boolean = true): void {
    if (type) {
      this.stream.writeUnsignedByte(Markers.STRING);
    }

    const length: number = Utils.byteLength(value);

    // Specify that the remaining bits are empty
    if (length === 0) {
      return this.stream.writeUInt29(1);
    }

    const idx: number | boolean = this.reference.check('stringReferences', value);

    if (idx !== false) {
      return this.stream.writeUInt29(idx as number << 1);
    }

    this.stream.writeUInt29((length << 1) | 1);
    this.stream.writeUTFBytes(value);
  }

  /**
   * @private
   * @description Serializes a date
   * @param {Date} value
   * @returns {void}
   */
  private serializeDate(value: Date): void {
    this.stream.writeUnsignedByte(Markers.DATE);

    const idx: number | boolean = this.reference.check('objectReferences', value);

    if (idx !== false) {
      return this.stream.writeUInt29(idx as number << 1);
    }

    this.stream.writeUInt29(1);
    this.stream.writeDouble(value.getTime());
  }

  /**
   * @private
   * @description Serializes an array
   * @param {Array<any>} value
   * @returns {void}
   */
  private serializeArray(value: ECMAArray): void {
    this.stream.writeUnsignedByte(Markers.ARRAY);

    const idx: number | boolean = this.reference.check('objectReferences', value);

    if (idx !== false) {
      return this.stream.writeUInt29(idx as number << 1);
    }

    const isAssociative: boolean = Utils.isAssociativeArray(value);

    // A normal/mixed array must write the length
    if (!isAssociative || value.length !== 0) {
      this.stream.writeUInt29((value.length << 1) | 1);
    }

    // Skip the first uint29 delimiter bits when the array is mixed
    if (!(isAssociative && value.length > 0)) {
      this.stream.writeUInt29(1);
    }

    // AVM2 writes the associative parts first in a mixed array
    if (isAssociative) {
      for (const key in value) {
        if (isNaN(key as any)) {
          this.serializeString(key, false);
          this.serialize(value[key]);
        }
      }

      // AVM2 writes the uint29 delimiter bits after the associative parts are written in a mixed array
      if (value.length > 0) {
        this.stream.writeUInt29(1);
      }
    }

    for (let i: number = 0; i < value.length; i++) {
      this.serialize(value[i]);
    }

    // An associative array must end with the uint29 delimiter bits
    if (isAssociative && value.length === 0) {
      this.stream.writeUInt29(1);
    }
  }

  /**
   * @private
   * @description Serializes a ByteArray
   * @param {Stream} value
   * @returns {void}
   */
  private serializeByteArray(value: Stream): void {
    this.stream.writeUnsignedByte(Markers.BYTEARRAY);

    const idx: number | boolean = this.reference.check('objectReferences', value);

    if (idx !== false) {
      return this.stream.writeUInt29(idx as number << 1);
    }

    this.stream.writeUInt29((value.length << 1) | 1);
    this.stream.writeBytes(value);
  }

  /**
   * @private
   * @description Serializes a Vector
   * @param {Int32Array|Uint32Array|Float64Array} value
   * @returns {void}
   */
  private serializeVector(value: Int32Array | Uint32Array | Float64Array): void {
    const isVectorInt: boolean = value instanceof Int32Array;
    const isVectorUint: boolean = value instanceof Uint32Array;

    this.stream.writeUnsignedByte(isVectorInt
      ? Markers.VECTOR_INT
      : isVectorUint
        ? Markers.VECTOR_UINT
        : Markers.VECTOR_DOUBLE);

    const idx: number | boolean = this.reference.check('objectReferences', value);

    if (idx !== false) {
      return this.stream.writeUInt29(idx as number << 1);
    }

    this.stream.writeUInt29((value.length << 1) | 1);
    this.stream.writeBoolean(Object.isExtensible(value));

    for (let i: number = 0; i < value.length; i++) {
      isVectorInt
        ? this.stream.writeInt(value[i])
        : isVectorUint
          ? this.stream.writeUnsignedInt(value[i])
          : this.stream.writeDouble(value[i]);
    }
  }

  /**
   * @private
   * @description Serializes a Vector int
   * @param {Int32Array} value
   * @returns {void}
   */
  private serializeVectorInt(value: Int32Array): void {
    this.stream.writeUnsignedByte(Markers.VECTOR_INT);

    const idx: number | boolean = this.reference.check('objectReferences', value);

    if (idx !== false) {
      return this.stream.writeUInt29(idx as number << 1);
    }

    this.stream.writeUInt29((value.length << 1) | 1);
    this.stream.writeBoolean(!Object.isExtensible(value));

    for (let i: number = 0; i < value.length; i++) {
      this.stream.writeInt(value[i]);
    }
  }

  /**
   * @private
   * @description Serializes a Vector uint
   * @param {Uint32Array} value
   * @returns {void}
   */
  private serializeVectorUint(value: Uint32Array): void {
    this.stream.writeUnsignedByte(Markers.VECTOR_UINT);

    const idx: number | boolean = this.reference.check('objectReferences', value);

    if (idx !== false) {
      return this.stream.writeUInt29(idx as number << 1);
    }

    this.stream.writeUInt29((value.length << 1) | 1);
    this.stream.writeBoolean(!Object.isExtensible(value));

    for (let i: number = 0; i < value.length; i++) {
      this.stream.writeUnsignedInt(value[i]);
    }
  }

  /**
   * @private
   * @description Serializes a Vector double
   * @param {Float64Array} value
   * @returns {void}
   */
  private serializeVectorDouble(value: Float64Array): void {
    this.stream.writeUnsignedByte(Markers.VECTOR_DOUBLE);

    const idx: number | boolean = this.reference.check('objectReferences', value);

    if (idx !== false) {
      return this.stream.writeUInt29(idx as number << 1);
    }

    this.stream.writeUInt29((value.length << 1) | 1);
    this.stream.writeBoolean(!Object.isExtensible(value));

    for (let i: number = 0; i < value.length; i++) {
      this.stream.writeDouble(value[i]);
    }
  }

  /**
   * @private
   * @description Serializes a set
   * @param {Set<any>} value
   * @returns {void}
   */
  private serializeSet(value: Set<any>): void {
    this.stream.writeUnsignedByte(Markers.SET);

    const idx: number | boolean = this.reference.check('objectReferences', value);

    if (idx !== false) {
      return this.stream.writeUInt29(idx as number << 1);
    }

    this.stream.writeUInt29((value.size << 1) | 1);

    for (const element of value) {
      this.serialize(element);
    }
  }
}
