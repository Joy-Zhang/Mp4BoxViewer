const fs = require('fs');
const util = require('util');

const read = util.promisify(fs.read);


module.exports = async function (fd, box) {
    const buffer = Buffer.alloc(box.size);
    await read(fd, buffer, 0, box.size, box.position);

    box.version = buffer.readUInt8(8);

    box.numberOfEntries = buffer.readUInt32BE(12);
    box.sampleToChunkTable = [];
    let position = 16;
    for (let i = 0; i < box.numberOfEntries; i++) {
        let stc = {
            firstTrunk: buffer.readUInt32BE(position),
            samplePerChunk: buffer.readUInt32BE(position + 4),
            sampleDescriptionId: buffer.readUInt32BE(position + 8)
        };
        box.sampleToChunkTable.push(stc);
        position += 12;
    }
}