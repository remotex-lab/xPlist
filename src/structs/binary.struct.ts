/**
 * Import will remove at compile time
 */

import type { TypeInfoInterface } from '@structs/interfaces/binary.interface';

/**
 * Imports
 */

import { Struct } from '@remotex-labs/xstruct';

/**
 * The `REFERENCE_DATE` constant represents a predefined reference date used for encoding and decoding date values.
 * It is set to January 1, 2001, at midnight UTC (Coordinated Universal Time).
 *
 * The `REFERENCE_DATE` is used as the baseline from which time differences (in seconds or milliseconds) are calculated
 * when encoding or decoding date structures. This allows for consistent date handling relative to a known starting point.
 *
 * - **Value**:
 *   - A `number` representing the timestamp for January 1, 2001, at 00:00:00 UTC.
 *   - The value is obtained using `Date.UTC(2001, 0, 1)`, which constructs a UTC timestamp for January 1, 2001.
 *
 * ## Example:
 * ```ts
 * const referenceDate = new Date(REFERENCE_DATE);
 * console.log(referenceDate.toISOString()); // Output: "2001-01-01T00:00:00.000Z"
 * ```
 *
 * ## Notes:
 * - The `REFERENCE_DATE` serves as a fixed point for calculating time deltas when encoding and decoding dates.
 * - This reference date is used in the encoding and decoding functions to ensure consistent handling of dates across the system.
 *
 * @constant
 */

const REFERENCE_DATE = Date.UTC(2001, 0, 1);

/**
 * Checks if a given number can be precisely represented as a 32-bit float.
 *
 * This function compares the given value with its 32-bit float representation. If the number
 * can be represented exactly as a 32-bit float (i.e., no loss of precision), the function
 * returns `true`. Otherwise, it returns `false`, indicating that the value requires more
 * precision (64-bit double precision).
 *
 * In JavaScript, numbers are represented as 64-bit floating-point (double precision), but
 * by using a `Float32Array`, we can simulate how a 32-bit float would represent the number.
 *
 * @param {number} value - The number to check for 32-bit float precision.
 * @returns {boolean} Returns `true` if the number can be precisely represented as a 32-bit float,
 *                   otherwise returns `false` if the number requires more precision (64-bit double).
 *
 * @example
 * isFloatPrecision(123.456); // true (can be represented as 32-bit float)
 * isFloatPrecision(123.456789123456789); // false (requires 64-bit double precision)
 *
 * @note This function helps detect whether a number can fit within the 32-bit floating point range.
 */

export function isFloatPrecision(value: number): boolean {
    // Convert the value to a 32-bit float
    const float32 = new Float32Array(1);
    float32[0] = value;

    return value === float32[0];
}

/**
 * The `headerStruct` defines the structure of the Binary Property List (bplist) header.
 * This structure is used to parse and validate the `magic` and `version` fields within a bplist file.
 * The `magic` field identifies the file format, and the `version` field specifies the version of the bplist.
 *
 * - **Properties**:
 *   - `magic`: A string field with a fixed size of 6-bytes, which represents the magic identifier of the bplist file.
 *   - `version`: A string field with a fixed size of 2-bytes, which represents the version of the bplist file.
 *
 * ## Example:
 * ```ts
 * const headerStruct = new Struct({
 *     'magic': { type: 'string', size: 6 },
 *     'version': { type: 'string', size: 2 }
 * });
 *
 * // Converting a buffer to an object
 * const headerData = headerStruct.toObject(buffer);
 * console.log(headerData); // Output: { magic: "bplist", version: "00" }
 *
 * // Creating a buffer from the header object
 * const headerBuffer = headerStruct.toBuffer({ magic: "bplist", version: "00" });
 * console.log(headerBuffer); // Output: Buffer with bplist header data
 * ```
 *
 * ## Notes:
 * - The `magic` field should be exactly 6 bytes, typically representing the string `bplist`.
 * - The `version` field should be exactly 2 bytes, typically representing the version identifier like `00` or `01`.
 * - The `headerStruct` can be used with a buffer containing the bplist header data for structured parsing or to generate a buffer from an object representation of the header.
 *
 * @class
 * @example
 * ```ts
 * const headerStruct = new Struct({
 *     'magic': { type: 'string', size: 6 },
 *     'version': { type: 'string', size: 2 }
 * });
 *
 * // Converting a buffer to an object
 * const header = headerStruct.toObject(buffer);
 * console.log(header.magic); // "bplist"
 * console.log(header.version); // "00"
 *
 * // Creating a buffer from the header object
 * const headerBuffer = headerStruct.toBuffer({ magic: "bplist", version: "00" });
 * console.log(headerBuffer); // Output: Buffer with bplist header data
 * ```
 */

