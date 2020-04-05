import * as wmubase from "./../wmu-base";

// todo: verplaatsen?
import * as blockList from "./block-list";

export function parse(body: string) {

    // handle all lists inside a paragraph:
    // todo: is dit wel een goed idee?
    let bodyLists = body.replace(/^((?:-{1}[^-][\s\S]+?\r?\n?)+)(?:$)/gm, blockList.unorderedList);

    return '<p>' + wmubase.eol +
        bodyLists + wmubase.eol +
        '</p>' + wmubase.eol + wmubase.eol;
}
