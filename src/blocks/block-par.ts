import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";
// todo: verplaatsen?
import * as blockList from "./block-list";

export function parse(allVar: IBlockDefinition, body: string) {

    // handle all lists inside a paragraph:
    // todo: is dit wel een goed idee?
    // nee...
    //let bodyLists = body.replace(/^((?:-{1}[^-][\s\S]+?\r?\n?)+)(?:$)/gm, blockList.unorderedList);

    return '<p' + 
    WmuLib.classAttr(
          allVar!['format'] ?? ''
        )
        + '>' + WmuLib.eol +
        WmuLib.NewlineToBr(body) + WmuLib.eol +
      '</p>' + WmuLib.eol + WmuLib.eol;
}
