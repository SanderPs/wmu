var wmubase = require('./wmu-base');

function wmuparparse(body) {
    body = body.replace(/((?:^- *)[\s\S]+(?:^- *[\s\S]+?\r?\n))/gm, listinpar)
    return '<p>' + wmubase.eol + body + wmubase.eol + '</p>' + wmubase.eol + wmubase.eol;
}

function listinpar(x) {
    return '<ul>' + wmubase.eol + 
        x.replace(/^(.+?)$/gm, '<li>$1</li>' +
        wmubase.eol + '</ul>');
}

module.exports = {
    wmuparparse
  };
  