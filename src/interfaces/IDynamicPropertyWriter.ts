import { IDynamicPropertyOutput } from './IDynamicPropertyOutput';

/**
 * @exports
 * @interface
 */
export interface IDynamicPropertyWriter {
  writeDynamicProperties: (obj: Object, output: IDynamicPropertyOutput) => void;
}
