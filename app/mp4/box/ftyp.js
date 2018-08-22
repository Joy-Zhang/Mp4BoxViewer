const fs = require('fs');
const util = require('util');

const read = util.promisify(fs.read);

module.exports = async function (fd, box) {
    const buffer = Buffer.alloc(box.size);
    await read(fd, buffer, 0, buffer.length, box.position);
    box.majorBrand = buffer.toString('utf-8', 8, 12);
    box.minorVersion = buffer.toString('utf-8', 12, 16);
    box.compatibleBrands = [];
    let position = 16;
    while (position < 24) {
        box.compatibleBrands.push(buffer.toString('utf-8', position, position + 4));
        position += 4;
    }
}