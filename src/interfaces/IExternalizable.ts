import { IDataInput, IDataOutput } from '../index';

/**
 * @exports
 * @interface
 */
export interface IExternalizable {
  writeExternal: (output: IDataOutput) => void;
  readExternal: (input: IDataInput) => void;
}
