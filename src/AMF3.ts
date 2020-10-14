import { Serializer } from './core/serializer';
import { Deserializer } from './core/deserializer';
import { Stream } from './core/stream';
import { Mapping } from './utils/mapping';

/**
 * @exports
 * @abstract
 * @class
 */
export abstract class AMF3 {
  /**
   * @private
   * @static
   * @description Initialize the mapping holder
   * @type {Mapping}
   */
  private static mapping: Mapping = new Mapping();

  /**
   * @public
   * @static
   * @description Registers a class alias
   * @param {string} aliasName
   * @param {object} classObject
   * @returns {void}
   */
  public static registerClassAlias(aliasName: string, classObject: object): void {
    this.mapping.registerClassAlias(aliasName, classObject);
  }

  /**
   * @public
   * @static
   * @description Deregisters a class alias by alias or class
   * @param {string|object} value
   * @returns {void}
   */
  public static deregisterClassAlias(value: string | object): void {
    this.mapping.deregisterClassAlias(value);
  }

  /**
   * @public
   * @static
   * @description Returns whether the given alias or class is registered
   * @param {string|object} value
   * @returns {boolean}
   */
  public static isRegisteredClassAlias(value: string | object): boolean {
    return this.mapping.isRegisteredClassAlias(value);
  }

  /**
   * @public
   * @static
   * @description Deserializes AMF3 bytes to data
   * @param {Array<number>} bytes
   * @returns {any}
   */
  public static parse(bytes: number[]): any {
    const deserializer: Deserializer = new Deserializer({
      stream: new Stream(bytes),
      mapping: this.mapping
    });

    return deserializer.deserialize();
  }

  /**
   * @public
   * @static
   * @description Serializes data to AMF3 bytes
   * @param {any} data
   * @returns {Array<number>}
   */
  public static stringify(data: any): number[] {
    const serializer: Serializer = new Serializer({
      stream: new Stream(),
      mapping: this.mapping
    });

    serializer.serialize(data);

    return serializer.data;
  }
}
