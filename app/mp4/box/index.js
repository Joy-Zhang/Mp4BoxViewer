const ftyp = require('./ftyp');
const mvhd = require('./mvhd');
const tkhd = require('./tkhd');
const mdhd = require('./mdhd');
const hdlr = require('./hdlr');
const vmhd = require('./vmhd');
const stsd = require('./stsd');
const stts = require('./stts');
const stss = require('./stss');
const stsz = require('./stsz');
const stsc = require('./stsc');
const stco = require('./stco');

box = {
    ftyp,
    mvhd,
    tkhd,
    mdhd,
    hdlr,
    vmhd,
    stsd,
    stts,
    stss,
    stsz,
    stsc,
    stco
};

module.exports = box;