import * as wmubase from "./../wmu-base";
import * as wmutoc from "./../wmu-toc";

export function parse(allVar: wmubase.IBlockDefinition) {
  let result = [];

  let toc = wmutoc.tocTree;
  if (allVar['level']===1) { // todo2: werkt niet met parts!
    // if we have found a new h1, insert a comment with id of last/previous h1, for footnotes
    let currentChapterId=toc.getCurrentChapterId();
    if (currentChapterId) {
      result.push( wmubase.createNotesPlaceholder(currentChapterId) )
    }
  }

  let newHeaderId = toc.addSequential(allVar['title']!, allVar['level']);
  
  // create output
  result.push('<h' + allVar['level'] + ' id="' + newHeaderId + '">' +
          allVar['title'] + 
          '</h' + allVar['level'] + '>' + wmubase.eol + wmubase.eol);

  return result.join('');
}
