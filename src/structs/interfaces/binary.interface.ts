/**
 * The `TrailerInterface` represents the structure of a Binary Property List (bplist) trailer.
 * The trailer is used in bplist files to store metadata about the objects, offsets, and sizes
 * necessary to decode the serialized data.
 *
 * - **Properties**:
 *   - `reserved`: An array of reserved bytes for padding or future use.
 *   - `sortVersion`: A `number` representing the version of the sorting algorithm used in the bplist.
 *   - `offsetTableOffsetSize`: A `number` indicating the size, in bytes, of each offset table entry.
 *   - `objectReferenceSize`: A `number` indicating the size, in bytes, of object references used in the bplist.
 *   - `numberOfObjects`: A `bigint` representing the total number of objects in the bplist.
 *   - `rootObjectOffset`: A `bigint` indicating the offset of the root object in the offset table.
 *   - `offsetTableOffset`: A `bigint` specifying the starting offset of the offset table in the bplist.
 *
 * ## Example:
 * ```ts
 * const trailer: TrailerInterface = {
 *     reserved: [0, 0, 0, 0, 0],
 *     sortVersion: 1,
 *     offsetTableOffsetSize: 2,
 *     objectReferenceSize: 2,
 *     numberOfObjects: 123n,
 *     rootObjectOffset: 15n,
 *     offsetTableOffset: 789n
 * };
 * console.log(trailer);
 * ```
 *
 * ## Notes:
 * - The `reserved` field is typically an array of five `0`s, though it may vary depending on implementation.
 * - The `sortVersion`, `offsetTableOffsetSize`, and `objectReferenceSize` fields provide essential metadata about the structure of the bplist file.
 * - The `numberOfObjects`, `rootObjectOffset`, and `offsetTableOffset` are encoded as `bigint` to accommodate large numbers.
 *
 * @interface
 */

export interface TrailerInterface {
    reserved: Array<number>;
    sortVersion: number;
    numberOfObjects: bigint;
    rootObjectOffset: bigint;
    offsetTableOffset: bigint;
    objectReferenceSize: number;
    offsetTableOffsetSize: number;
}

/**
 * The `BplistHeader` interface represents the structure of a Binary Property List (bplist) header.
 * The header contains metadata that identifies the file format and specifies the version of the bplist.
 *
 * - **Properties**:
 *   - `magic`: A string that identifies the file as a Binary Property List. Typically, this value is `bplist`.
 *   - `version`: A string that specifies the version of the bplist format. Common versions include `00` or `01`.
 *
 * ## Example:
 * ```ts
 * const header: BplistHeader = {
 *     magic: "bplist",
 *     version: "00"
 * };
 * console.log(`Magic: ${header.magic}, Version: ${header.version}`);
 * ```
 *
 * ## Notes:
 * - The `magic` field is used to validate that the file is indeed a Binary Property List.
 * - The `version` field ensures compatibility with the specific serialization and deserialization logic for the bplist version.
 * - Both fields are mandatory for parsing and interpreting the bplist file correctly.
 *
 * @interface
 */

export interface HeaderInterface {
    magic: string,
    version: string
}

/**
 * The `TypeInfoInterface` represents a structure that holds two related pieces of data: `type` and `info`.
 * It is used to store and manage encoded or decoded values, where:
 * - `type` represents a specific identifier or category (typically stored in the upper 4 bits of a value).
 * - `info` represents additional information or flags (typically stored in the lower 4 bits of a value).
 *
 * ## Example:
 * ```ts
 * const typeInfo: TypeInfoInterface = {
 *     type: 5,
 *     info: 3
 * };
 * console.log(typeInfo);
 * // Output: { type: 5, info: 3 }
 * ```
 *
 * ## Notes:
 * - Both `type` and `info` are 4-bit values (ranging from 0 to 15).
 * - This interface is typically used when working with encoded data where type and info are packed into a single value.
 * - The `type` and `info` values can be combined or split using bitwise operations, which is a common pattern for encoding and decoding binary data.
 *
 * @interface
 */

export interface TypeInfoInterface {
    type: number;
    info: number;
}
