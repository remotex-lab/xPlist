/**
 * The `parseTag` function generates an XML tag with the specified name and value. It supports special handling for
 * boolean values, which are represented in XML plist format as `<true/>` or `<false/>`.
 *
 * - **Input**:
 *   - `tag`: A string representing the name of the XML tag (e.g., `string`, `integer`, `real`).
 *   - `value`: The content to be wrapped inside the XML tag. If the value is a boolean, it is represented as `<true/>` or `<false/>`.
 *
 * - **Output**:
 *   - A string containing the XML representation of the tag and its value.
 *
 * ## Example:
 * ```ts
 * console.log(parseTag('string', 'Hello World')); // <string>Hello World</string>
 * console.log(parseTag('integer', 42));           // <integer>42</integer>
 * console.log(parseTag('', true));               // <true/>
 * console.log(parseTag('', false));              // <false/>
 * ```
 *
 * ## Error Handling:
 * - This function assumes that `value` is a valid input and does not perform additional type validation beyond checking for booleans.
 *
 * @param tag - The name of the XML tag to wrap the value with.
 * @param value - The value to be wrapped inside the XML tag. If the value is a boolean, it is handled as `<true/>` or `<false/>`.
 * @returns A string containing the XML representation of the tag and its value.
 */

function parseTag(tag: string, value: unknown): string {
    if (typeof value === 'boolean')
        return value ? '<true/>' : '<false/>';

    return `<${ tag }>${ value }</${ tag }>`;
}

/**
 * The `encodeValue` function recursively encodes a JavaScript value into its corresponding XML plist representation.
 * It supports standard plist-compatible types, including strings, numbers, booleans, arrays, and objects (dictionaries).
 *
 * - **Input**:
 *   - `value`: A JavaScript value to be encoded. Supported types include:
 *     - **string**: Encoded as `<string>value</string>`.
 *     - **number**: Encoded as `<integer>value</integer>` for integers or `<real>value</real>` for floating-point numbers.
 *     - **boolean**: Encoded as `<true/>` or `<false/>`.
 *     - **buffer**: Encoded as `<data>(base64)</data>`.
 *     - **array**: Encoded as `<array>...</array>` with child elements recursively encoded.
 *     - **object**: Encoded as `<dict>...</dict>` with keys as `<key>` and corresponding values recursively encoded.
 *
 * - **Output**:
 *   - A string containing the XML representation of the value.
 *
 * ## Example:
 * ```ts
 * const value = {
 *   key: "value",
 *   number: 42,
 *   flag: true,
 *   list: [1, 2, 3],
 *   nested: { subKey: "subValue" },
 * };
 *
 * const xmlFragment = encodeValue(value);
 * console.log(xmlFragment);
 * ```
 * Output:
 * ```xml
 * <dict>
 *   <key>key</key><string>value</string>
 *   <key>number</key><integer>42</integer>
 *   <key>flag</key><true/>
 *   <key>list</key><array><integer>1</integer><integer>2</integer><integer>3</integer></array>
 *   <key>nested</key><dict><key>subKey</key><string>subValue</string></dict>
 * </dict>
 * ```
 *
 * ## Error Handling:
 * - If the `value` is of an unsupported type (e.g., `undefined`, a function, or `null`), an error is thrown:
 *   ```ts
 *   throw new Error(`Unsupported data type: ${typeof value}`);
 *   ```
 * - Example of an unsupported type:
 *   ```ts
 *   encodeValue(() => {}); // Throws: Unsupported data type: function
 *   ```
 *
 * @param value - The JavaScript value to be encoded into its XML plist representation.
 * @returns A string containing the XML fragment representing the encoded value.
 * @throws {Error} If the input value is of an unsupported type.
 */

function encodeValue(value: unknown): string {
    if (typeof value === 'string') {
        return parseTag('string', value);
    } else if (typeof value === 'number') {
        return parseTag(Number.isInteger(value) ? 'integer' : 'real', value);
    } else if (typeof value === 'boolean') {
        return parseTag('', value);
    } else if (Buffer.isBuffer(value)) {
        return parseTag('data', value.toString('base64'));
    } else if (Array.isArray(value)) {
        return parseTag('array', value.map(encodeValue).join(''));
    } else if (typeof value === 'object') {
        const data = Object.entries(<object> value)
            .map(
                ([ key, val ]) =>
                    `<key>${ key }</key>${ encodeValue(val) }`
            )
            .join('');

        return parseTag('dict', data);
    }

    throw new Error(`Unsupported data type: ${ typeof value }`);
}

/**
 * The `encodePlist` function serializes a JavaScript object or value into a valid XML plist (Property List) format.
 * This method encodes various data types like strings, numbers, booleans, arrays, and objects, producing a plist-compliant XML string.
 *
 * The function uses recursive encoding for nested structures such as arrays and objects (dictionaries) and supports type-specific
 * plist tags like `<string>`, `<integer>`, `<real>`, `<array>`, and `<dict>`.
 *
 * - **Input**:
 *   - `value`: A JavaScript value to be serialized. The input can be of the following types:
 *     - **string**: Encoded as `<string>`.
 *     - **number**: Encoded as `<integer>` for whole numbers or `<real>` for floating-point numbers.
 *     - **boolean**: Encoded as `<true/>` or `<false/>`.
 *     - **buffer**: Encoded as `<data>(base64)</data>`.
 *     - **array**: Encoded as `<array>` with recursively encoded child elements.
 *     - **object**: Encoded as `<dict>` with keys encoded as `<key>` and corresponding values recursively encoded.
 *     - **null**: Not supported and will throw an error.
 *
 * - **Output**:
 *   - A string representing the serialized XML plist, including the required XML header, DOCTYPE declaration, and plist version.
 *
 * ## Example:
 * ```ts
 * const data = {
 *   key: "value",
 *   number: 42,
 *   flag: true,
 *   list: [1, 2, 3],
 *   nested: { subKey: "subValue" },
 * };
 *
 * const xmlPlist = encodePlist(data);
 * console.log(xmlPlist);
 * ```
 *
 * ## Error Handling:
 * - If the input `value` is `null`, an error is thrown:
 *   ```ts
 *   throw new Error('Input must be a valid JavaScript object.');
 *   ```
 * - If the `value` type is unsupported (e.g., `undefined` or a function), an error is thrown:
 *   ```ts
 *   throw new Error(`Unsupported data type: ${typeof value}`);
 *   ```
 *
 * @param value - The JavaScript object or value to be serialized into XML plist format.
 * @returns A string containing the XML representation of the plist.
 */

export function encodePlist(value: unknown): string {
    if (value === null) {
        throw new Error('Input must be a valid JavaScript object.');
    }

    const xmlVersion = '<?xml version="1.0" encoding="UTF-8"?>';
    const doctype = '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">';
    const plistVersion = '<plist version="1.0">';

    return `${ xmlVersion }${ doctype }${ plistVersion }${ encodeValue(value) }</plist>`;
}

export function encodeBinaryPlist(value: unknown): Buffer {
    return Buffer.alloc(15);
}
