const fs = require('fs');
const util = require('util');

const read = util.promisify(fs.read);


module.exports = async function (fd, box) {
    const buffer = Buffer.alloc(box.size);
    await read(fd, buffer, 0, box.size, box.position);

    box.version = buffer.readUInt8(8);

    box.sampleSize = buffer.readInt32BE(12);
    box.numberOfEntries = buffer.readUInt32BE(16);
    box.sampleSizeTable = [];
    let position = 20;
    for (let i = 0; i < box.numberOfEntries; i++) {
        box.sampleSizeTable.push(buffer.readInt32BE(position));
        position += 4;
    }
}