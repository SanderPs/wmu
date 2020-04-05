import * as wmubase from "./../wmu-base";

import * as wmutoc from "./../wmu-toc";
import * as wmuNotes from "./../wmu-notes";

export function parse(allVar: wmubase.IBlockDefinition, body: string): string {

  // get the current 'context', the chapter where the footnote is found
  let toc = wmutoc.tocTree;
  let currentChapterId = toc.getCurrentChapterId();

  // create a new hash-id and store the footnote
  let newFnid = wmubase.newElementId('footnote:' + allVar['id'] + currentChapterId);
  wmuNotes.notesStore.storeFootnoteText(allVar['id']!, body, currentChapterId!, newFnid);

  // return empty string = remove text, it will be added later in another place
  return '';
}
