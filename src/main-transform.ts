import * as fs from 'fs';
import * as path from 'path';

import * as wmubase from "./wmu-base";
import * as wmuparse from "./main-parse";
import * as wmutoc from "./wmu-toc";
import * as wmuNotes from "./wmu-notes";


const defaultConfig: wmubase.IConfig = {
    createToc: false,
    toBook: false,
};

type IDocResult = {
    body: string;
    toc: string;
    allnotes: wmuNotes.IHtmlNotes;
}
export function transformString(wmuString: string, config: wmubase.IConfig): IDocResult {

    const newConfig = Object.assign(defaultConfig, config, {});
    wmutoc.newTocTree();
    wmuNotes.reset();

    let resultBody = wmuparse.parseWmu(wmuString, newConfig);
    // notesStore is gevuld
    let resultToc = wmuDoToc(newConfig);
    resultBody = wmuNotes.parseInlineNoteIds(resultBody);

    let allnotes = wmuNotes.notesStore.toHtml();

    return {
        body: resultBody,
        toc: resultToc,
        allnotes: allnotes,
        //index:
    };
}

export function transformFragment(str: string, config: wmubase.IConfig): string {

    let parsed = transformString(str, config);

    let resultHtml = parsed.toc + wmubase.eol + wmubase.eol +
        parsed.body + wmubase.eol + wmubase.eol;

    resultHtml = wmuNotes.insertFootNotes(resultHtml, parsed.allnotes, 'endOfChapter'); // todo

    return resultHtml;
}

export function transformPage(wmustring: string, config: wmubase.IConfig): string {
    let parsed = transformString(wmustring, config);

    let resultHtml = pageHtml(<IHtmlPositions>{
            lang: "nl",
            toc: parsed.toc,
            body: parsed.body,
            head: '\t\t<link rel="stylesheet" href="../test.css">' + wmubase.eol
        });

    resultHtml = wmuNotes.insertFootNotes(resultHtml, parsed.allnotes, 'endOfChapter'); //endOfBook'); // todo

    return resultHtml;
}

export function transformProject(filepath, config) {

    const newConfig = Object.assign(defaultConfig, config, {});
    wmutoc.newTocTree();
    wmuNotes.reset();
    let _wmuproject: wmubase.IProject = wmubase.init();

    let projectFile = path.parse(filepath);

    let data = fs.readFileSync(projectFile.dir + path.sep + projectFile.base, 'utf8');
    let wmusettings = data.split(/\r\n/gm);

    wmusettings.forEach(element => {
        let setting = element.split(/\|/);
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

function wmuDoToc(config: wmubase.IConfig): string {
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

interface IHtmlPositions {
    lang: string;
    toc: string;
    body: string;
    head: string;
}
function pageHtml(vars: IHtmlPositions): string {

    let templ = `<!doctype html>
<html lang='${vars.lang}'>
    <head>
        <meta charset="utf-8">
        <title>boek</title>

        <link rel="stylesheet" href="../book-imitate.css">
        <link rel="stylesheet" href="../base.css">
${vars.head}
    </head>

    <body class="multipage">

<div class="bookpage">
${vars.toc}
</div>
    
${vars.body}

<!-- # notes-endofbook # -->

    </body>
</html>`;

    return templ;
}

function concatFiles(files: string, location: string): string {
    let contentArray = [];
    let allfiles = files.split(/,/);

    allfiles.forEach(file => {

        let filename = location + file.trim();

        if (!fs.existsSync(filename)) {
            console.log('file not found: ' + filename);
        }

        try {
            contentArray.push(fs.readFileSync(filename, 'utf8'));
        } catch (err) {
            console.log('error reading file', err)
        };

    });

    return contentArray.join(wmubase.eol + wmubase.eol) + wmubase.eol + wmubase.eol;
}