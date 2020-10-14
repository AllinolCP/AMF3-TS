/**
 * @exports
 * @enum
 */
export enum Markers {
  UNDEFINED = 0x00,
  NULL = 0x01,
  FALSE = 0x02,
  TRUE = 0x03,
  INTEGER = 0x04,
  DOUBLE = 0x05,
  STRING = 0x06,
  XML_DOCUMENT = 0x07,
  DATE = 0x08,
  ARRAY = 0x09,
  OBJECT = 0x0A,
  XML = 0x0B,
  BYTEARRAY = 0x0C,
  VECTOR_INT = 0x0D,
  VECTOR_UINT = 0x0E,
  VECTOR_DOUBLE = 0x0F,
  SET = 0x10, // Make use of the unsupported Vector object marker
  MAP = 0x011 // Make use of the unsupported dictionary marker
}
