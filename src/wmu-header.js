var wmubase = require('./wmu-base');
var wmutoc = require('./wmu-toc');

function wmuheaderparse(allVar) {

  let result = [];

  let toc = wmutoc.tocTree;
  if (allVar['level']=="1") { // todo: level is string; todo2: werkt niet met parts!
    // if we have found a new h1, insert a comment with id of last/previous h1, for footnotes
    let currentChapterId=toc.getCurrentChapterId();
    if (currentChapterId) {
      result.push(
        '<!-- footnotes ' + currentChapterId + ' -->' + wmubase.eol + wmubase.eol
      );
    }
  }

  let newHeaderId = wmubase.newElementId(allVar['title'] + allVar['level']);
  let lastAdded = toc.addSequential(allVar['title'], allVar['level'], newHeaderId);

  
  // create output

  result.push('<h' + allVar['level'] + ' id="' + newHeaderId + '">' +
          allVar['title'] + 
          '</h' + allVar['level'] + '>' + wmubase.eol + wmubase.eol);

  return result.join('');
}

module.exports = {
  wmuheaderparse
};
