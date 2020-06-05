import * as wmubase from "./wmu-base";
import { wmu_commands, IWMUCommands } from "./wmu-commands";
import * as block from './blocks';
import * as wmutoc from './wmu-toc';

export function parseWmu(str: string, config: wmubase.IConfig) {
    let result = str;

    result = parseTags(str, config);
    result = parseBlocks(result, config);
    result = postParse(result, config);

    return result;
}

export function parseTags(str: string, config: wmubase.IConfig) {
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

function parseBlocks(str: string, config: wmubase.IConfig) {
    let result = str;

    let regex_block = /(?:[\r\n]*([\s\S]+?)(?:\r?\n)?(?:(?:\|=\r?\n)([\s\S]+?))?(?:\r?\n)?(?:(?:\|=\r?\n)([\s\S]+?))?)(?:\r?\n[\r\n]+)/gm;

    result = (result + wmubase.eol + wmubase.eol).replace(regex_block, 
        function (substring: string, ...args: any[]): any { // todo: ts edgecase 'any'?
            return parseWmuBlock(config, args[0], args[1], args[2]);
        }
    );

    return result;
}

function postParse(str: string, config: wmubase.IConfig) {

    let result = str;

    // add last chapter placeholder if there has been a chapter
    // todo: not ideal this
    let toc = wmutoc.tocTree;
    let currentChapterId = toc.getCurrentChapterId();
    if (currentChapterId) {
        result += wmubase.createNotesPlaceholder(currentChapterId);
    }

    return result;
}

function parseWmuBlock(config: wmubase.IConfig, block1: string, block2: string, block3: string): string
{
    let result: string[] = [];

    // always remove any pipe characters at the beginning of each line:
    if (block2) {
        block2 = block2.replace(/^\|/gm, '');
    }
    if (block3) {
        block3 = block3.replace(/^\|/gm, '');
    }

    let def;
    let isBlock = block1.charCodeAt(0) === 124;
    if (isBlock) {
        def = wmubase.parseDef(block1); // try catch

        switch(def['block-type']) {
            case 'table':
            case 't':
                result.push( block.table.parse(def, block2, block3) );
                break;
            case 'header':
            case 'h':
                result.push( block.header.parse(def, config) );
                break;
            case 'quote':
            case 'q':
                result.push( block.quote.parse(def, block2, block3) );
                break;
            case 'code':
            case 'c':
                result.push( block.code.parse(def, block2) );
                break;
            case 'block':
            case 'b':
                result.push( block.block.parse(def, block2) );
                break;
            case 'image':
            case 'img':
            case 'i':
                result.push( block.img.parse(def) );
                break;
            case 'list':
            case 'l':
                result.push( block.list.parse(def, block2) );
                break;
            case 'par':
            case 'p':
                result.push( block.par.parse(def, block2,) );
                break;
            case 'footnote':
            case 'fn':
                result.push( block.note.parse(def, block2) );
                break;
            case 'glossary':
            case 'g':
                result.push( block.glossary.parse(def, block2) );
                break;
            case 'config':
                result.push( block.config.parse(def, config) );
                break;
        }
    } else {
        // no | at beginning means: standard paragraph:
        result.push( block.par.parse(<wmubase.IBlockDefinition>{}, block1,) );
    }    
    return result.join('');
}
