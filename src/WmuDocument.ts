import * as wmubase from "./wmu-base";
import { IConfig, IParsedBlock, IBlockDefinition, IHtmlPositions } from "./types";
import { wmu_commands, IWMUCommands } from "./tags/wmu-tags";
import * as blocks from './blocks';
import * as wmutoc from "./wmu-toc";
import * as wmuindex from './wmu-index';
import * as wmunotes from './wmu-notes';

const defaultConfig: IConfig = {
    createToc: false,
    toBook: false,
    autoNumbering: true,
    keepComments: false,
};

export class WmuDocument{

    private config: IConfig;
    private blocks: Array<IParsedBlock>;
    private result: string[];

    private tocTree: wmutoc.TocTree;
    private indexStore: wmuindex.IndexStore;
    private notesStore: wmunotes.NotesStore;

    constructor(str: string, config: IConfig) {
        this.config = Object.assign({}, defaultConfig, config);
        this.result = [];

        str = parseTags(str, config);

        this.indexStore = new wmuindex.IndexStore();
        str = wmuindex.parse(str, this.indexStore, this.config);
        
        this.notesStore = new wmunotes.NotesStore();

        this.tocTree = new wmutoc.TocTree();
        
        this.blocks = splitBlocks(str);
        this.parse();
        this.postParse();
        
    }

    private parse(): void {

        if (!this.blocks.length)
            return;
        
        for (let indx=0; indx < this.blocks.length; indx ++) {
            let block: IParsedBlock = this.blocks[indx];

            let isBlock = block.part1.charCodeAt(0) === 124;
            if (!isBlock) {
                
                if (/(^-\ |^\d\.\ )/.test(block.part1)) {
                    this.result[indx] = blocks.list.parse({}, block.part1);
                } else if (/^<!--\ /.test(block.part1)) {
                    if (this.config.keepComments) {
                        this.result[indx] = block.part1;
                    }
                } else {
                    // it's a paragraph
                    this.result[indx] = blocks.par.parse(<IBlockDefinition>{}, block.part1);
                }

            } else {
                let part1: IBlockDefinition;
                part1 = wmubase.parseDef(block.part1); // todo: try catch

                // always remove any pipe characters at the beginning of each line:
                if (block.part2) {
                    block.part2 = block.part2.replace(/^\|/gm, '');
                }
                if (block.part3) {
                    block.part3 = block.part3.replace(/^\|/gm, '');
                }

                switch( part1['block-type'] ) {
                    case 'table':
                    case 't':
                        this.result[indx] = blocks.table.parse(part1, block.part2, block.part3);
                        break;
                    case 'header':
                    case 'h':
                        this.result[indx] = blocks.header.parse(part1, this.tocTree, this.config);
                        break;
                    case 'quote':
                    case 'q':
                        this.result[indx] = blocks.quote.parse(part1, block.part2, block.part3);
                        break;
                    case 'code':
                    case 'c':
                        this.result[indx] = blocks.code.parse(part1, block.part2);
                        break;
                    case 'block':
                    case 'b':
                        this.result[indx] = blocks.block.parse(part1, block.part2);
                        break;
                    case 'image':
                    case 'img':
                    case 'i':
                        this.result[indx] = blocks.img.parse(part1);
                        break;
                    case 'list':
                    case 'l':
                        this.result[indx] = blocks.list.parse(part1, block.part2);
                        break;
                    case 'par':
                    case 'p':
                        this.result[indx] = blocks.par.parse(part1, block.part2);
                        break;
                    case 'footnote':
                    case 'fn':
                        this.result[indx] = blocks.note.parse(part1, this.notesStore, this.tocTree, block.part2);
                        break;
                    case 'glossary':
                    case 'g':
                        this.result[indx] = blocks.glossary.parse(part1, block.part2);
                        break;
                    case 'config':
                        this.result[indx] = blocks.config.parse(part1, this.config);
                        break;
                }
            }
        }

    }

    private postParse() {

        if (this.config.createToc) {
            // add last chapter placeholder if there has been a chapter
            // todo: not ideal this
            let currentChapterId = this.tocTree.getCurrentChapterId();
            if (currentChapterId) {
                this.result.push(wmubase.createNotesPlaceholder(currentChapterId)); // todo: push()?
            }
        }
    }

    public toHtml(format: string = 'fragment'): string { // todo: format -> enum

        let result: string;
        let body = this.result.join('');
        body = wmunotes.parseInlineNoteIds(body, this.notesStore);
        
        let toc = (this.config.createToc ? this.tocTree.toHtml(this.config.tocTitle, this.config) : '');
        let notesList: wmunotes.IHtmlNotes = this.notesStore.toHtml();
        let index =  wmuindex.insertIndex(this.indexStore.toHtmlIndex());

        if (format === 'page') {
            result = wmubase.pageHtml(<IHtmlPositions>{
                lang: "nl",
                head: '\t\t<link rel="stylesheet" href="../test.css">' + wmubase.eol,
                body: body,
                toc: toc,
                index: index,
            });
        }

        if (format === 'fragment') {
            result = wmubase.fragmentHtml(<IHtmlPositions>{
                lang: '',
                head: '',
                body: body,
                toc: toc,
                index: index,
            });
        }

        result = wmunotes.insertFootNotes(result, notesList, this.tocTree, 'endOfChapter'); // todo
        
        return result;
    }
}

const partLabel = ['part1', 'part2', 'part3'];
const regex_block = /(?:\r?\n(?:\r?\n)+)/g;
const regex_part = /(?:\r?\n\|=[ \t]*\r?\n)/g;

export function splitBlocks(str: string): Array<IParsedBlock> {

    return (str.trim())
        .split(regex_block)
        .map(block =>
            block.split(regex_part)
                .reduce(
                    (acc, part, i) => ({ ...acc, [partLabel[i]]: part }),
                    {} as IParsedBlock
                )
        );

}


export function parseTags(str: string, config: IConfig): string {
    let result = str;

    wmu_commands.forEach((cmd: IWMUCommands) => {

        // todo: wordt nu niet (meer?) gebruikt
        // if (cmd.level === 'book' && !config.toBook) {
        //     return;
        // }

        result=result.replace(cmd.regex, cmd.to);
    });

    return result;
}