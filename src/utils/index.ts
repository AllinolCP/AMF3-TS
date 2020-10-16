import { IExternalizable } from '../index';

/**
 * @exports
 */
export default {
  /**
   * @description Returns the byte length of a string
   * @param {string} str
   * @returns {number}
   */
  byteLength: (str: string): number => new TextEncoder().encode(str).length,
  /**
   * @description Returns whether the given class is Externalizable
   * @param {any} klass
   * @returns {boolean}
   */
  isExternalizableClass: (klass: any): klass is IExternalizable => ('writeExternal' in klass) && ('readExternal' in klass)
}
