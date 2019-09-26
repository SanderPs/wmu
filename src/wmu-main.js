var fs = require('fs')
const path = require('path');

var wmubase = require('./wmu-base');
var wmutoc = require('./wmu-toc');
var wmuNotes = require('./wmu-notes');

var blockList = require('./block-list');
var blockCode = require('./block-code');
var blockImage = require('./block-img');
var blockPar = require('./block-par');
var blockQuote = require('./block-quote');
var blockHeader = require('./block-header');
var blockConfig = require('./block-config');
var blockTable = require('./block-table');
var blockBlock = require('./block-block');
var blockNote = require('./block-note');

const wmu_commands = [
    // { onnodig?
    //     description: 'ampersand',
    // type: 'inline',
    //     regex: /(?: *)&(?: *)/g,
    //     to: '&#x26;'
    // },


    // todo: inline en block list?!
    // todo: markdown compatability?
    // adding |toc -> set createtoc to true
    // output list of all used css classes
    // footnotes, chapter endnotes, book endnotes
    // escape all characters
    // escape blocks: |par \|code


    {
        description: 'escaped-pipe', // when: 1. pipe is needed as first character of a line; 2. inside a table
        type: 'inline',
        regex: /\\\|/g,
        to: '&#x7c;'
    },
  
    // // inline:
    {
        description: 'bold', 
        type: 'inline',
        regex: /(?:\*\*)(.+)(?:\*\*)/g, 
        to: '<b>$1</b>' 
    },
    {
        description: 'underscore', 
        type: 'inline',
        regex: /(?:\_\_)(.+)(?:\_\_)/g, 
        to: '<u>$1</u>' 
    },
    {
        description: 'strike-trough', 
        type: 'inline',
        regex: /(?:~~)(.+)(?:~~)/g, 
        to: '<del>$1</del>' 
    },
    {
        description: 'inline-quote', 
        type: 'inline',
        regex: /(?:"")(.+)(?:"")/g, 
        to: '<q>$1</q>' 
    },
    {
        description: 'inline-code',
        type: 'inline',
        regex: /(?:`)(.+)(?:`)/g,
        to: '<code>$1</code>'
    },
    {
        description: 'italic',
        type: 'inline',
        regex: /(?:\/\/)(.+)(?:\/\/)/g,
        to: '<i>$1</i>'
    },
    {
        description: 'superscript', 
        type: 'inline',
        regex: /(?:\^\^)(.+)(?:\^\^)/g, 
        to: '<sup>$1</sup>' 
    },
    {
        description: 'subscript', 
        type: 'inline',
        regex: /(?:\^_)(.+)(?:_\^)/g, // spiegelen! = de regel
        to: '<sub>$1</sub>' 
    },
    {
        description: 'class', 
        type: 'inline',
        regex: /(?:\[(.+)\])##(.+)(?:##)/g, 
        to: '<span class="$2">$1</span>' 
    },
    {
        description: 'hyperlink', 
        type: 'inline',
        regex: /(?:\[(.+)\])\(\((.+)(?:\)\))/g, 
        to: '<a href="$2">$1</a>' 
    },

    {
        description: 'markdown-header-1', 
        type: 'markdown',
        regex: /^(.+?)\r?\n={3,}/gm, 
        to: '|h1|$1' + wmubase.eol + wmubase.eol 
    },
    {
        description: 'markdown-header-2', 
        type: 'markdown',
        regex: /^(.+?)\r?\n-{3,}/gm, 
        to: '|h2|$1' + wmubase.eol + wmubase.eol 
    }

];

const defaultConfig = {
    createToc: false,
    toBook: false,
};

function parseWmu(str, config) {

    // first step: inline
    wmu_commands.forEach((cmd) => {

        if (cmd.level === 'book' && !config.toBook) {
            return;
        }

        str=str.replace(cmd.regex, cmd.to);
    });

    // second step: blocks
    str = (str + wmubase.eol + wmubase.eol).replace(/(?:[\r\n]*([\s\S]+?)(?:(?:\r?\n\|=\r?\n)([\s\S]+?))?(?:(?:\r?\n\|=\r?\n)([\s\S]+?))?)(?:\r?\n[\r\n]+)/gm, 
        parseWmuBlock.bind(this, config));


    // third step: if there are h1's
    let toc = wmutoc.tocTree;
      let currentChapterId=toc.getCurrentChapterId();
      if (currentChapterId) {
        str +=
          '<!-- footnotes ' + currentChapterId + ' -->' + wmubase.eol + wmubase.eol
        ;
 
    }

    return str;
}

