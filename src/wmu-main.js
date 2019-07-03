var fs = require('fs')

const eol = "\r\n";

var wmutable = require('./wmu-table');
var wmuquote = require('./wmu-quote');
var wmucode = require('./wmu-code');

const regex_LineEscape = '\\|';

const wmu_commands = [
    {
        type: 'paragraphs', // should be first in line
        regex: new RegExp( '^(?!' + regex_LineEscape + ')(.+?)(?=$|\\r?\\n\\r?\\n)', 'gm'),
        to: '<p>$&</p>'
    },

    // inline:
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
        regex: '<del>$1</del>', 
        to: '<b>$1</b>' 
    },
    {
        type: 'inline-quote', 
        regex: '<q>$1</q>', 
        to: '<b>$1</b>' 
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
        regex: new RegExp('(\|h\|\d{1,6}\|(.*?\r?\n)*)(?=$|\|h\|1\|)', 'g'), // todo
        to: '<div class="bookpage">$1</div>'
    }
    {
        type: 'headers',
        regex: new RegExp('^' + regex_LineEscape + 'h\\|(\\d{1,6})\\|\'(.*?)\'\\r?\\n','gm'),
        to: '<h$1>$2</h$1>' + eol
    },

    // rest:
    {
        type: 'empty-lines',
        regex: new RegExp('(^' + regex_LineEscape + '\\.\\r?\\n)','gm'),
        to: '<br>\r\n'
    }
];

const defaultConfig = {
    fullHtml: undefined, // depends on which function is called
    createToc: false,
};

function transformString(str, config){

    const newConfig = Object.assign(defaultConfig, config, { fullHtml: false });

    wmu_commands.forEach((cmd) => {
        str=str.replace(cmd.regex, cmd.to);
    });
    return str;
}

function processConfigFile(filename, config) {

    const newConfig = Object.assign(defaultConfig, config);
    let wmuproject = {};

    let data = fs.readFileSync(filename, 'utf8');
        let wmusettings = data.split(/\r\n/gm);
        wmusettings.forEach(element => {
            setting = element.split(/\|/);
            wmuproject[setting[0]] = setting[1];
        });

    if (wmuproject.files) {
        let bodyhtml = concatFiles(wmuproject.files);
        return composeHtml(bodyhtml, config);
    } else {
        console.log('No files found in config file')
    }
}

function composeHtml(wmustring, config) {

    let result = "";

    result = transformString(wmustring);

    if (config.fullHtml) {
        let vars = { 
            cssx: "../test.css",
            transformed: result
        };
        let templ = getHTMLstr();
        result = fillTemplate(templ, vars);
    }

    if (config.createToc) {

        let tocHtml = "toc";

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

        <link rel="stylesheet" href="css/styles.css?v=1.0">
        <link rel="stylesheet" href="##1##">
        <link rel="stylesheet" href="../book-imitate.css">
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
    transformString,
    processConfigFile
}