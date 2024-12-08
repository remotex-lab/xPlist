/**
 * Imports
 */

import {
    encodeDateStruct,
    encodeFloatStruct,
    encodeInt,
    encodeTypeInfoStruct,
    isFloatPrecision
} from '@structs/binary.struct';

/**
 * The `calculateIntSize` function determines the minimum number of bytes required to encode
 * a given integer value (either `number` or `bigint`) in binary format.
 *
 * ## Input:
 * - **`value`**: A `number` or `bigint` representing the integer to evaluate.
 *   - `number`: Regular JavaScript integers (within the safe range of `-(2^53 - 1)` to `2^53 - 1`).
 *   - `bigint`: Arbitrarily large integers.
 *
 * ## Output:
 * - **Returns**: A `number` indicating the size (in bytes) required to encode the value:
 *   - `1`: Fits in 1-byte (Int8, range: -128 to 127).
 *   - `2`: Fits in 2-bytes (Int16, range: -32,768 to 32,767).
 *   - `4`: Fits in 4-bytes (Int32, range: -2,147,483,648 to 2,147,483,647).
 *   - `8`: Fits in 8-bytes (Int64, range: -2^63 to 2^63-1).
 *
 * ## Example Usage:
 * ```ts
 * // Valid cases
 * console.log(calculateIntSize(127));                    // Output: 1 (fits in Int8)
 * console.log(calculateIntSize(32_767));                // Output: 2 (fits in Int16)
 * console.log(calculateIntSize(2_147_483_647));         // Output: 4 (fits in Int32)
 * console.log(calculateIntSize(9_223_372_036_854_775_807n)); // Output: 8 (fits in Int64)
 *
 * // Throws an error for invalid cases
 * console.log(calculateIntSize(9_223_372_036_854_775_808n)); // Throws RangeError
 * console.log(calculateIntSize('not a number')); // Throws TypeError
 * ```
 *
 * ## Notes:
 * - **Overflow Protection**: The function enforces a strict limit on integer sizes:
 *   - Throws a `RangeError` if the value exceeds the Int64 range (`-(2^63)` to `2^63-1`).
 * - For `bigint` values, the function calculates the absolute value (`absValue`) before determining the required size.
 * - For `number` values, it ensures compatibility with signed integers by using `Math.abs()` internally.
 * - The function assumes that integers will be represented in **Big Endian** format during encoding.
 *
 * ## Exceptions:
 * - Throws `TypeError` if the input is neither a valid `number` nor a `bigint`.
 * - Throws `RangeError` if the input exceeds the valid range for Int64 encoding.
 *
 * @param value - The integer value (`number` or `bigint`) to evaluate.
 * @returns The size (in bytes) required to store the integer.
 * @throws `TypeError` if the input is not a valid integer or `bigint`.
 * @throws `RangeError` if the input exceeds the `Int64` range.
 */

export function calculateIntSize(value: number | bigint): 1 | 2 | 4 | 8 {
    if (typeof value !== 'bigint' && !Number.isInteger(value))
        throw new TypeError('The input must be a valid integer or BigInt.');

    const number = BigInt(value);
    const absValue = number < 0n ? -number : number;
    if (absValue > 0x7FFFFFFFFFFFFFFFn) {
        // Exceeds Int64 range
        throw new RangeError('The input exceeds the range of an 8-byte integer (Int64).');
    }

    if (absValue <= 0x7Fn) return 1; // Fits in 1 byte (Int8)
    if (absValue <= 0x7FFFn) return 2; // Fits in 2 bytes (Int16)
    if (absValue <= 0x7FFFFFFFn) return 4; // Fits in 4 bytes (Int32)

    return 8; // Fits in 8 bytes (Int64)
}

export function encodeType(data: number | string | boolean | Date | Array<unknown> | object): Buffer {
    if (data === null) {
        return Buffer.from([ 0x00 ]);
    } else if (data === false) {
        return Buffer.from([ 0x08 ]);
    } else if (data === true) {
        return Buffer.from([ 0x09 ]);
    } else if (typeof data === 'number') {
        if (Number.isInteger(data)) {
            const size = calculateIntSize(data);
            const info = Math.round(Math.sqrt(size - 1));
            const type = encodeTypeInfoStruct(0x1, info);
            const encode = encodeInt(data, size);

            return Buffer.from([ type, ...encode ]);
        }

        const size = isFloatPrecision(data) ? 4 : 8;
        const info = Math.round(Math.sqrt(size - 1));
        const type = encodeTypeInfoStruct(0x2, info);
        const encode = encodeFloatStruct(data, size);

        return Buffer.from([ type, ...encode ]);
    } else if (data instanceof Date) {
        return encodeDateStruct(data);
    } else if (Buffer.isBuffer(data)) {
        return Buffer.alloc(0);
    } else if (typeof data === 'string' && /^[\x00-\x7F]*$/.test(data)) {
        // Simple check for UTF-8 encoded strings (ASCII check)
        return Buffer.alloc(0);
    } else if (typeof data === 'string') {
        // If it's a string but not matching the UTF-8 pattern, it's UTF-16
        return Buffer.alloc(0);
    } else if (Array.isArray(data)) {
        return Buffer.alloc(0);
    } else if (data instanceof Set) {
        return Buffer.alloc(0);
    } else if (typeof data === 'object' && data !== null) {
        return Buffer.alloc(0);
    } else {
        throw new Error('Unsupported type');
    }
}


export function encodeBinary(data: unknown): Buffer {
    console.log(data);

    return Buffer.alloc(0);
}
