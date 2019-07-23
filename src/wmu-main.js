var fs = require('fs')

var wmubase = require('./wmu-base');
var wmutable = require('./wmu-table');
var wmuquote = require('./wmu-quote');
var wmucode = require('./wmu-code');
var wmupar = require('./wmu-par');
var wmulist = require('./wmu-list');
var wmuheader = require('./wmu-header');
var wmutoc = require('./wmu-toc');

const wmu_commands = [
    // { onnodig?
    //     description: 'ampersand',
    // type: 'inline',
    //     regex: /(?: *)&(?: *)/g,
    //     to: '&#x26;'
    // },


    // todo: inline en block list?!
    // todo: markdown compatability?

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

const defaultConfig = {
    fullHtml: undefined, // depends on which function is called
    createToc: false,
    toBook: false,
};

function transformFragment(str, config) {

    const newConfig = Object.assign(defaultConfig, config, { fullHtml: false });

    return transformWmu(str, newConfig);
}

function transformWmu(str, config) {

    // first step: inline
    wmu_commands.forEach((cmd) => {

        if (cmd.level === 'book' && !config.toBook) {
            return;
        }

        str=str.replace(cmd.regex, cmd.to);
    });

    // second step: blocks
    return (str + wmubase.eol + wmubase.eol).replace(/(?:([\s\S]+?)(?:(?:\r?\n\|=\r?\n)([\s\S]+?))?(?:(?:\r?\n\|=\r?\n)([\s\S]+?))?)(?:\r?\n[\r\n]+)/gm, 
        transformWmuBlock);
}

function transformWmuBlock(match, type, part1, part2) 
{
    let result = [];

    // remove all pipe characters at the beginning of each line
    if (part1) {
    part1 = part1.replace(/^\|/gm, '');
    }
    if (part2) {
    part2 = part2.replace(/^\|/gm, '');
    }

    var isBlock = type.charCodeAt(0) === 124;

    let def;
    if (isBlock) {
        def = wmubase.parseDef(type);
    } else {
        if (/^- */.test(type)) {
            def = {
                'block-type': 'list'
            };
            part1 = type;
        } else {
        def = {
            'block-type': 'par'
            };
        }
    }

    switch(def['block-type']) {
        case 'table':
        case 't':
            result.push( wmutable.wmutableparse(def, part1, part2) );
            break;
        case 'header':
        case 'h':
            result.push( wmuheader.wmuheaderparse(def) );
            break;
        case 'quote':
        case 'q':
            result.push( wmuquote.wmuquoteparse(def, part1, part2) );
            break;
        case 'code':
            result.push( wmucode.wmucodeparse(def, part1) );
            break;
        case 'list':
            result.push( wmulist.wmulistparse(def, part1) );
            break;
        case 'par':
            result.push( wmupar.wmuparparse(type) );
            break;
    }
    
    return result.join('');
}

function processConfigFile(filename, config) {

    const newConfig = Object.assign(defaultConfig, config, { fullHtml: true });

    let _wmuproject = wmubase.init();
 
    let data = fs.readFileSync(filename, 'utf8');
        let wmusettings = data.split(/\r\n/gm);
        wmusettings.forEach(element => {
            setting = element.split(/\|/);
            _wmuproject[setting[0]] = setting[1];
        });

    if (_wmuproject.files) {
        let bodyWmu = concatFiles(_wmuproject.files);
        let bodyHtml = composeHtml(bodyWmu, _wmuproject, newConfig);
        return bodyHtml;
    } else {
        console.log('No files found in config file')
    }
}

function composeHtml(wmustring, wmuproject, config) {

    let resultHtml = "";

    resultHtml = transformWmu(wmustring, config);

    if (config.fullHtml) {
        let vars = { 
            cssx: "../test.css",
            transformed: resultHtml
        };
        let templ = getHTMLstr();
        resultHtml = fillTemplate(templ, vars);
    }

    let toc = wmutoc.tocTree;
    if (config.createToc && toc.hasContent()) {

        let tocHtml = 
            '<h1>Table of contents</h1>' + wmubase.eol + wmubase.eol +
            '<div id=\'toc\'>' + wmubase.eol +
                toc.toHtml() +
            '</div>' + wmubase.eol;

        if (config.fullHtml) {
            resultHtml = resultHtml.replace(/##toc##/, tocHtml); // insert into template
        } else {
            resultHtml = tocHtml + resultHtml; //  simply prepend
        }
    }

    return resultHtml;
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
    transformWmu,
    transformFragment,
    processConfigFile
}