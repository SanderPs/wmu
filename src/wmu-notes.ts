import * as wmubase from "./wmu-base";
import * as wmutoc from "./wmu-toc";

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

class NotesStore{
    store: INotesStore;
    constructor() {
        this.store = {
        };
    }

    find(chapterid: string, footnoteId: string) {
        return this.store[chapterid]?.notes // todo: '?' to not break when {{1}} is not found (as |fn|id=1)
            .find(item => item._footnoteGivenId === footnoteId);
    }

    // should be 'add'
    storeFootnoteText(givenId: string, body: string, chapterId: string) {

        let newFnid = wmubase.newElementId('footnote:' + givenId + chapterId);

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

    toHtml() {

        let htmlNotes: IHtmlNotes = {};
    
        for (let chapterId in this.store) {
    
            let result = [];
    
            result.push(
                '<div class="footnotes-chapter' + chapterId + '">' + wmubase.eol +
                '<b>Voetnoten</b><br> ' + wmubase.eol + // todo
                '\t<ol>' + wmubase.eol
            );
    
            for (let cnt = 0; cnt < this.store[chapterId].notes.length; cnt++) {
                let item = this.store[chapterId].notes[cnt];
                let anchor = chapterId + '_' + item.footnoteId;
                result.push(
                    '\t\t<li id="fn:' + anchor + '">' + wmubase.eol +
                    '\t\t\t<p>' + item.footnoteText + wmubase.eol +
                    '&nbsp;<a href="#fnref:' + anchor + '" class="reversefootnote">&#8593;</a></p>' + wmubase.eol +
                    '\t\t</li>' + wmubase.eol
                );
            }
    
            result.push(
                '\t</ol>' + wmubase.eol +
                '</div>' + wmubase.eol + wmubase.eol
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

export function parseInlineNoteIds(resultHtml: string) {

    // 1. lookup Notes id's and connect them to chapterIds
    // 2. replace Notes ids's with link in superscript

    const notesRegex = '{{(.+?)}}';
    const rHeadersAndNotes = new RegExp('(<h1 .+?>|' + notesRegex + ')', 'g');
    const rNotes = new RegExp('(' + notesRegex + ')', 'g');
    // todo: groups zodat hieronder niet nog match moet worden gebruikt.

    currentChapterId = null;

    let notesChaptersList: INotesChaptersList[] = [];

    let matches;
    while ((matches = rHeadersAndNotes.exec(resultHtml)) !== null) {
        //console.log(`Found ${matches[0]}. Next starts at ${rHeadersAndNotes.lastIndex}.`);

        let found = matches[0]; // todo: nothing found
        if (found.charAt(0) === '{') {
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

export function insertFootNotes(htmlResult: string, notes: IHtmlNotes, insertType: string) {

    switch (insertType) {
        case 'endOfBook':
            let toc = wmutoc.tocTree;
            let tocIndex = toc.getTocIndex();

            let result = [];
            const keys = Object.keys(tocIndex)
            for (let x=0; x < keys.length; x++) {
                let node = tocIndex[keys[x]];
                if (node.partTitle) {
                    result.push('<div>' + node.partTitle + '</div>' + wmubase.eol);
                }
                if (notes[node.tocChapter.id]) {
                    result.push('<div>' + node.tocChapter.title + '</div>' + wmubase.eol);
                    result.push('<div>' + notes[node.tocChapter.id].notesAsHtml + '</div>' + wmubase.eol);
                }
            }
   // todo: also add 'unassigned'
            return htmlResult = htmlResult.replace(
                    wmubase.EndOfBookPlaceholder(),
                    '<div class="start-page-notes-endofbook">' +
                    result.join('') +
                    '</div>'
                );

        case 'endOfChapter':
            Object.keys(notes).map(function(elem){
                let ph = wmubase.createNotesPlaceholder(elem);
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

export let notesStore = new NotesStore();
let currentChapterId: string | null;

export function reset() {
    notesStore = new NotesStore();
    currentChapterId = null;
};
