/**
 * @exports
 * @class
 */
export class Reference {
  /**
   * @public
   * @description The current referenceable value
   * @type {string|object|null}
   */
  public dereferenced: string | object | null;
  /**
   * @public
   * @description The flags holding the remaining bits
   * @type {number}
   */
  public flags: number;
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
     * @description Initialize the referenceable value holder
     * @type {string|object|null}
     */
    this.dereferenced = null;
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
   * @private
   * @description Returns the table array by table string
   * @param {string} table
   * @returns {Array<string>|Array<object>}
   */
  private getTable(table: string): (string | object)[] {
    const tableMap: { [key: string]: (string | object)[]; } = {
      stringReferences: this.stringReferences,
      objectReferences: this.objectReferences,
      traitReferences: this.traitReferences
    };

    return tableMap[table];
  }

  /**
   * @public
   * @description Pops a flag to return the remaining bits
   * @returns {number}
   */
  public popFlag(): number {
    const ref: number = (this.flags & 1);

    this.flags >>= 1;

    return ref;
  }

  /**
   * @public
   * @description Returns whether a referenceable value exists and sets it
   * @param {string} table
   * @param {number} bits
   * @returns {boolean}
   */
  public get(table: string, bits: number = 0): boolean {
    this.dereferenced = null;

    if (table !== 'traitReferences') {
      this.flags = bits;
    }

    const isReference: boolean = !this.popFlag();

    if (isReference) {
      const tableArr: (string | object)[] = this.getTable(table);

      this.dereferenced = tableArr[this.flags];

      if (table === 'traitReferences') {
        this.dereferenced = JSON.parse(this.dereferenced as string);
      }
    }

    return isReference;
  }

  /**
   * @public
   * @description Checks whether the given value is referenceable and returns it's index or adds it
   * @param {string} table
   * @param {string|object} value
   * @returns {number|boolean}
   */
  public check(table: string, value: string | object): number | boolean {
    if (table === 'traitReferences') {
      value = JSON.stringify(value);
    }

    const tableArr: (string | object)[] = this.getTable(table);
    const idx: number = tableArr.indexOf(value);

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
    if (table === 'traitReferences' && typeof value !== 'string') {
      value = JSON.stringify(value);
    }

    const tableArr: (string | object)[] = this.getTable(table);

    tableArr[tableArr.length] = value;
  }
}
