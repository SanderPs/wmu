import * as WmuLib from "../WmuLib";
import { IConfig, IBlockDefinition } from "./../types";
import { TocTree } from "./../features/wmu-toc";

export function parse(allVar: IBlockDefinition, tocTree: TocTree, config: IConfig) {
  let result = [];

  if (allVar['level']===1) { // todo2: werkt niet met parts!
    // if we have found a new h1, insert a comment with id of last/previous h1, for footnotes
    let currentChapterId=tocTree.getCurrentChapterId();
    if (currentChapterId) {
      result.push( WmuLib.createNotesPlaceholder(currentChapterId) )
    }
  }

  let headerTocInfo = tocTree.addSequential(allVar['title']!, allVar['level']);
  
  if (allVar['level']===0) {
    result.push('<div class="page-part" id="' + headerTocInfo.id + '">' +
            ((config.autoNumbering! && allVar['level'] < 6 ) ? headerTocInfo.numbering + " " : "") +
            allVar['title'] + 
            '</div>' + WmuLib.eol + WmuLib.eol);
  } else {
    result.push('<h' + allVar['level'] + ' id="' + headerTocInfo.id + '">' +
            ((config.autoNumbering! && allVar['level'] < 6 ) ? headerTocInfo.numbering + " " : "") +
            allVar['title'] + 
            '</h' + allVar['level'] + '>' + WmuLib.eol + WmuLib.eol);
  }

  return result.join('');
}
