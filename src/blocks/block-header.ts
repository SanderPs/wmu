import * as wmubase from "./../wmu-base";

import { TocTree } from "./../wmu-toc";

export function parse(allVar: wmubase.IBlockDefinition, tocTree: TocTree, config: wmubase.IConfig) {
  let result = [];

  if (allVar['level']===1) { // todo2: werkt niet met parts!
    // if we have found a new h1, insert a comment with id of last/previous h1, for footnotes
    let currentChapterId=tocTree.getCurrentChapterId();
    if (currentChapterId) {
      result.push( wmubase.createNotesPlaceholder(currentChapterId) )
    }
  }

  let headerTocInfo = tocTree.addSequential(allVar['title']!, allVar['level']);
  
  if (allVar['level']===0) {
    result.push('<div class="page-part" id="' + headerTocInfo.id + '">' +
            ((config.autoNumbering! && allVar['level'] < 6 ) ? headerTocInfo.numbering + " " : "") +
            allVar['title'] + 
            '</div>' + wmubase.eol + wmubase.eol);
  } else {
    result.push('<h' + allVar['level'] + ' id="' + headerTocInfo.id + '">' +
            ((config.autoNumbering! && allVar['level'] < 6 ) ? headerTocInfo.numbering + " " : "") +
            allVar['title'] + 
            '</h' + allVar['level'] + '>' + wmubase.eol + wmubase.eol);
  }

  return result.join('');
}
