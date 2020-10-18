/**
 * @exports
 * @class
 */
export class Reference {
  /**
   * @private
   * @description The flags holding the remaining bits
   * @type {number}
   */
  private flags: number;
  /**
   * @private
   * @description The array holding the string references
   * @type {Array<string>}
   */
  private stringReferences: string[];
  /**
   * @private
   * @description The array holding the object references
   * @type {Array<object>}
   */
  private objectReferences: object[];
  /**
   * @private
   * @description The array holding the trait references
   * @type {Array<string>}
   */
  private traitReferences: string[];

  /**
   * @constructor
   */
  constructor() {
    /**
     * @description Initialize the flags holder
     * @type {number}
     */
    this.flags = 0;
    /**
     * @description Initialize the string reference holder
     * @type {Array<string>}
     */
    this.stringReferences = [];
    /**
     * @description Initialize the object reference holder
     * @type {Array<object>}
     */
    this.objectReferences = [];
    /**
     * @description Initialize the trait reference holder
     * @type {Array<string>}
     */
    this.traitReferences = [];
  }

  /**
   * @public
   * @description Pops a flag to retrieve the remaining bits
   * @returns {number}
   */
  public pop(): number {
    const ref: number = (this.flags & 1);

    this.flags >>= 1;

    return ref;
  }

  /**
   * @public
   * @description Checks whether the given value is referenceable and returns it's index or adds it
   * @param {string} table
   * @param {string|object} value
   * @returns {number|boolean}
   */
  public check(table: string, value: string | object): number | boolean {
    if ((table !== 'objectReferences') && (table !== 'objectReferences') && (table !== 'traitReferences')) {
      return false;
    }

    const idx: number = (table === 'objectReferences') ? this[table].indexOf(value as object) : this[table].indexOf(value as string);

    if (idx > -1) {
      return idx;
    } else {
      this.add(table, value);

      return false;
    }
  }

  /**
   * @public
   * @description Adds a new referenceable value
   * @param {string} table
   * @param {string|object} value
   * @returns {void}
   */
  public add(table: string, value: string | object): void {
    if (table === 'traitReferences') {
      value = JSON.stringify(value);
    }

    if ((table === 'stringReferences') || (table === 'objectReferences') || (table === 'traitReferences')) {
      this[table][this[table].length] = value;
    }
  }
}
