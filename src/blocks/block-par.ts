import * as wmubase from "./../wmu-base";

// todo: verplaatsen?
import * as blockList from "./block-list";

export function parse(allVar: wmubase.IBlockDefinition, body: string) {

    // handle all lists inside a paragraph:
    // todo: is dit wel een goed idee?
    let bodyLists = body.replace(/^((?:-{1}[^-][\s\S]+?\r?\n?)+)(?:$)/gm, blockList.unorderedList);

    return '<p' + 
    wmubase.classAttr(
        allVar!['format'] ?? ''
      )
      + '>' + wmubase.eol +
        bodyLists + wmubase.eol +
        '</p>' + wmubase.eol + wmubase.eol;
}
