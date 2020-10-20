import { Stream, ECMAArray } from '../index';
import { Mapping } from '../utils/mapping';
import { Reference } from '../utils/reference';
import { Markers } from '../enums/markers';

/**
 * @exports
 * @class
 */
export class Deserializer {
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
   * @description Deserializes AMF3 bytes to data
   * @returns {any}
   */
  public deserialize(): any {
    const marker: number = this.stream.readUnsignedByte();

    switch (marker) {
      case Markers.NULL: return this.deserializeNull();
      case Markers.UNDEFINED: return this.deserializeUndefined();
      case Markers.TRUE:
      case Markers.FALSE:
        return this.deserializeBoolean(marker);
      case Markers.INTEGER: return this.deserializeInteger();
      case Markers.DOUBLE: return this.deserializeDouble();
      case Markers.STRING: return this.deserializeString();
      case Markers.DATE: return this.deserializeDate();
      case Markers.ARRAY: return this.deserializeArray();
      //case Markers.OBJECT: return this.deserializeObject();
      case Markers.BYTEARRAY: return this.deserializeByteArray();
      default: throw new TypeError(`Unknown or unsupported marker found: '${marker}'.`);
    }
  }

  /**
   * @private
   * @description Deserializes a null
   * @returns {null}
   */
  private deserializeNull(): null {
    return null;
  }

  /**
   * @private
   * @description Deserializes an undefined
   * @returns {undefined}
   */
  private deserializeUndefined(): undefined {
    return undefined;
  }

  /**
   * @private
   * @description Deserializes a boolean
   * @param {number} marker
   * @returns {boolean}
   */
  private deserializeBoolean(marker: number): boolean {
    return (marker === Markers.TRUE);
  }

  /**
   * @private
   * @description Deserializes an integer
   * @returns {number}
   */
  private deserializeInteger(): number {
    return (this.stream.readUInt29() << 3 >> 3);
  }

  /**
   * @private
   * @description Deserializes a double
   * @returns {number}
   */
  private deserializeDouble(): number {
    return this.stream.readDouble();
  }

  /**
   * @private
   * @description Deserializes a string
   * @returns {string}
   */
  private deserializeString(): string {
    if (this.reference.get('stringReferences', this.stream.readUInt29())) {
      return this.reference.dereferenced as string;
    }

    const length: number = this.reference.flags;
    const value: string = length > 0 ? this.stream.readUTFBytes(length) : '';

    // Empty strings can't be referenced
    if (length > 0) {
      this.reference.add('stringReferences', value);
    }

    return value;
  }

  /**
   * @private
   * @description Deserializes a date
   * @returns {Date}
   */
  private deserializeDate(): Date {
    if (this.reference.get('objectReferences', this.stream.readUInt29())) {
      return this.reference.dereferenced as Date;
    }

    const value: Date = new Date(this.stream.readDouble());

    this.reference.add('objectReferences', value);

    return value;
  }

  /**
   * @private
   * @description Deserializes an array
   * @returns {ECMAArray}
   */
  private deserializeArray(): ECMAArray {
    if (this.reference.get('objectReferences', this.stream.readUInt29())) {
      return this.reference.dereferenced as ECMAArray;
    }

    const value: ECMAArray = [];
    const length: number = this.reference.flags;

    this.reference.add('objectReferences', value);

    // When the length is 0, it's an associative array, else it's normal or mixed
    if (length === 0) {
      for (let key: string = this.deserializeString(); key !== ''; key = this.deserializeString()) {
        value[key] = this.deserialize();
      }
    } else {
      const oldPos: number = this.stream.position;
      const isMixed: boolean = this.deserializeString() !== '';

      // Skip uint29 delimiter for normal arrays
      this.stream.position = isMixed ? oldPos : oldPos + 1;

      // Mixed arrays write the associative part first
      if (isMixed) {
        for (let key: string = this.deserializeString(); key !== ''; key = this.deserializeString()) {
          value[key] = this.deserialize();
        }
      } else {
        // Initialize length to make sparse entries
        value.length = length;
      }

      // Read the remaining values
      for (let i: number = 0; i < length; i++) {
        const deserialized: any = this.deserialize();

        // Avoid putting these in the array
        if (deserialized !== undefined && deserialized !== null) {
          value[i] = deserialized;
        }
      }
    }

    return value;
  }

  /**
   * @private
   * @description Deserializes a ByteArray
   * @returns {Stream}
   */
  private deserializeByteArray(): Stream {
    if (this.reference.get('objectReferences', this.stream.readUInt29())) {
      return this.reference.dereferenced as Stream;
    }

    const value: Stream = new Stream();
    const length: number = this.reference.flags;

    this.reference.add('objectReferences', value);
    this.stream.readBytes(value, 0, length);

    return value;
  }
}
