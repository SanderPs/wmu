import * as wmubase from "./wmu-base";

import { wmu_commands, IWMUCommands } from "./wmu-commands";

import * as blockTable from './block-table';
import * as blockQuote from './block-quote';
import * as blockList from "./block-list";

console.log('WMU: ', 
    parseWmu(`

|table|:-:
|format=dash
|caption=Fig 1.
|=
|a|b|c|d|e|
|:---|---:|:---:|-:-|---|
|v=T||-||_|
|=
|1|2|3|4|5|

|quote
|=
|Quote
|=
|Door SP

|list|=1|type=A
|=
1 een 
-:2 twee
3 drie

    `, {})
);


export function parseWmu(str: string, config: object) {

    let result = str;

    // first step: inline
    wmu_commands.forEach((cmd: IWMUCommands) => {

        // todo: wordt nu niet (meer?) gebruikt
        // if (cmd.level === 'book' && !config.toBook) {
        //     return;
        // }

        result=result.replace(cmd.regex, cmd.to);
    });

    // second step: blocks
    let regex_block = /(?:[\r\n]*([\s\S]+?)(?:\r?\n)(?:(?:\|=\r?\n)([\s\S]+?))(?:\r?\n)?(?:(?:\|=\r?\n)([\s\S]+?))?)(?:\r?\n[\r\n]+)/gm;

    interface x {
        match?: string;
        block1?: string;
        block2?: string;
        block3?: string;
    }

    result = (result + wmubase.eol + wmubase.eol).replace(regex_block, 
        function (substring: string, ...args: any[]): any { // todo: ts edgecase 'any'?
            return parseWmuBlock(config, args[0], args[1], args[2]);
        }
    );


    // third step: if there are h1's
// temp!!!
    // let toc = wmutoc.tocTree;
    //   let currentChapterId=toc.getCurrentChapterId();
    //   if (currentChapterId) {
    //     result +=
    //       '<!-- footnotes ' + currentChapterId + ' -->' + wmubase.eol + wmubase.eol
    //     ;
 
    // }

    return result;
}


function parseWmuBlock(config: object, block1: string, block2: string, block3: string): string
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
        def = wmubase.parseDef(block1);
    } else {
        // a block that doesn't start with a pipe character is a paragraph:
        def = {
            'block-type': 'par'
            };
    }

    switch(def['block-type']) {
        case 'table':
        case 't':
            result.push( blockTable.parse(def, block2, block3) );
            break;
        case 'header':
        case 'h':
//            result.push( blockHeader.parse(def) );
            break;
        case 'quote':
        case 'q':
            result.push( blockQuote.parse(def, block2, block3) );
            break;
        case 'code':
        case 'c':
//            result.push( blockCode.parse(def, block2) );
            break;
        case 'block':
        case 'b':
//            result.push( blockBlock.parse(def, block2) );
            break;
        case 'image':
        case 'img':
        case 'i':
//            result.push( blockImage.parse(def) );
            break;
        case 'list':
        case 'l':
            result.push( blockList.parse(def, block2) );
            break;
        case 'par':
        case 'p':
//            result.push( blockPar.parse(block1) );
            break;
        case 'footnote':
        case 'fn':
//            result.push( blockNote.parse(def, block2) );
            break;
        case 'glossary':
        case 'g':
//            result.push( blockGlossary.parse(def, block2) );
            break;
        case 'config':
//            result.push( blockConfig.parse(def, config) );
            break;
    }
    
    return result.join('');
}
