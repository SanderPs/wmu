import * as wmubase from "./wmu-base";
import { IConfig } from "./types";

interface IIndexStoreOccurence {
    linkId: string;
    index: number;
}

interface IIndexStoreItem {
    indexTerm: string;
    occurences: IIndexStoreOccurence[]
}

interface IIndexStore {
    [key: number]: {
        items: IIndexStoreItem[]
    }
}

export interface IHtmlIndex {
    [key: string]: {
        indexAsHtml: string;
    }
}

export class IndexStore {

    private store: IIndexStore;

    constructor() {
        this.store = {};
    }

    public add(givenId: string): string {
        let indexLetter = givenId.charCodeAt(0);

        if (!this.store[indexLetter]) {
            this.store[indexLetter] = { items: [] };
        }

        let index = this.store[indexLetter].items.length + 1;
        let itemId = givenId.charAt(0) + '_' + (index);

        let storedItem =  this.store[indexLetter].items.find(i => i.indexTerm === givenId);

        if (storedItem) {
            storedItem.occurences.push({
                index: index,
                linkId: itemId
            });
        } else {
            this.store[indexLetter].items.push({
                indexTerm: givenId,
                occurences: [ {
                linkId: itemId,
                index: index
                }]
            });
        }

        return itemId;
    }

    public toHtml(): string {

        const htmlIndex = this.toHtmlIndex();
        const keys = Object.keys(htmlIndex)
        
        if (!keys.length) {
            return '';
        }
        
        let result = [];
        for (let x = 0; x < keys.length; x++) {
            let node = htmlIndex[keys[x]];
            result.push(node.indexAsHtml);
        }
    
        return '<div class="book-index">' + wmubase.eol +
                '<h1>Index</h1>' + wmubase.eol +
            result.join('') +
            '</div>' + wmubase.eol + wmubase.eol;
    };

    public toHtmlIndex(): IHtmlIndex { // todo: naming
        let htmlIndex: IHtmlIndex = {};
    
        for (let letterId in this.store) {
            let result = [];
    
            result.push(
                '<div class="index-for-' + letterId + '">' + wmubase.eol +
                    '<div class="index-header">' + String.fromCharCode(parseInt(letterId)) + '</div>' + wmubase.eol
            );
    
            for (let cnt = 0; cnt < this.store[letterId].items.length; cnt++) {
                let crntItem = this.store[letterId].items[cnt];

                result.push(
                    '\t<div>' + crntItem.indexTerm + '&nbsp;&nbsp;'+ wmubase.eol
                );

                for (let cnt2 = 0; cnt2 < crntItem.occurences.length; cnt2++) {
                    let crntOcc = crntItem.occurences[cnt2];
                    let anchor = crntOcc.linkId;

                    result.push(
                        '\t\t<span id="indx:' + anchor + '">' +
                        '<a href="#indxref:' + anchor + '" class="reverseindex">' + crntOcc.index + '</a>' +
                        '</span>' + wmubase.eol
                    );
                }

                result.push('\t</div>' + wmubase.eol);
            }
    
            result.push(
                '</div>' + wmubase.eol + wmubase.eol
            );
    
            htmlIndex[letterId] = { indexAsHtml: result.join('') };
        }
    
        return htmlIndex;
    }
}


export function parse(body: string, indexStore: IndexStore, config: IConfig): string {
    
    let result = body;

    result = result.replace(/\[\[(.+?)\]\]==(.+?)==/g, function (substring: string, ...args: string[]): string {
        let indexId: string = indexStore.add(args[1]);
        return '<span class="index-term" id="indxref:' + indexId + '">' + 
        '<a href="#indx:' + indexId + '">' + args[0] + '</a>' +
        '</span>';
    });

    return result;
}

export function insertIndex(htmlResult: string, index: IHtmlIndex): string {

    const keys = Object.keys(index)
    
    if (!keys.length) {
        return htmlResult.replace( wmubase.IndexPlaceholder(), "" );
    }
    
    let result = [];
    for (let x = 0; x < keys.length; x++) {
        let node = index[keys[x]];
        result.push(
            node.indexAsHtml);
    }

    return htmlResult.replace(
        wmubase.IndexPlaceholder(),
        '<div class="book-index">' + wmubase.eol +
            '<h1>Index</h1>' + wmubase.eol +
        result.join('') +
        '</div>' + wmubase.eol + wmubase.eol
    );
};
