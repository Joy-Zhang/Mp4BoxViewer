const fs = require('fs');
const util = require('util');

const read = util.promisify(fs.read);


Buffer.prototype.readUInt64BE = function (position) {
    return (this.readUInt32BE(position) << 8) + this.readUInt32BE(position + 4);
}

function parseSampleDescription(buffer, position) {
    let sampleDescription = {};
    sampleDescription.size = buffer.readUInt32BE(position);
    sampleDescription.dataFormat = buffer.readUInt32BE(position + 4);
    return sampleDescription;
}

module.exports = async function (fd, box) {
    const buffer = Buffer.alloc(box.size);
    await read(fd, buffer, 0, box.size, box.position);

    box.version = buffer.readUInt8(8);

    box.numberOfEntries = buffer.readUInt32BE(12);
    box.sampleDescriptionTable = [];
    let position = 16;
    for (let i = 0; i < box.numberOfEntries; i++) {
        let sampleDescription = parseSampleDescription(buffer, position);
        box.sampleDescriptionTable.push(sampleDescription);
        position += sampleDescription.size;
    }
}