export const headerStruct = new Struct({
    'magic': { type: 'string', size: 6 },
    'version': { type: 'string', size: 2 }
});

/**
 * The `trailerStruct` defines the structure of the Binary Property List (bplist) trailer.
 * This structure is used to parse and validate the trailer section of the bplist file, which contains metadata
 * about the number of objects, offsets, and sizes needed to decode the serialized data.
 *
 * - **Properties**:
 *   - `unused`: A 5-byte array of `UInt8` values, typically unused and reserved for future use or padding.
 *   - `sortVersion`: A single `UInt8` byte that represents the sort version of the bplist file.
 *   - `offsetTableOffsetSize`: A single `UInt8` byte indicating the number of bytes needed for each offset table offset.
 *   - `objectReferenceSize`: A single `UInt8` byte indicating the number of bytes needed for each object reference in the bplist file.
 *   - `numberOfObjects`: A `BigUInt64BE` (Big-endian unsigned 64-bit integer) representing the total number of objects in the bplist.
 *   - `rootObjectOffset`: A `BigUInt64BE` (Big-endian unsigned 64-bit integer) specifying the offset of the root object.
 *   - `offsetTableOffset`: A `BigUInt64BE` (Big-endian unsigned 64-bit integer) specifying the starting offset of the offset table.
 *
 * ## Example:
 * ```ts
 * const trailerStruct = new Struct({
 *     'unused': 'UInt8[5]',
 *     'sortVersion': 'UInt8',
 *     'offsetTableOffsetSize': 'UInt8',
 *     'objectReferenceSize': 'UInt8',
 *     'numberOfObjects': 'BigUInt64BE',
 *     'rootObjectOffset': 'BigUInt64BE',
 *     'offsetTableOffset': 'BigUInt64BE'
 * });
 *
 * // Converting a buffer to an object
 * const trailerData = trailerStruct.toObject(buffer);
 * console.log(trailerData);
 * // Output: {
 * //      unused: [0, 0, 0, 0, 0],
 * //      sortVersion: 1,
 * //      offsetTableOffsetSize: 2,
 * //      objectReferenceSize: 2,
 * //      numberOfObjects: 123456789n,
 * //      rootObjectOffset: 987654321n,
 * //      offsetTableOffset: 123456789n
 * // }
 *
 * // Creating a buffer from the trailer object
 * const trailerBuffer = trailerStruct.toBuffer({
 *     unused: [0, 0, 0, 0, 0],
 *     sortVersion: 1,
 *     offsetTableOffsetSize: 2,
 *     objectReferenceSize: 2,
 *     numberOfObjects: 123456789n,
 *     rootObjectOffset: 987654321n,
 *     offsetTableOffset: 123456789n
 * });
 * console.log(trailerBuffer); // Output: Buffer with trailer data
 * ```
 *
 * ## Notes:
 * - The `unused` field is reserved and typically contains an array of five `0`s but may vary depending on implementation.
 * - The `sortVersion`, `offsetTableOffsetSize`, and `objectReferenceSize` provide essential metadata about the bplist file's structure.
 * - The `BigUInt64BE` type ensures that large integers are handled in Big-endian byte order, which is common in binary file formats.
 * - The trailer section is essential for correctly parsing the objects and offsets in the bplist file.
 *
 * @class
 * @example
 * ```ts
 * const trailerStruct = new Struct({
 *     'unused': 'UInt8[5]',
 *     'sortVersion': 'UInt8',
 *     'offsetTableOffsetSize': 'UInt8',
 *     'objectReferenceSize': 'UInt8',
 *     'numberOfObjects': 'BigUInt64BE',
 *     'rootObjectOffset': 'BigUInt64BE',
 *     'offsetTableOffset': 'BigUInt64BE'
 * });
 *
 * // Converting a buffer to an object
 * const trailer = trailerStruct.toObject(buffer);
 * console.log(trailer.unused); // [0, 0, 0, 0, 0]
 * console.log(trailer.sortVersion); // 1
 * console.log(trailer.offsetTableOffsetSize); // 2
 * console.log(trailer.objectReferenceSize); // 2
 * console.log(trailer.numberOfObjects); // 123456789n
 * console.log(trailer.rootObjectOffset); // 987654321n
 * console.log(trailer.offsetTableOffset); // 123456789n
 *
 * // Creating a buffer from the trailer object
 * const trailerBuffer = trailerStruct.toBuffer({
 *     unused: [0, 0, 0, 0, 0],
 *     sortVersion: 1,
 *     offsetTableOffsetSize: 2,
 *     objectReferenceSize: 2,
 *     numberOfObjects: 123456789n,
 *     rootObjectOffset: 987654321n,
 *     offsetTableOffset: 123456789n
 * });
 * console.log(trailerBuffer); // Output: Buffer with trailer data
 * ```
 */

