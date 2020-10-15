import { IDataOutput } from './IDataOutput';
import { IDataInput } from './IDataInput';

/**
 * @exports
 * @interface
 */
export interface IExternalizable {
  writeExternal: (output: IDataOutput) => void;
  readExternal: (input: IDataInput) => void;
}
