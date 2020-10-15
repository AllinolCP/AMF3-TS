/**
 * @exports
 */
export default {
  /**
   * @description Returns the byte length of a string
   * @param {string} str
   * @returns {number}
   */
  byteLength: (str: string): number => new TextEncoder().encode(str).length
}