function parseWmuBlock(config, match, block1, block2, block3) 
{
    let result = [];

    // remove all pipe characters at the beginning of each line
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
            result.push( blockHeader.parse(def) );
            break;
        case 'quote':
        case 'q':
            result.push( blockQuote.parse(def, block2, block3) );
            break;
        case 'code':
        case 'c':
            result.push( blockCode.parse(def, block2) );
            break;
        case 'block':
        case 'b':
            result.push( blockBlock.parse(def, block2) );
            break;
        case 'image':
        case 'img':
        case 'i':
            result.push( blockImage.parse(def) );
            break;
        case 'list':
        case 'l':
            result.push( blockList.parse(def, block2) );
            break;
        case 'par':
        case 'p':
            result.push( blockPar.parse(block1) );
            break;
        case 'footnote':
        case 'fn':
            result.push( blockNote.parse(def, block2) );
            break;
        case 'config':
            result.push( blockConfig.parse(def, config) );
            break;
    }
    
    return result.join('');
}

function transformString(wmuString, config) {

    const newConfig = Object.assign(defaultConfig, config, {});
    wmutoc.newTocTree();
    wmuNotes.reset();

    resultBody = parseWmu(wmuString, newConfig);
    // notesStore is gevuld
    resultToc = wmuDoToc(newConfig, resultBody);
    resultBody = wmuNotes.parseInlineNoteIds(resultBody);

    let allnotes = wmuNotes.storedNotesToHtml(resultBody);

    return {
        body: resultBody,
        toc: resultToc,
        notes: allnotes,
        //index:
    };
}

function transformFragment(str, config) {

    let parsed = transformString(str, config);

    let resultHtml = parsed.toc + wmubase.eol  + wmubase.eol +
        parsed.body + wmubase.eol  + wmubase.eol; 
    
    resultHtml = wmuNotes.insertFootNotes(resultHtml, parsed.notes, 'endOfChapter'); // todo

    return resultHtml;
}

function transformPage(wmustring, config) {

    let parsed = transformString(wmustring, config);

    let resultHtml = getHTMLstr();

    resultHtml = resultHtml.replace(/##toc##/, parsed.toc);
    resultHtml = resultHtml.replace(/##body##/, parsed.body);
    resultHtml = resultHtml.replace(/##head##/, '\t\t<link rel="stylesheet" href="../test.css">' + wmubase.eol);

    resultHtml = wmuNotes.insertFootNotes(resultHtml, parsed.notes, 'endOfChapter'); //endOfBook'); // todo

    return resultHtml;
}

function transformProject(filepath, config) {

    const newConfig = Object.assign(defaultConfig, config, {});
    wmutoc.newTocTree();
    wmuNotes.reset();
    let _wmuproject = wmubase.init();

    let projectFile = path.parse(filepath);

    let data = fs.readFileSync(projectFile.dir + path.sep + projectFile.base, 'utf8');
    let wmusettings = data.split(/\r\n/gm);

    wmusettings.forEach(element => {
        setting = element.split(/\|/);
        _wmuproject[setting[0]] = setting[1];
    });

    if (!(_wmuproject.files && _wmuproject.files.length)) {
        console.log('ERROR: No files found in config file');
        return; // todo: throw
    }

    let bodyWmu = concatFiles(_wmuproject.files, projectFile.dir + path.sep);
    let bodyHtml = transformPage(bodyWmu, newConfig);

    if (config.outputPath) {
        let outputPath = path.normalize(projectFile.dir + path.sep + config.outputPath);

        fs.writeFileSync(outputPath + path.sep + 'output.html', bodyHtml, 'utf8');

        return;
    } 

    return bodyHtml;
}

function wmuDoToc(config) {
    let tocHtml = "";
    let toc = wmutoc.tocTree;
    if (config.createToc && toc.hasContent()) {
        if (config.tocTitle) {
            tocHtml += '<h1>' + config.tocTitle + '</h1>' + wmubase.eol + wmubase.eol;
        }

        tocHtml +=
            '<div id=\'toc\'>' + wmubase.eol +
                toc.toHtml() +
            '</div>' + wmubase.eol + wmubase.eol;
    }
    return tocHtml;
}

function getHTMLstr() {

    let lang = 'nl';

    let templ = `<!doctype html>
<html lang='${lang}'>
    <head>
        <meta charset="utf-8">
        <title>boek</title>

        <link rel="stylesheet" href="../book-imitate.css">
        <link rel="stylesheet" href="../base.css">
##head##
    </head>

    <body class="multipage">

<div class="bookpage">
    ##toc##
</div>
    
##body##

<!-- # notes-endofbook # -->

    </body>
</html>`;

    return templ;
}

function concatFiles(files, location) {
    let contentArray = [];
    let allfiles = files.split(/,/);

    allfiles.forEach(file => {

        let filename = location + file.trim();

        if (!fs.existsSync(filename)) {
            console.log('file not found: ' + filename);
        }

        try {
            contentArray.push( fs.readFileSync(filename, 'utf8') );
        } catch (err) {
            console.log('error reading file', err)
        };

    });

    return contentArray.join(wmubase.eol + wmubase.eol) + wmubase.eol + wmubase.eol;
}

// todo: mode to util or something:
const fillTemplate = function(templ, vars){
   // new Function(`return \`${templ}\`;`).call(vars);
    return new Function("return `" + templ + "`;").call(vars);
}

module.exports = {
    transformFragment,
    transformPage,
    transformProject
}