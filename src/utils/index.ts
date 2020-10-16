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
   * @param {object} klass
   * @returns {boolean}
   */
  isExternalizableClass: (klass: object): klass is IExternalizable => ('writeExternal' in klass) && ('readExternal' in klass)
}
