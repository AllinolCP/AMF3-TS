import { Stream } from './stream';
import { Mapping } from '../utils/mapping';
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
   * @public
   * @description Deserializes AMF3 bytes to data
   * @returns {any}
   */
  public deserialize(): any {
    const marker: number = this.stream.readUnsignedByte();

    switch (marker) {
      case Markers.NULL: return this.deserializeNull();
      case Markers.UNDEFINED: return this.deserializeUndefined();
      case Markers.TRUE: return this.deserializeBoolean(marker);
      case Markers.FALSE: return this.deserializeBoolean(marker);
      case Markers.INTEGER: return this.deserializeInteger();
      case Markers.DOUBLE: return this.deserializeDouble();
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
}
