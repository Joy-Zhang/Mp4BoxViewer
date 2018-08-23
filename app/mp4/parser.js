const fs = require('fs');
const util = require('util');
const boxParser = require('./box');


const open = util.promisify(fs.open);
const read = util.promisify(fs.read);
const fstat = util.promisify(fs.fstat);

const containerBoxTypes = [
    'moov',
    'trak',
    'edts',
    'mdia',
    'minf',
    'dinf',
    'stbl',
    'mvex',
    'moof',
    'traf',
    'mfra',
    'skip'
];

function isContainerBox(type) {
    return containerBoxTypes.filter(t => t === type).length > 0;
}

async function parseBox(fd, position) {

    let content = position + 8;

    const box = {};
    const sizeBuffer = Buffer.alloc(4);
    const typeBuffer = Buffer.alloc(4);


    await read(fd, sizeBuffer, 0, 4, position);
    await read(fd, typeBuffer, 0, 4, position + 4);

    box.position = position;
    box.size = sizeBuffer.readUInt32BE(0);
    box.type = typeBuffer.toString();

    if (box.size === 1) {
        const largeSizeBuffer = Buffer.alloc(8);
        await read(fd, largeSizeBuffer, 0, 8, position + 8);
        box.size = (largeSizeBuffer.readUInt32BE(0) << 8) + largeSizeBuffer.readUInt32BE(4);
        content += 8;
    }

    box.next = position + box.size;
    if (isContainerBox(box.type)) {
        box.children = await parseChildren(fd, content, box.next);
    } else {
        box.children = [];
    }

    if (box.type in boxParser) {
        await boxParser[box.type](fd, box);
    }

    return box;
}

async function parseChildren(fd, from, to) {
    const children = [];

    let position = from;

    while (position < to) {
        let box = await parseBox(fd, position);
        children.push(box);
        position = box.next;
    }

    return children;
}

exports.parseFile = async function (path) {
    const fd = await open(path, 'r');
    const stat = await fstat(fd);
    const box = {
        type: 'root',
        children: await parseChildren(fd, 0, stat.size),
        poistion: 0,
        size: stat.size,
        next: stat.size
    };
    return box;
}