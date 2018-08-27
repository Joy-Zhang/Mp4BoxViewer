var dialog = electron.remote.dialog;
var parser = remoteRequire(__dirname + '/mp4/parser');
var renderTree = nodeRequire(__dirname + '/static/tpl/tree.etpl');
var renderer = nodeRequire(__dirname + '/static/box/renderer');

function box2node(box) {
    return {
        name: box.type,
        type: box.children.length > 0 ? 'folder' : 'item',
        box: box
    };
}

function parseFile(path) {
    parser.parseFile(path).then(function (root) {
        var dataSource = function (parent, callback) {
            if (!parent.box) {
                callback({
                    data: [box2node(root)]
                });
            } else {
                callback({
                    data: parent.box.children.map(box2node)
                });
            }
        };
        $tree = $(renderTree({}));
        $tree.tree({
            dataSource: dataSource,
            multiSelect: false,
            folderSelect: false
        });
        $tree.on('selected.fu.tree', function (event, data) {
            var box = data.target.box;
            let dom;
            if (box.type in renderer) {
                dom = renderer[box.type](box);
            } else {
                dom = renderer.raw(box);
            }
            $('#box-content-container').empty().append(dom);
        });

        $('#tree-container').empty().append($tree);
    });
}

$(function () {
    $('#btn-open').on('click', function () {
        dialog.showOpenDialog({
            properties: ['openFile']
        }, function (filePaths) {
            if (filePaths.length > 0) {
                parseFile(filePaths[0]);
            }
        });
    });
});