export const trailerStruct = new Struct({
    'unused': 'UInt8[5]',
    'sortVersion': 'UInt8',
    'offsetTableOffsetSize': 'UInt8',
    'objectReferenceSize': 'UInt8',
    'numberOfObjects': 'BigUInt64BE',
    'rootObjectOffset': 'BigUInt64BE',
    'offsetTableOffset': 'BigUInt64BE'
});

/**
 * Decodes a custom date structure from a `Buffer` and returns a corresponding `Date` object.
 *
 * This function reads the encoded date from the given `Buffer` at the specified `offset`,
 * extracting the delta time (in seconds) from a reference date (`REFERENCE_DATE`). The function
 * then reconstructs the original `Date` object based on the delta time, relative to the reference date.
 *
 * - **Input**:
 *   - `buffer`: A `Buffer` containing the encoded date structure.
 *   - `offset`: The offset position within the `Buffer` where the date data starts.
 *
 * - **Output**:
 *   - A `Date` object representing the decoded date, which is reconstructed using the reference date
 *     and the delta time.
 *
 * ## Example:
 * ```ts
 * const buffer = Buffer.from([...]); // Buffer containing encoded date data
 * const decodedDate = decodeDateStruct(buffer, 0);
 * console.log(decodedDate);  // Decoded Date object
 * ```
 *
 * ## Notes:
 * - The function assumes a reference date (`REFERENCE_DATE`) is defined elsewhere in the code.
 * - The delta time (the difference in seconds between the provided date and the reference date) is
 *   read from the buffer as a 64-bit big-endian floating-point number.
 * - The reference date is used as the starting point (e.g., January 1, 2001, UTC) to reconstruct
 *   the original `Date`.
 *
 * @param buffer - The `Buffer` containing the encoded date structure.
 * @param offset - The offset within the buffer where the encoded date data starts.
 * @returns A `Date` object corresponding to the decoded date.
 */

export function decodeDateStruct(buffer: Buffer, offset: number): Date {
    const dateDouble: number = buffer.readDoubleBE(offset + 1); // Big-endian 64-bit float
    const baseDate = new Date(REFERENCE_DATE); // Jan 1, 2001, UTC
    baseDate.setSeconds(dateDouble - baseDate.getUTCSeconds());

    return baseDate;
}

