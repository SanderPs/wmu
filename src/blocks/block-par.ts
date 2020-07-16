import * as wmubase from "./../wmu-base";
import { IBlockDefinition } from "./../types";
// todo: verplaatsen?
import * as blockList from "./block-list";

export function parse(allVar: IBlockDefinition, body: string) {

    // handle all lists inside a paragraph:
    // todo: is dit wel een goed idee?
    // nee...
    //let bodyLists = body.replace(/^((?:-{1}[^-][\s\S]+?\r?\n?)+)(?:$)/gm, blockList.unorderedList);

    return '<p' + 
        wmubase.classAttr(
          allVar!['format'] ?? ''
        )
        + '>' + wmubase.eol +
        wmubase.NewlineToBr(body) + wmubase.eol +
      '</p>' + wmubase.eol + wmubase.eol;
}
