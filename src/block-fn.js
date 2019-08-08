var wmubase = require('./wmu-base');
var wmutoc = require('./wmu-toc');
var wmufn = require('./wmu-fn');

function wmufnparse(allVar, body) {
  
  let toc = wmutoc.tocTree;
  let currentChapterId = toc.getCurrentChapterId();
  let newFnid = wmubase.newElementId('footnote:' + allVar['id'] + currentChapterId);

  wmufn.storeFootnote(allVar['id'], body, currentChapterId, newFnid);

  return ''; // remove text, it will be added later in another place
}

module.exports = {
  wmufnparse
};
