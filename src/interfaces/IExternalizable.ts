import { IDataInput } from './IDataInput';
import { IDataOutput } from './IDataOutput';

/**
 * @exports
 * @interface
 */
export interface IExternalizable {
  writeExternal: (output: IDataOutput) => void;
  readExternal: (input: IDataInput) => void;
}
