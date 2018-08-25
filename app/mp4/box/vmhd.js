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

    box.graphicsMode = buffer.readUInt32BE(12);
    box.opcolor = {
        r: buffer.readUInt16BE(14),
        g: buffer.readUInt16BE(16),
        b: buffer.readUInt16BE(18)
    };


}