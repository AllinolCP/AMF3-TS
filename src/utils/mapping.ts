import Utils from '../utils/index';

/**
 * @exports
 * @class
 */
export class Mapping {
  /**
   * @private
   * @description A weak map where registered aliases are stored by their class
   * @type {WeakMap<object, string>}
   */
  private classMapping: WeakMap<object, string>;
  /**
   * @private
   * @description A map where registered classes are stored by their alias
   * @type {Map<string, object>}
   */
  private aliasMapping: Map<string, object>;
  /**
   * @private
   * @description A dynamic property writer object
   * @type {object|null}
   */
  private dynamicPropertyWriter: object | null;

  /**
   * @constructor
   */
  constructor() {
    /**
     * @description Initialize the class map
     * @type {WeakMap<object, string>}
     */
    this.classMapping = new WeakMap();
    /**
     * @description Initialize the alias map
     * @type {Map<string, object>}
     */
    this.aliasMapping = new Map();
    /**
     * @description Initialize the dynamic property writer
     * @type {object|null}
     */
    this.dynamicPropertyWriter = null;
  }

  /**
   * @public
   * @description Sets the dynamic property writer
   * @param {object|null} dpw
   * @returns {void}
   */
  public setDynamicPropertyWriter(dpw: object | null): void {
    if (!Utils.isDynamicPropertyWriterClass(dpw as object)) {
      throw new TypeError('Dynamic property writers must be implemented by IDynamicPropertyWriter.')
    }

    this.dynamicPropertyWriter = dpw;
  }

  /**
   * @public
   * @description Returns the dynamic property writer
   * @returns {object|null}
   */
  public getDynamicPropertyWriter(): object | null {
    return this.dynamicPropertyWriter;
  }

  /**
   * @public
   * @description Returns whether a dynamic property writer is registered
   * @returns {boolean}
   */
  public hasDynamicPropertyWriter(): boolean {
    return this.dynamicPropertyWriter !== null;
  }

  /**
   * @public
   * @description Returns the alias of a class
   * @param {object} classObject
   * @returns {string}
   */
  public getQualifiedClassName(classObject: object): string {
    return this.classMapping.get(classObject)!;
  }

  /**
   * @public
   * @description Returns the class of an alias
   * @param {string} aliasName
   * @returns {object}
   */
  public getDefinitionByName(aliasName: string): object {
    return this.aliasMapping.get(aliasName)!;
  }

  /**
   * @public
   * @description Registers a class alias
   * @param {string} aliasName
   * @param {object} classObject
   * @returns {void}
   */
  public registerClassAlias(aliasName: string, classObject: object): void {
    this.classMapping.set(classObject, aliasName);
    this.aliasMapping.set(aliasName, classObject);
  }

  /**
   * @public
   * @description Deregisters a class alias by alias or class
   * @param {string|object} value
   * @returns {void}
   */
  public deregisterClassAlias(value: string | object): void {
    let classObject: object;
    let aliasName: string;

    if (typeof value === 'string') {
      classObject = this.getDefinitionByName(value);
      aliasName = this.getQualifiedClassName(classObject);
    } else {
      aliasName = this.getQualifiedClassName(value);
      classObject = this.getDefinitionByName(aliasName);
    }

    this.classMapping.delete(classObject);
    this.aliasMapping.delete(aliasName);
  }

  /**
   * @public
   * @description Returns whether the given alias or class is registered
   * @param {string|object} value
   * @returns {boolean}
   */
  public isRegisteredClassAlias(value: string | object): boolean {
    let hasClassObject: boolean;
    let hasAliasName: boolean;

    if (typeof value === 'string') {
      hasClassObject = this.aliasMapping.has(value);
      hasAliasName = this.classMapping.has(this.getDefinitionByName(value));
    } else {
      hasClassObject = this.classMapping.has(value);
      hasAliasName = this.aliasMapping.has(this.getQualifiedClassName(value));
    }

    return (hasClassObject && hasAliasName);
  }
}
