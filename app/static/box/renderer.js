const raw = require('../tpl/raw.etpl');
const mvhd = require('../tpl/mvhd.etpl');

exports.raw = function (box) {
    return raw({raw: JSON.stringify(box, null, 2)});
};

exports.mvhd = function (box) {
    return mvhd({
        ct: new Date(box.creationTime * 1000).toLocaleDateString(),
        mt: new Date(box.modificationTime * 1000).toLocaleDateString(),
        ts: box.timescale,
        d: (box.duration / box.timescale).toFixed(1),
        dts: box.duration,
        r: Math.round(box.rate / 65536 * 100) + '%',
        v: Math.round(box.volume / 256 * 100) + '%'
    });
};