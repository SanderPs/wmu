var wmubase = require('./wmu-base');
var wmutoc = require('./wmu-toc');

function wmuheaderparse(allVar) {

  let id = wmubase.newElementId(allVar['title'] + allVar['level']);

  // store data

  let toc = wmutoc.tocTree;
  toc.addSequential(allVar['title'], allVar['level'], id);

  // create output

  return '<h' + allVar['level'] + ' id="' + id + '">' +
          allVar['title'] + 
          '</h' + allVar['level'] + '>' + wmubase.eol + wmubase.eol;
}

module.exports = {
  wmuheaderparse
};
