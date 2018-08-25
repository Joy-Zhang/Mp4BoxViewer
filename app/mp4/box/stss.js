const fs = require('fs');
const util = require('util');

const read = util.promisify(fs.read);


module.exports = async function (fd, box) {
    const buffer = Buffer.alloc(box.size);
    await read(fd, buffer, 0, box.size, box.position);

    box.version = buffer.readUInt8(8);

    box.numberOfEntries = buffer.readUInt32BE(12);
    box.syncSampleTable = [];
    let position = 16;
    for (let i = 0; i < box.numberOfEntries; i++) {
        box.syncSampleTable.push(buffer.readInt32BE(position));
        position += 4;
    }
}