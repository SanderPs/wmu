var wmubase = require('./wmu-base');
var wmutoc = require('./wmu-toc');

function wmuheaderparse(allVar) {

  let id = wmubase.newElementId(allVar['title'] + allVar['number']);

  // store data

  let toc = wmutoc.tocTree;
  toc.addSequential(allVar['title'], allVar['number'], id);

  // create output

  return '<h' + allVar['number'] + ' id="' + id + '">' +
          allVar['title'] + 
          '</h' + allVar['number'] + '>' + wmubase.eol + wmubase.eol;
}

module.exports = {
  wmuheaderparse
};
