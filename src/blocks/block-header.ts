import * as WmuLib from "../WmuLib";
import { IConfig, IBlockDefinition } from "./../types";
import { TocTree, TocNode } from "./../features/wmu-toc";

export function parse(allVar: IBlockDefinition, tocTree: TocTree, config: IConfig) {

  let result = [];
  let newNode: TocNode = tocTree.addSequential(allVar['title']!, allVar['level']);
  
  if (allVar['level']===0) {
    result.push('<div class="page-part" id="' + newNode.id + '">' +
            ((config.autoNumbering! && allVar['level'] < 6 ) ? newNode.numbering + " " : "") +
            allVar['title'] + 
            '</div>' + WmuLib.eol + WmuLib.eol);
  } else {
    result.push('<h' + allVar['level'] + ' id="' + newNode.id + '">' +
            ((config.autoNumbering! && allVar['level'] < 6 ) ? newNode.numbering + " " : "") +
            allVar['title'] + 
            '</h' + allVar['level'] + '>' + WmuLib.eol + WmuLib.eol);
  }

  return {
    html: result.join(''),
    tocNode: newNode
  };
}