/**
 * Encodes a `Date` object into a `Buffer` in a custom date structure format.
 *
 * This function encodes the given `Date` by calculating the delta time (difference in milliseconds)
 * between the provided date and a reference date (`REFERENCE_DATE`). It then stores the encoded
 * result into a `Buffer` with a specific structure, including type information and the delta time
 * in seconds.
 *
 * - **Input**:
 *   - `date`: A `Date` object representing the date to encode.
 *
 * - **Output**:
 *   - A `Buffer` that contains the encoded date structure. The structure includes:
 *     - 1 byte for the type information, encoded using `encodeTypeInfoStruct`.
 *     - 8 bytes for the delta time (the difference between the given date and the reference date),
 *       encoded as a 64-bit big-endian floating-point number (in seconds).
 *
 * ## Example:
 * ```ts
 * const date = new Date('2024-12-10T00:00:00Z');
 * const encodedDate = encodeDateStruct(date);
 * console.log(encodedDate);  // Buffer containing encoded date structure
 * ```
 *
 * ## Notes:
 * - The function assumes a reference date (`REFERENCE_DATE`) is defined elsewhere in the code.
 * - The type information for the encoded structure is set using `encodeTypeInfoStruct(0x3, 0x3)`.
 * - The delta time is the difference between the given date and the reference date, in seconds.
 *   This is stored as a 64-bit floating-point number (double precision).
 *
 * @param date - The `Date` object to encode.
 * @returns A `Buffer` containing the encoded date structure.
 */

export function encodeDateStruct(date: Date): Buffer {
    const baseDate = new Date(REFERENCE_DATE);
    const deltaTime =  date.getTime() - baseDate.getTime();
    const buffer = Buffer.alloc(9);
    buffer.writeInt8(encodeTypeInfoStruct(0x3, 0x3));
    buffer.writeDoubleBE(deltaTime / 1000, 1); // Convert milliseconds to seconds

    return buffer;
}

/**
 * The `decodeFloatStruct` function decodes a `Buffer` into a floating-point number (float or double),
 * based on the size specified (either 4-bytes or 8-bytes).
 *
 * - **Input**:
 *   - `buffer`: The `Buffer` that contains the byte data to decode.
 *   - `offset`: The position in the `buffer` to start decoding the float.
 *   - `size`: The number of bytes to decode. This should be either 4-bytes for a single-precision float or 8 for a double-precision float.
 *
 * - **Output**:
 *   - A floating-point number (either float or double) extracted from the `buffer` at the given `offset`.
 *
 * ## Example:
 * ```ts
 * const buffer = Buffer.from([0x3f, 0x80, 0x00, 0x00]); // A buffer representing a 4-byte float
 * const decodedFloat = decodeFloatStruct(4, buffer, 0);
 * console.log(decodedFloat); // Output: 1.0 (since 0x3f800000 is the IEEE 754 representation of 1.0)
 * ```
 *
 * ## Notes:
 * - The function uses Big Endian byte order for decoding.
 * - The `Buffer.readFloatBE` and `Buffer.readDoubleBE` methods are used for decoding.
 * - The `size` must be either 4 (single-precision) or 8 (double-precision).
 *
 * @param buffer - The buffer containing the encoded float data.
 * @param offset - The offset in the buffer where the float data begins.
 * @param size - The number of bytes to decode (either 4 or 8).
 * @returns The decoded float or double value.
 */

export function decodeFloatStruct(buffer: Buffer, offset: number, size: 4 | 8): number {
    if (size === 4) {
        return buffer.readFloatBE(offset); // 4-byte single-precision float (Big Endian)
    } else if (size === 8) {
        return buffer.readDoubleBE(offset); // 8-byte double-precision float (Big Endian)
    }

    throw new Error(`Unsupported float size: ${ size }`);
}

/**
 * The `encodeFloatStruct` function encodes a floating-point number (float or double)
 * into a `Buffer` based on the specified size (either 4-bytes or 8-bytes).
 *
 * - **Input**:
 *   - `value`: The floating-point number to encode.
 *   - `size`: The number of bytes to encode. This should be either 4-bytes for a single-precision float or 8 for a double-precision float.
 *
 * - **Output**:
 *   - A `Buffer` containing the encoded float (either 4-bytes or 8-bytes).
 *
 * ## Example:
 * ```ts
 * const encodedFloat = encodeFloatStruct(4, 1.0); // Encode as a 4-byte float
 * console.log(encodedFloat); // Output: Buffer with the encoded float (0x3f800000)
 * ```
 *
 * ## Notes:
 * - The function uses Big Endian byte order for encoding.
 * - The `Buffer.writeFloatBE` and `Buffer.writeDoubleBE` methods are used for encoding.
 * - The `size` must be either 4 (single-precision) or 8 (double-precision).
 *
 * @param value - The floating-point number to encode.
 * @param size - The number of bytes to encode (either 4 or 8).
 * @returns A `Buffer` containing the encoded float or double value.
 */

