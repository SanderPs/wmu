import * as WmuLib from "./WmuLib";
import { IConfig, IParsedBlock, IBlockDefinition, IHtmlPositions, IWmuProject } from "./types";
import { wmu_commands, IWMUCommands } from "./tags/wmu-tags";
import * as blocks from './blocks';
import * as wmutoc from "./features/wmu-toc";
import * as wmuindex from './features/wmu-index';
import * as wmunotes from './features/wmu-notes';

const defaultConfig: IConfig = {
    createToc: false,
    toBook: false,
    autoNumbering: true,
    keepComments: false,
};

export class WmuDocument{

    private config: IConfig;
    private project: IWmuProject;
    private blocks: Array<IParsedBlock>;
    private result: string[];

    private tocTree: wmutoc.TocTree;
    private indexStore: wmuindex.IndexStore;
    private notesStore: wmunotes.NotesStore;

    constructor( str: string, config: IConfig, projectData: IWmuProject ) {

        this.config = Object.assign({}, defaultConfig, config);
        this.project = projectData;
        this.result = [];

        str = parseTags(str, config);

        this.preParse();
        str = wmuindex.parse(str, this.indexStore, this.config);

        this.blocks = splitBlocks(str);
        this.parse();

        this.postParse();
    }

    private preParse(): void {
        
        this.indexStore = new wmuindex.IndexStore();
        
        this.notesStore = new wmunotes.NotesStore();

        this.tocTree = new wmutoc.TocTree();
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
                part1 = WmuLib.parseDef(block.part1); // todo: try catch

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
                        let result = blocks.header.parse(part1, this.tocTree, this.config);
                        this.result[indx] = result.html;
                        block.tocNode = result.tocNode;
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

        AddFootnotePlaceholders(this.config, this.blocks, this.result);

    }

    public toHtml(): string { // todo: format -> enum

        let format: string = this.config.format?.length ? this.config.format : 'fragment';

        let result: string;
        let body = this.result.join('');
        body = wmunotes.parseInlineNoteIds(body, this.notesStore);
        
        let toc = (this.config.createToc ? this.tocTree.toHtml(this.config.tocTitle, this.config) : '');
        let notesList: wmunotes.IHtmlNotes = this.notesStore.toHtml();
        let index =  wmuindex.insertIndex(this.indexStore.toHtmlIndex());

        let css = (this.project.css?.length) ?
            '\t\t<link rel="stylesheet" href="' + this.project.css + '">' + WmuLib.eol :
            '';


        if (format === 'page') {
            result = WmuLib.pageHtml(<IHtmlPositions>{
                lang: "nl",
                head: css,
                body: body,
                toc: toc,
                index: index,
            });
        }

        if (format === 'fragment') {
            result = WmuLib.fragmentHtml(<IHtmlPositions>{
                lang: '',
                head: '',
                body: body,
                toc: toc,
                index: index,
            });
        }

        result = wmunotes.insertFootNotes(result, notesList, this.tocTree, 'endOfChapter'); // todo
        
        return result.trim();
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

// add a footnotes placeholder at the end of a chapter/header1:
export function AddFootnotePlaceholders(config: IConfig, blocks: IParsedBlock[], result: string[]) {

    if (!config.createToc) 
        return;

    let lastH1 = -1;
    for (let indx=0; indx < blocks.length; indx ++) {
        let block: IParsedBlock = blocks[indx];

        if (block.tocNode?.level === 1) {
            if (lastH1 > -1) {
                result[indx] = 
                    WmuLib.createNotesPlaceholder( blocks[lastH1].tocNode.id ) +
                    result[indx];
            }
            lastH1 = indx;
        }
    }
    if (lastH1 > -1 && lastH1 !== (blocks.length - 1)) {
        result[blocks.length - 1] += WmuLib.createNotesPlaceholder( blocks[lastH1].tocNode?.id );
    }

}