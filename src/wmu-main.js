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
var blockGlossary = require('./block-glossary');


const defaultConfig = {
    createToc: false,
    toBook: false,
};


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