export function encodeFloatStruct(value: number, size: 4 | 8): Buffer {
    const buffer = Buffer.alloc(size);

    if (size === 4) {
        buffer.writeFloatBE(value, 0); // Encode as 4-byte single-precision float (Big Endian)
    } else if (size === 8) {
        buffer.writeDoubleBE(value, 0); // Encode as 8-byte double-precision float (Big Endian)
    } else {
        throw new Error(`Unsupported float size: ${ size }`);
    }

    return buffer;
}

/**
 * The `encodeTypeInfoStruct` function combines two 4-bit values (`type` and `info`) into a single 8-bit value.
 * It encodes the `type` by shifting it to the upper 4 bits and combines it with the `info` in the lower 4 bits.
 *
 * ## Input:
 * - **`type`**: A `number` representing the 4-bit `type` value (0-15).
 * - **`info`**: A `number` representing the 4-bit `info` value (0-15).
 *
 * ## Output:
 * - Returns a `number` representing the combined 8-bit value, where:
 *   - The upper 4-bits store the `type`.
 *   - The lower 4-bits store the `info`.
 *
 * ## Example Usage:
 * ```ts
 * const encoded = encodeTypeInfoStruct(5, 3);
 * console.log(encoded);
 * // Output: 83
 * // Explanation: (5 << 4) | 3 = 83 (binary: 01010011)
 * ```
 *
 * ## Notes:
 * - The function ensures that `type` and `info` are within the valid range of 0 to 15.
 * - The `type` is shifted left by 4 bits to make room for the `info`, which is then combined using the bitwise OR (`|`).
 *
 * @param type - The 4-bit `type` value (0-15).
 * @param info - The 4-bit `info` value (0-15).
 * @returns The combined 8-bit encoded value.
 * @throws `RangeError` if `type` or `info` is outside the valid range of 0-15.
 */

export function encodeTypeInfoStruct(type: number, info: number): number {
    if (type < 0 || type > 15 || info < 0 || info > 15) {
        throw new RangeError('Both type and info must be in the range 0-15.');
    }

    // Shift the `type` to the upper 4 bits and combine with `info` in the lower 4 bits
    return (type << 4) | info;
}

/**
 * The `decodeTypeInfoStruct` function extracts the `type` and `info` values from an 8-bit value.
 * It separates the upper 4 bits as the `type` and the lower 4 bits as the `info`.
 *
 * ## Input:
 * - **`value`**: A `number` representing the 8-bit combined value to decode.
 *
 * ## Output:
 * - Returns an object with two properties:
 *   - `type`: The extracted 4-bit `type` value (0-15).
 *   - `info`: The extracted 4-bit `info` value (0-15).
 *
 * ## Example Usage:
 * ```ts
 * const result = decodeTypeInfoStruct(83);
 * console.log(result);
 * // Output: { type: 5, info: 3 }
 * // Explanation: 83 (binary: 01010011) -> type = 5, info = 3
 * ```
 *
 * ## Notes:
 * - The function uses bitwise operations to separate the 8-bit value into its `type` and `info` components.
 * - The `type` is extracted by shifting the value to the right by 4 bits, and the `info` is extracted using a mask to get the lower 4 bits.
 *
 * @param value - The 8-bit value to decode.
 * @returns An object with `type` and `info` properties, each within the range of 0 to 15.
 */

export function decodeTypeInfoStruct(value: number): TypeInfoInterface {
    const info = value & 0xF;
    const type = value >> 4;

    return { type, info };
}

