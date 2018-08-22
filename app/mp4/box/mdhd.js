const fs = require('fs');
const util = require('util');

const read = util.promisify(fs.read);


Buffer.prototype.readUInt64BE = function (position) {
    return (this.readUInt32BE(position) << 8) + this.readUInt32BE(position + 4);
}

module.exports = async function (fd, box) {
    const buffer = Buffer.alloc(box.size);
    await read(fd, buffer, 0, box.size, box.position);

    box.version = buffer.readUInt8(8);

    box.creationTime = buffer.readUInt32BE(12);
    box.modificationTime = buffer.readUInt32BE(16);
    box.timescale = buffer.readUInt32BE(20);
    box.duration = buffer.readUInt32BE(24);
    box.language = buffer.readUInt16BE(28);
    box.quality = buffer.readUInt16BE(30);

}