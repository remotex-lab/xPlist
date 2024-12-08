//
// console.log(encodePlist('test'));
// console.log(encodePlist(1.3));
// console.log(encodePlist(1));
// console.log(encodePlist(true));
// console.log(encodePlist(false));
// console.log(encodePlist([ 'test', 123, 33.1, { name: 'x' }, [ 12, 1.1, true, false ] ]));
// console.log(encodePlist({
//     name: [ 'test', 123, 33.1, true, false ],
//     x: { value: [ 'test', 123, 33.1, true, false ] }
// }));
//
// const x = encodeBinaryPlist('test').toString('hex');
// const x1 = encodeBinaryPlist(1.3).toString('hex');
// const x2 = encodeBinaryPlist(1).toString('hex');
// const x3 = encodeBinaryPlist(true).toString('hex');
// const x4 = encodeBinaryPlist(false).toString('hex');
// const x5 = encodeBinaryPlist([ 'test', 123, 33.1, { name: 'x' }, [ 12, 1.1, true, false ] ]).toString('hex');
// const x6 = encodeBinaryPlist({
//     name: [ 'test', 123, 33.1, true, false ],
//     x: { value: [ 'test', 123, 33.1, true, false ] }
// }).toString('hex');
//
// writeFileSync('x', x);
// writeFileSync('x1', x1);
// writeFileSync('x2', x2);
// writeFileSync('x3', x3);
// writeFileSync('x4', x4);
// writeFileSync('x5', x5);
// writeFileSync('x6', x6);

// console.log(encodeBinaryPlist('X').toString('hex'));

// // Example usage
// const inputString = 'X';
// const binaryPlist = encodeBinaryPlist(inputString);
//
// // Log the binary plist buffer in hex format for visualization
// console.log(binaryPlist.toString('hex'));
// // writeFileSync('x', encodeBinaryPlist('X'), 'binary');
// writeFileSync('x', Buffer.from('62706c6973743030515808000000000000010100000000000000010000000000000000000000000000000a', 'hex'), 'binary');

import { Struct } from '@remotex-labs/xstruct';
const headerStruct = new Struct({
    'header': { type: 'string', size: 6 },
    'version': { type: 'string', size: 2 }
});

const trailerStruct = new Struct({
    'unused': 'UInt8[5]',
    'sortVersion': 'UInt8',
    'offsetIntSize': 'UInt8',
    'objectRefSize': 'UInt8',
    'numObjects': 'BigUInt64BE',
    'offsetTableOffset': 'BigUInt64BE'
});

const data = Buffer.from('62706c69737430305f10c841414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141410800000000000001010000000000000001000000000000000000000000000000d3', 'hex');
const header = data.subarray(0, 8);
const trailer = data.subarray(data.length - 32);

const headerObject = headerStruct.toObject<{ [key: string]: any }>(header);
const trailerObject = trailerStruct.toObject<{ [key: string]: any }>(trailer);

console.log('Header:', headerObject);
console.log('Trailer:', trailerObject);

const content = data.subarray(8 + Number(trailerObject.offsetTableOffset), data.length - 32);

function removeBitsAndRead(buffer: Buffer, size = 4) {
    // Ensure that size is valid (1, 2, 4, or 8)
    if (![ 1, 2, 4, 8 ].includes(size)) {
        throw new Error('Only 1, 2, 4, or 8 bits can be removed.');
    }

    // Extract the first byte
    const firstByte = buffer[0];

    // Always extract the first 4 bits from the first byte
    const mask = 0xF; // 4 bits mask (1111 in binary)
    const extractedBits = (firstByte >> 4) & mask;

    // Remove the first 4 bits by shifting and masking
    const modifiedFirstByte = firstByte & 0xF; // Clear the first 4 bits

    // Create a new buffer with the modified first byte and the rest of the buffer
    const modifiedBuffer = Buffer.from([ modifiedFirstByte, ...buffer.subarray(1) ]);

    // Based on the size, read the appropriate value from the modified buffer
    let result;
    if (size === 1) {
        // Read UInt8 if only 1 byte is needed
        result = modifiedBuffer.readUInt8(0);
    } else if (size === 2) {
        // Read UInt16BE if 2 bytes are needed
        result = modifiedBuffer.readUInt16BE(0);
    } else if (size === 4) {
        // Read UInt32BE if 4 bytes are needed
        result = modifiedBuffer.readUInt32BE(0);
    } else if (size === 8) {
        // Read BigInt64BE if 8 bytes are needed
        result = modifiedBuffer.readBigUInt64BE(0);
    }

    // Return the extracted bits and the resulting integer value
    return { extractedBits, result };
}

let tempBuffer = content;
for (let i = 0; i < Number(trailerObject.numObjects); i++) {
    const offset_entry = tempBuffer.subarray(0, trailerObject.offsetIntSize);
    tempBuffer = tempBuffer.subarray(trailerObject.offsetIntSize);

    console.log(offset_entry);

    console.log(tempBuffer.readUInt8(1));

    // const u = removeBitsAndRead(offset_entry, trailerObject.offsetIntSize);

    // console.log(u, offset_entry);
    // if (u.result === 15) {
    //     console.log('x');
    //     console.log(tempBuffer);
    //     console.log(tempBuffer.readUInt16BE(0));
    // }

}

// plistlib.dumps('A' * 200, fmt=plistlib.FMT_BINARY).hex()
