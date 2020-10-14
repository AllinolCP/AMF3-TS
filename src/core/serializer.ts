import { Stream } from './stream';
import { Mapping } from '../utils/mapping';
import { Markers } from '../enums/markers';
import { ECMAArray } from '../index';

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
  }

  /**
   * @description Returns the data of the stream
   * @returns {Array<number>}
   */
  get data(): number[] {
    return this.stream.data;
  }

  /**
   * @public
   * @description Serializes data to AMF3 bytes
   * @param {any} data
   * @returns {void}
   */
  public serialize(data: any): void {
    if (data === null) {
      this.serializeNull();
    } else if (data === undefined) {
      this.serializeUndefined();
    } else {
      const type: Function = data.constructor;

      switch (type) {
        case Boolean: this.serializeBoolean(data); break;
        case Number: this.serializeInteger(data); break;
        default: throw new TypeError('Todo.');
      }
    }
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
}
