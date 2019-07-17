var fs = require('fs')

const eol = "\r\n";

var wmubase = require('./wmu-base');
var wmutable = require('./wmu-table');
var wmuquote = require('./wmu-quote');
var wmucode = require('./wmu-code');
var wmuheader = require('./wmu-header');
var wmutoc = require('./wmu-toc');

const regex_LineEscape = '\\|';

const wmu_commands = [
    // { onnodig?
    //     description: 'ampersand',
    // type: 'inline',
    //     regex: /(?: *)&(?: *)/g,
    //     to: '&#x26;'
    // },
    {
        description: 'escaped-pipe', // when: 1. pipe is needed as first character of a line; 2. inside a table
        type: 'inline',
        regex: /\\\|/g,
        to: '&#x7c;'
    },
    {
        description: 'paragraphs', // should be before lines starting with '|'
        type: 'inline',
        regex: new RegExp( '^(?!' + regex_LineEscape + ')(.+?)(?=$|\\r?\\n\\r?\\n)', 'gm'),
        to: '<p>$&</p>'
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
    {
        description: 'table',
        type: 'block',
        regex: wmutable.regex_Table,
        to: wmutable.transformtable
    },
    {
        description: 'block-quote',
        type: 'block',
        regex: wmuquote.regex_Quote,
        to: wmuquote.transformquote
    },
    {
        description: 'block-code',
        type: 'block',
        regex: wmucode.regex_Code,
        to: wmucode.transformcode
    },
    // {
    //     description: 'chapters',
    //     type: 'block',
    //     level: 'book',
    //     regex: new RegExp('(\|h\|\d{1,6}\|(.*?\r?\n)*)(?=$|\|h\|1\|)', 'g'), // todo
    //     to: '<div class="bookpage_xxxtemp">$1</div>'
    // },
    {
        description: 'headers',
        type: 'block',
        regex: wmuheader.regex_Header,
        to: wmuheader.transformheader
    },

    // rest:

    // onnodig?! want enkele \r?\n -> <br>?!
    // {
    //     description: 'empty-lines',
    // type: '',
    //     regex: new RegExp('(^' + regex_LineEscape + '\\.\\r?\\n)','gm'),
    //     to: '<br>\r\n'
    // }
    
    // {
    //     description: 'single-newlines',
    // type: '',
    //     regex: /\r?\n(?!\r?\n)/g,
    //     to: '<br>'
    // }
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
    var funcList = {
        'table': wmutable.transformtable
    }
    var regexGeneralBlock = /^\|(.+?)(?:\||$)([\s\S]*?)(?=^\|-)\|-\r?\n([\s\S]*)(?=^\|-)\|-\r?\n([\s\S]*)/m;

    // inline markup:
    wmu_commands.forEach((cmd) => {

        if (cmd.type !== 'inline') {
            return;
        }

        str=str.replace(cmd.regex, cmd.to);
    });


    // parse all blocks:
    let result = [];
    parse = str.split(/\r?\n[\r\n]+/);
    for (var x=0 ; x<parse.length; x++) {
        // console.log('\n' + parse[x] + '\n\n');
        var isBlock = parse[x].charCodeAt(0) === 124;
        //var blockType = isBlock ? parse[x].match(/^\|(.+?)(?=\||$)/m)[1] : "par";
        var parsedBlock = parse[x].split(/\r?\n\|\|\r?\n/m);
        var parsedDef = parsedBlock[0].replace(/^\|/,"").replace(/[\r\n\|]+$/,"").split(/[\r\n\|]+/);
        var allVar = {};
        for (let x=1; x < parsedDef.length; x++) {
            let nameValue = parsedDef[x].split("=");
            if (nameValue.length === 1) {
                allVar['blok-align'] = nameValue[0];
            } else {
                allVar[nameValue[0]] = nameValue[1];
            }
        }

        switch(parsedDef[0]) {
            case 'table':
            case 't':
                result.push(wmutable.wmutableparse(allVar, parsedBlock[1], parsedBlock[2]));
        }

//        console.log('', isBlock, parsedBlock.length, parsedDef.join("="));
    }
    
    return result.join('');
}

function transformWmu_v1(str, config){

    wmu_commands.forEach((cmd) => {

        if (cmd.level === 'book' && !config.toBook) {
            return;
        }

        str=str.replace(cmd.regex, cmd.to);
    });

    return str;
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
            '<h1>Table of contents</h1>' + eol +
            '<div id=\'toc\'>' + eol +
                toc.toHtml() +
            '</div>' + eol;

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

    return contentArray.join(eol + eol); // important x2!
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