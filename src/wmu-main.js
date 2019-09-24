var fs = require('fs')
const path = require('path');

var wmubase = require('./wmu-base');
var wmutable = require('./wmu-table');
var wmuquote = require('./wmu-quote');
var wmucode = require('./wmu-code');
var wmuimg = require('./wmu-img');
var wmupar = require('./wmu-par');
var wmublock = require('./wmu-block');
var wmulist = require('./wmu-list');
var wmuheader = require('./wmu-header');
var blockConfig = require('./block-config');
var wmutoc = require('./wmu-toc');
var blockfn = require('./block-fn');
var wmufn = require('./wmu-fn');

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
        regex: /(?:\*\*)(.+)(?:\*\*)/, 
        to: '<b>$1</b>' 
    },
    {
        description: 'underscore', 
        type: 'inline',
        regex: /(?:\_\_)(.+)(?:\_\_)/, 
        to: '<u>$1</u>' 
    },
    {
        description: 'strike-trough', 
        type: 'inline',
        regex: /(?:~~)(.+)(?:~~)/, 
        to: '<del>$1</del>' 
    },
    {
        description: 'inline-quote', 
        type: 'inline',
        regex: /(?:"")(.+)(?:"")/, 
        to: '<q>$1</q>' 
    },
    {
        description: 'inline-code',
        type: 'inline',
        regex: /(?:`)(.+)(?:`)/,
        to: '<code>$1</code>'
    },
    {
        description: 'italic',
        type: 'inline',
        regex: /(?:\/\/)(.+)(?:\/\/)/,
        to: '<i>$1</i>'
    },
    {
        description: 'superscript', 
        type: 'inline',
        regex: /(?:\^\^)(.+)(?:\^\^)/, 
        to: '<sup>$1</sup>' 
    },
    {
        description: 'subscript', 
        type: 'inline',
        regex: /(?:\^_)(.+)(?:\^_|_\^)/, // todo: keuze maken, spiegelen?
        to: '<sub>$1</sub>' 
    },
    {
        description: 'class', 
        type: 'inline',
        regex: /(?:\[(.+)\])##(.+)(?:##)/, 
        to: '<span class="$1">$2</span>' 
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
    },

    // blocks:

    // {
    //     description: 'chapters',
    //     type: 'block',
    //     level: 'book',
    //     regex: new RegExp('(\|h\|\d{1,6}\|(.*?\r?\n)*)(?=$|\|h\|1\|)', 'g'), // todo
    //     to: '<div class="bookpage_xxxtemp">$1</div>'
// },


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
            result.push( wmutable.wmutableparse(def, block2, block3) );
            break;
        case 'header':
        case 'h':
            result.push( wmuheader.wmuheaderparse(def) );
            break;
        case 'quote':
        case 'q':
            result.push( wmuquote.wmuquoteparse(def, block2, block3) );
            break;
        case 'code':
        case 'c':
            result.push( wmucode.wmucodeparse(def, block2) );
            break;
        case 'block':
        case 'b':
            result.push( wmublock.wmublockparse(def, block2) );
            break;
        case 'img':
        case 'i':
            result.push( wmuimg.wmuimgparse(def) );
            break;
        case 'list':
        case 'l':
            result.push( wmulist.wmulistparse(def, block2) );
            break;
        case 'par':
        case 'p':
            result.push( wmupar.wmuparparse(block1) );
            break;
        case 'footnote':
        case 'fn':
            result.push( blockfn.wmufnparse(def, block2) );
            break;
        case 'config':
            result.push( blockConfig.wmuconfigblock(def, config) );
            break;
    }
    
    return result.join('');
}

function transformString(wmuString, config) {

    const newConfig = Object.assign(defaultConfig, config, {});
    wmutoc.newTocTree();
    wmufn.reset();

    resultBody = parseWmu(wmuString, newConfig);
    // notesStore is gevuld
    resultToc = wmuDoToc(newConfig, resultBody);
    resultBody = wmufn.parseInlineNoteIds(resultBody);

    let allnotes = wmufn.storedNotesToHtml(resultBody);

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
    
    resultHtml = wmufn.insertFootNotes(resultHtml, parsed.notes, 'endOfChapter'); // todo

    return resultHtml;
}

function transformPage(wmustring, config) {

    let parsed = transformString(wmustring, config);

    let resultHtml = getHTMLstr();

    resultHtml = resultHtml.replace(/##toc##/, parsed.toc);
    resultHtml = resultHtml.replace(/##body##/, parsed.body);
    resultHtml = resultHtml.replace(/##head##/, '\t\t<link rel="stylesheet" href="../test.css">' + wmubase.eol);

    resultHtml = wmufn.insertFootNotes(resultHtml, parsed.notes, 'endOfChapter'); //endOfBook'); // todo

    return resultHtml;
}

function transformProject(filepath, config) {

    const newConfig = Object.assign(defaultConfig, config, {});
    wmutoc.newTocTree();
    wmufn.reset();
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