var wmubase = require('./wmu-base');
var blockList = require('./block-list');

function parse(body) {

    // handle all lists inside a paragraph:
    let bodyLists = body.replace(/^((?:-{1}[^-][\s\S]+?\r?\n?)+)(?:$)/gm, blockList.unorderedList);

    return '<p>' + wmubase.eol +
        bodyLists + wmubase.eol +
        '</p>' + wmubase.eol + wmubase.eol;
}

module.exports = {
    parse
};
