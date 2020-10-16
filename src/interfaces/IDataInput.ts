import { Stream } from '../core/stream';

/**
 * @exports
 * @interface
 */
export interface IDataInput {
  readonly bytesAvailable: number;
  endian: boolean;
  readBoolean: () => boolean;
  readByte: () => number;
  readUnsignedByte: () => number;
  readShort: () => number;
  readUnsignedShort: () => number;
  readInt: () => number;
  readUnsignedInt: () => number;
  readUTF: () => string;
  readUTFBytes: (length: number) => string;
  readFloat: () => number;
  readDouble: () => number;
  readBytes: (stream: Stream, offset?: number, length?: number) => void;
  readUInt29: () => number;
}
