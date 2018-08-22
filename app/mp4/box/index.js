const ftyp = require('./ftyp');
const mvhd = require('./mvhd');
const tkhd = require('./tkhd');
const mdhd = require('./mdhd');
const hdlr = require('./hdlr');

box = {
    ftyp,
    mvhd,
    tkhd,
    mdhd,
    hdlr
};

module.exports = box;