var fs = require('fs')

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

    // blocks:

    // {
    //     description: 'chapters',
    //     type: 'block',
    //     level: 'book',
    //     regex: new RegExp('(\|h\|\d{1,6}\|(.*?\r?\n)*)(?=$|\|h\|1\|)', 'g'), // todo
    //     to: '<div class="bookpage_xxxtemp">$1</div>'
// },


];

const markdownCommands = [
    {
        description: 'simple-header',
        regex: /^([/s/S]+?)\r?\n(-{3,}.*?\r?\n)/gm,
        def_index: 0,
        body: undefined
    },


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
    return (str + wmubase.eol + wmubase.eol).replace(/(?:[\r\n]*([\s\S]+?)(?:(?:\r?\n\|=\r?\n)([\s\S]+?))?(?:(?:\r?\n\|=\r?\n)([\s\S]+?))?)(?:\r?\n[\r\n]+)/gm, 
        parseWmuBlock.bind(this, config));
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

function transformFragment(str, config) {

    const newConfig = Object.assign(defaultConfig, config, {});
    wmutoc.newTocTree();
    wmufn.reset();
    let resultHtml = "";

    resultHtml = parseWmu(str, newConfig);
    resultToc = wmuDoToc(newConfig, resultHtml);

    resultHtml = resultToc + resultHtml; //  simply prepend

    return resultHtml;
}

function transformPage(wmustring, config) {

    const newConfig = Object.assign(defaultConfig, config, {});
    wmutoc.newTocTree();
    wmufn.reset();
    let resultHtml = "";

    resultHtml = parseWmu(wmustring, newConfig);
    resultToc = wmuDoToc(newConfig, resultHtml);
    resultFootnotes = wmufn.parseNotes(resultHtml);

    // todo: dit kan beter
    let vars = { 
        cssx: "../test.css",
        transformed: resultFootnotes
    };
    let templ = getHTMLstr();

    resultHtml = fillTemplate(templ, vars);
    resultHtml = resultHtml.replace(/##toc##/, resultToc); // insert into template
    // todo

    return resultHtml;
}

function transformProject(filename, config) {

    const newConfig = Object.assign(defaultConfig, config, {});
    wmutoc.newTocTree();
    wmufn.reset();
    let _wmuproject = wmubase.init();

    let data = fs.readFileSync(filename, 'utf8');
    let wmusettings = data.split(/\r\n/gm);

    wmusettings.forEach(element => {
        setting = element.split(/\|/);
        _wmuproject[setting[0]] = setting[1];
    });

    if (!(_wmuproject.files && _wmuproject.files.length)) {
        console.log('ERROR: No files found in config file');
        return; // todo: throw
    }

    let bodyWmu = concatFiles(_wmuproject.files);
    let bodyHtml = transformPage(bodyWmu, newConfig);
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

        <link rel="stylesheet" href="##1##">
        <link rel="stylesheet" href="../book-imitate.css">
        <link rel="stylesheet" href="../base.css">
    </head>

    <body class="multipage">

<div class="bookpage">
    ##toc##
</div>
    
##2##

    </body>
</html>`;

    templ = templ.replace('##1##','${this.cssx}');
    templ = templ.replace('##2##','${this.transformed}');
    return templ;
}

function concatFiles(files) {
    let contentArray = [];
    let allfiles = files.split(/,/);

    allfiles.forEach(file => {

        let filename = "./" + file.trim();

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