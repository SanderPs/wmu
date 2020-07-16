import * as wmubase from "./../wmu-base";
import { IBlockDefinition } from "./../types";
import { TocTree } from "./../features/wmu-toc";
import { NotesStore } from "./../features/wmu-notes";

export function parse(allVar: IBlockDefinition, notesStore: NotesStore, tocStore: TocTree, body: string): string {

  // get the current 'context', the chapter where the footnote is found
  let currentChapterId = tocStore.getCurrentChapterId();

  // create a new hash-id and store the footnote
  // todo: allvar.id zou verplicht moeten zijn?!
  notesStore.storeFootnoteText(allVar['id']!, body, currentChapterId!);

  // return empty string = remove text, it will be added later in another place
  return '';
}
