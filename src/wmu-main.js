var fs = require('fs')

const eol = "\r\n";

var wmubase = require('./wmu-base');
var wmutable = require('./wmu-table');
var wmuquote = require('./wmu-quote');
var wmucode = require('./wmu-code');
var wmuheader = require('./wmu-header');

const regex_LineEscape = '\\|';

const wmu_commands = [
    // { onnodig?
    //     type: 'ampersand',
    //     regex: /(?: *)&(?: *)/g,
    //     to: '&#x26;'
    // },
    {
        type: 'escaped-pipe', // when: 1. pipe is needed as first character of a line; 2. inside a table
        regex: /\\\|/g,
        to: '&#x7c;'
    },
    {
        type: 'paragraphs', // should be before lines starting with '|'
        regex: new RegExp( '^(?!' + regex_LineEscape + ')(.+?)(?=$|\\r?\\n\\r?\\n)', 'gm'),
        to: '<p>$&</p>'
    },

    // // inline:
    {
        type: 'bold', 
        regex: /(?:\*\*)(.+)(?:\*\*)/, 
        to: '<b>$1</b>' 
    },
    {
        type: 'underscore', 
        regex: /(?:\_\_)(.+)(?:\_\_)/, 
        to: '<u>$1</u>' 
    },
    {
        type: 'strike-trough', 
        regex: /(?:~~)(.+)(?:~~)/, 
        to: '<del>$1</del>' 
    },
    {
        type: 'inline-quote', 
        regex: /(?:"")(.+)(?:"")/, 
        to: '<q>$1</q>' 
    },
    {
        type: 'inline-code',
        regex: /(?:`)(.+)(?:`)/,
        to: '<code>$1</code>'
    },
    {
        type: 'italic',
        regex: /(?:\/\/)(.+)(?:\/\/)/,
        to: '<i>$1</i>'
    },

    // blocks:
    {
        type: 'table',
        regex: wmutable.regex_Table,
        to: wmutable.transformtable
    },
    {
        type: 'block-quote',
        regex: wmuquote.regex_Quote,
        to: wmuquote.transformquote
    },
    {
        type: 'block-code',
        regex: wmucode.regex_Code,
        to: wmucode.transformcode
    },
    {
        type: 'chapters',
        level: 'book',
        regex: new RegExp('(\|h\|\d{1,6}\|(.*?\r?\n)*)(?=$|\|h\|1\|)', 'g'), // todo
        to: '<div class="bookpage_xxxtemp">$1</div>'
    },
    {
        type: 'headers',
        regex: wmuheader.regex_Header,
        to: wmuheader.transformheader
    },

    // rest:

    // onnodig?! want enkele \r?\n -> <br>?!
    // {
    //     type: 'empty-lines',
    //     regex: new RegExp('(^' + regex_LineEscape + '\\.\\r?\\n)','gm'),
    //     to: '<br>\r\n'
    // }
    
    // {
    //     type: 'single-newlines',
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

function transformWmu(str, config){

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

    let _wmuproject = wmubase.getAll();
 
    let data = fs.readFileSync(filename, 'utf8');
        let wmusettings = data.split(/\r\n/gm);
        wmusettings.forEach(element => {
            setting = element.split(/\|/);
            _wmuproject[setting[0]] = setting[1];
        });

    if (_wmuproject.files) {
        let bodyWmu = concatFiles(_wmuproject.files);
        let bodyHtml = composeHtml(bodyWmu, _wmuproject, newConfig);
        if (_wmuproject.toc.length) {
            console.log('toc ', _wmuproject.toc)
        }
        return bodyHtml;
    } else {
        console.log('No files found in config file')
    }
}

function composeHtml(wmustring, wmuproject, config) {

    let result = "";

    result = transformWmu(wmustring, config);

    if (config.fullHtml) {
        let vars = { 
            cssx: "../test.css",
            transformed: result
        };
        let templ = getHTMLstr();
        result = fillTemplate(templ, vars);
    }

    let toc = wmuproject.toc;
    if (config.createToc && toc) {

        let tocHtml = "toc: " + toc;

        if (config.fullHtml) {
            result = result.replace(/##toc##/, tocHtml);
        } else {
            result = tocHtml + result;
        }
    }

    return result;
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