/**
 * Encodes an integer into a Buffer based on its byte size (1, 2, 4, or 8 bytes).
 *
 * This function supports encoding both `number` and `bigint` values.
 * The number of bytes used for encoding depends on the `size` parameter.
 *
 * - **Input**:
 *   - `value`: The integer value to encode, which can be either a `number` or a `bigint`.
 *   - `size`: The number of bytes to encode the integer. Must be one of the following:
 *     - `1`: Encode as a 1-byte integer (Int8).
 *     - `2`: Encode as a 2-byte integer (Int16).
 *     - `4`: Encode as a 4-byte integer (Int32).
 *     - `8`: Encode as an 8-byte integer (Int64).
 *
 * - **Output**:
 *   - A `Buffer` containing the encoded integer in the specified byte size.
 *
 * ## Example:
 * ```ts
 * const buffer1 = encodeInt(127, 1);  // 1-byte (Int8)
 * const buffer2 = encodeInt(32767, 2); // 2-byte (Int16)
 * const buffer4 = encodeInt(2147483647, 4); // 4-byte (Int32)
 * const buffer8 = encodeInt(9223372036854775807n, 8); // 8-byte (Int64)
 * ```
 *
 * ## Notes:
 * - The `value` can either be a `number` or a `bigint`. If it's a `number`, it is converted to `bigint` when encoding as 8 bytes (Int64).
 * - For the 1, 2, and 4-byte encodings, the function uses Big Endian byte order.
 * - Throws an error if the `size` is not 1, 2, 4, or 8.
 *
 * @param value - The integer value to encode.
 * @param size - The number of bytes to encode the integer (1, 2, 4, or 8).
 * @returns A `Buffer` containing the encoded integer.
 * @throws Error if the `size` is not 1, 2, 4, or 8.
 */

export function encodeInt(value: number | bigint, size: 1 | 2 | 4 | 8): Buffer {
    const buffer = Buffer.alloc(size);

    if (size === 1) {
        buffer.writeInt8(Number(value), 0);
    } else if (size === 2) {
        buffer.writeInt16BE(Number(value), 0);
    } else if (size === 4) {
        buffer.writeInt32BE(Number(value), 0);
    } else if (size === 8) {
        if (typeof value === 'bigint') {
            buffer.writeBigInt64BE(value, 0);
        } else {
            buffer.writeBigInt64BE(BigInt(value), 0);
        }
    } else {
        throw new Error('Unsupported size. Supported sizes are 1, 2, 4, or 8 bytes.');
    }

    return buffer;
}

/**
 * Decodes an integer from a Buffer based on its byte size (1, 2, 4, or 8 bytes).
 *
 * This function supports decoding integers that were encoded with 1, 2, 4, or 8 bytes.
 *
 * - **Input**:
 *   - `buffer`: The `Buffer` containing the encoded integer.
 *   - `size`: The number of bytes used to encode the integer. Must be one of the following:
 *     - `1`: Decode from a 1-byte integer (Int8).
 *     - `2`: Decode from a 2-byte integer (Int16).
 *     - `4`: Decode from a 4-byte integer (Int32).
 *     - `8`: Decode from an 8-byte integer (Int64).
 *
 * - **Output**:
 *   - A `number` or `bigint` representing the decoded integer value.
 *
 * ## Example:
 * ```ts
 * const decoded1 = decodeInt(buffer1, 1);  // Decodes 1-byte (Int8)
 * const decoded2 = decodeInt(buffer2, 2);  // Decodes 2-byte (Int16)
 * const decoded4 = decodeInt(buffer4, 4);  // Decodes 4-byte (Int32)
 * const decoded8 = decodeInt(buffer8, 8);  // Decodes 8-byte (Int64)
 * ```
 *
 * ## Notes:
 * - The function uses Big Endian byte order to decode the integer.
 * - For 1, 2, and 4-byte integers, the result is a `number`. For 8-byte integers, the result is a `bigint`.
 * - Throws an error if the `size` is not 1, 2, 4, or 8.
 *
 * @param buffer - The `Buffer` containing the encoded integer.
 * @param size - The number of bytes used to encode the integer (1, 2, 4, or 8).
 * @returns The decoded integer value (`number` or `bigint`).
 * @throws Error if the `size` is not 1, 2, 4, or 8.
 */

export function decodeInt(buffer: Buffer, size: 1 | 2 | 4 | 8): number | bigint {
    if (size === 1) {
        return buffer.readInt8(0);
    } else if (size === 2) {
        return buffer.readInt16BE(0);
    } else if (size === 4) {
        return buffer.readInt32BE(0);
    } else if (size === 8) {
        return buffer.readBigInt64BE(0);
    } else {
        throw new Error('Unsupported size. Supported sizes are 1, 2, 4, or 8 bytes.');
    }
}
