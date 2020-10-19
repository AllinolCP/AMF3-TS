import { Stream } from './stream';
import { Mapping } from '../utils/mapping';
import { Reference } from '../utils/reference';
import { Markers } from '../enums/markers';
import { ECMAArray } from '../index';
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

    // An associative array containing array elements must write the length
    if (!isAssociative || value.length !== 0) {
      this.stream.writeUInt29((value.length << 1) | 1);
    }

    this.stream.writeUInt29(1);

    for (const key in value) {
      if (isNaN(key as any)) {
        this.serializeString(key, false);
      }

      this.serialize(value[key]);
    }

    // An associative array containing no array elements must end with uint29
    if (isAssociative && value.length === 0) {
      this.stream.writeUInt29(1);
    }
  }
}
