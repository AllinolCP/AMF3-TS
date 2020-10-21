import { IExternalizable, ECMAArray } from '../index';
import { IDynamicPropertyWriter } from '../interfaces/IDynamicPropertyWriter';

/**
 * @exports
 */
export default {
  /**
   * @description Returns whether the given type is a global object or a class
   * @param {string} type
   * @returns {boolean}
   */
  isClass: (type: string): boolean => [
    'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array',
    'Uint16Array', 'Float32Array', 'DataView', 'ArrayBuffer', 'WeakMap'
  ].indexOf(type) === -1,
  /**
   * @description Returns the byte length of a string
   * @param {string} str
   * @returns {number}
   */
  byteLength: (str: string): number => new TextEncoder().encode(str).length,
  /**
   * @description Returns whether the given array is associative
   * @param {ECMAArray} arr
   * @returns {boolean}
   */
  isAssociativeArray: (arr: ECMAArray): boolean => Object.keys(arr).length !== arr.length,
  /**
   * @description Returns whether the given class is Externalizable
   * @param {object} klass
   * @returns {boolean}
   */
  isExternalizableClass: (klass: object): klass is IExternalizable => ('writeExternal' in klass) && ('readExternal' in klass),
  /**
   * @description Returns whether the given class is a dynamic property writer
   * @param {object} klass
   * @returns {boolean}
   */
  isDynamicPropertyWriterClass: (klass: object): klass is IDynamicPropertyWriter => ('writeDynamicProperties' in klass)
}
