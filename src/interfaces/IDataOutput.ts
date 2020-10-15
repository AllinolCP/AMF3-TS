import { Stream } from '../core/stream';

/**
 * @exports
 * @interface
 */
export interface IDataOutput {
  endian: boolean;
  writeByte: (value: number) => void;
  writeUnsignedByte: (value: number) => void;
  writeShort: (value: number) => void;
  writeUnsignedShort: (value: number) => void;
  writeInt: (value: number) => void;
  writeUnsignedInt: (value: number) => void;
  writeUTF: (value: string) => void;
  writeUTFBytes: (value: string) => void;
  writeFloat: (value: number) => void;
  writeDouble: (value: number) => void;
  writeBoolean: (value: boolean) => void;
  writeBytes: (stream: Stream, offset?: number, length?: number) => void;
  writeUInt29: (value: number) => void;
}
