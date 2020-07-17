import * as WmuLib from "../WmuLib";
import { TocTree } from "./wmu-toc";

interface INotesStoreItem {
    // todo: allemaal gebruikt?
    _footnoteGivenId: string; // todo: verplicht?!
    footnoteText: string;
    footnoteIndex: number;
    footnoteId: string;
}

interface INotesStore {
    [key: string]: {
        notes: INotesStoreItem[]
    }
}

export interface IHtmlNotes {
    [key: string]: {
        notesAsHtml: string;
    }
}

export class NotesStore{

    private store: INotesStore;

    constructor() {
        this.store = {};
    }

    public find(chapterid: string, footnoteId: string): INotesStoreItem {
        
        return this.store[chapterid]?.notes // todo: '?' to not break when ((1)) is not found (as |fn|id=1)
            .find(item => item._footnoteGivenId === footnoteId);
    }

    // should be 'add'
    public storeFootnoteText(givenId: string, body: string, chapterId: string): void {

        let newFnid = WmuLib.newElementId('footnote:' + givenId + chapterId);

        if (chapterId === null) {
            chapterId = 'unasigned' // todo gebeurt dit ooit?
        }

        if (!this.store[chapterId]) {
            this.store[chapterId] = { notes: [] }; // an arry for all footnotes belonging to a chapter
        }

        this.store[chapterId].notes.push({
            _footnoteGivenId: givenId, // wordt niet gebruikt
            footnoteId: newFnid, 
            footnoteText: body,
            footnoteIndex: this.store[chapterId].notes.length + 1
        });
    }

    public toHtml(): IHtmlNotes { // todo: naming

        let htmlNotes: IHtmlNotes = {};
    
        for (let chapterId in this.store) {
    
            let result = [];
    
            result.push(
                '<div class="footnotes-chapter' + chapterId + '">' + WmuLib.eol +
                '<b>Voetnoten</b><br> ' + WmuLib.eol + // todo
                '\t<ol>' + WmuLib.eol
            );
    
            for (let cnt = 0; cnt < this.store[chapterId].notes.length; cnt++) {
                let item = this.store[chapterId].notes[cnt];
                let anchor = chapterId + '_' + item._footnoteGivenId;
                result.push(
                    '\t\t<li id="fn:' + anchor + '">' + WmuLib.eol +
                    '\t\t\t<p>' + item.footnoteText + WmuLib.eol +
                    '&nbsp;<a href="#fnref:' + anchor + '" class="reversefootnote">&#8593;</a></p>' + WmuLib.eol +
                    '\t\t</li>' + WmuLib.eol
                );
            }
    
            result.push(
                '\t</ol>' + WmuLib.eol +
                '</div>' + WmuLib.eol + WmuLib.eol
            );
    
            htmlNotes[chapterId] = { notesAsHtml: result.join('') };
        }
    
        return htmlNotes;
    }
}

interface INotesChaptersList {
    footnoteId: string;
    chapterid: string;
}

// todo: temp hack for notesStore
export function parseInlineNoteIds(resultHtml: string, notesStore: NotesStore): string {

    // 1. lookup Notes id's and connect them to chapterIds
    // 2. replace Notes ids's with link in superscript

    const notesRegex = '\\(\\((.+?)\\)\\)';
    const rHeadersAndNotes = new RegExp('(<h1 .+?>|' + notesRegex + ')', 'g');
    const rNotes = new RegExp('(' + notesRegex + ')', 'g');
    // todo: groups zodat hieronder niet nog match moet worden gebruikt.

    currentChapterId = null;

    let notesChaptersList: INotesChaptersList[] = [];

    let matches;
    while ((matches = rHeadersAndNotes.exec(resultHtml)) !== null) {
        //console.log(`Found ${matches[0]}. Next starts at ${rHeadersAndNotes.lastIndex}.`);

        let found = matches[0]; // todo: nothing found
        if (found.charAt(0) === '(') {
            // found a footnote id (like [[1]]) inline:
            let footnoteId = found.match(notesRegex)![1]; // todo: Non-Null Assertion Operator?

            notesChaptersList.push({
                footnoteId: footnoteId,
                chapterid: (currentChapterId ? currentChapterId : 'unasigned')
            });

        } else {
            // found a chapter level 1 (<h1>) tag
            currentChapterId = found.match(/ id="(.+?)"/)![1]; // todo: Non-Null Assertion Operator?
        }
    }

      
      // Step 2: turn notes into html:

    let noteCursor: number = 0;
    let result = resultHtml.replace(rNotes, function (found) {
    
        let chapterid = notesChaptersList[noteCursor].chapterid;
        let footnoteId = notesChaptersList[noteCursor].footnoteId
        noteCursor++;

        let anchor = chapterid + '_' + footnoteId;

        // todo: kan verkeerd gaan als userid meerdere keren voorkomt
        // bv bij 'unassigned'
        let footnotedIndex = notesStore.find(chapterid, footnoteId)?.footnoteIndex;

        return '<sup id="fnref:' + anchor + '">' +
            '<a href="#fn:' + anchor + '">' + footnotedIndex + '</a>' +
            '</sup>';
    });

    return result;
}

export function insertFootNotes(htmlResult: string, notes: IHtmlNotes, tocTree: TocTree, insertType: string): string { // todo: insertType -> enum

    switch (insertType) {
        case 'endOfBook':
            let tocIndex = tocTree.getTocIndex();

            let result = [];
            const keys = Object.keys(tocIndex)
            for (let x=0; x < keys.length; x++) {
                let node = tocIndex[keys[x]];
                if (node.partTitle) {
                    result.push('<div>' + node.partTitle + '</div>' + WmuLib.eol);
                }
                if (notes[node.tocChapter.id]) {
                    result.push('<div>' + node.tocChapter.title + '</div>' + WmuLib.eol);
                    result.push('<div>' + notes[node.tocChapter.id].notesAsHtml + '</div>' + WmuLib.eol);
                }
            }
   // todo: also add 'unassigned'
            return htmlResult = htmlResult.replace(
                WmuLib.EndOfBookPlaceholder(),
                    '<div class="start-page-notes-endofbook">' +
                    result.join('') +
                    '</div>'
                );

        case 'endOfChapter':
            Object.keys(notes).map(function(elem){
                let ph = WmuLib.createNotesPlaceholder(elem);
                if (htmlResult.indexOf(ph) > -1) {
                    htmlResult = htmlResult.replace(ph, notes[elem].notesAsHtml);
                } else{
                    // append when chapter not found
                    // todo: nessesary?
                    // also: only ok for fragments!
                    htmlResult = htmlResult + notes[elem].notesAsHtml;
                }
            });

            return htmlResult;

        default:
            console.log('### illegal insertType');
            break;
    }
};

// todo: put somewhere else
let currentChapterId: string | null;

