var wmubase = require('./wmu-base');
var wmulist = require('./wmu-list');

function wmuparparse(body) {

    // handle all lists inside a paragraph:
    let bodyLists = body.replace(/^((?:-{1}[^-][\s\S]+?\r?\n?)+)(?:$)/gm, wmulist.unorderedList);

    return '<p>' + wmubase.eol +
        bodyLists + wmubase.eol +
        '</p>' + wmubase.eol + wmubase.eol;
}

module.exports = {
    wmuparparse
};
