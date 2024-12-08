import { encodeType } from '@components/binary.component';
import { decodeDateStruct, encodeDateStruct } from '@structs/binary.struct';

// console.log(encodeType(2.2));

const date = new Date(2024, 11, 10, 5, 55, 54, 0);
console.log(date);
const y = encodeDateStruct(date);
console.log(y);

console.log(decodeDateStruct(y, 0));
console.log(decodeDateStruct(Buffer.from('3341c68407b50000000', 'hex'), 0).toISOString());
