var wmubase = require('./wmu-base');
var wmutoc = require('./wmu-toc');
var wmufn = require('./wmu-fn');

function wmufnparse(allVar, body) {
  
  // get the current 'context', the chapter where the footnote is found
  let toc = wmutoc.tocTree;
  let currentChapterId = toc.getCurrentChapterId();

  // create a new hash-id and store the footnote
  let newFnid = wmubase.newElementId('footnote:' + allVar['id'] + currentChapterId);
  wmufn.storeFootnoteText(allVar['id'], body, currentChapterId, newFnid);

  // return empty string = remove text, it will be added later in another place
  return ''; 
}

module.exports = {
  wmufnparse
};
