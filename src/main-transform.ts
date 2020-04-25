import * as fs from 'fs';
import * as path from 'path';

import * as wmubase from "./wmu-base";
import * as wmuparse from "./main-parse";
import * as wmutoc from "./wmu-toc";
import * as wmuNotes from "./wmu-notes";
import * as wmuindex from './wmu-index';

const defaultConfig: wmubase.IConfig = {
    createToc: false,
    toBook: false,
    autoNumbering: true,
};

type IDocResult = {
    body: string;
    toc: string;
    allnotes: wmuNotes.IHtmlNotes;
    index: wmuindex.IHtmlIndex;
}
function transformString(wmuString: string, config: wmubase.IConfig): IDocResult {

    const newConfig = Object.assign(defaultConfig, config, {});
    wmutoc.newTocTree(); // todo: eigenlijk niet goed
    wmuNotes.reset();

    let resultBody = wmuparse.parseWmu(wmuString, newConfig);
    // notesStore is gevuld
    let resultToc = newConfig.createToc ? wmutoc.tocTree.toHtml(newConfig.tocTitle, newConfig) : '';

    resultBody = wmuindex.parse(resultBody, newConfig);
    let index = wmuindex.indexStore.toHtml();

    resultBody = wmuNotes.parseInlineNoteIds(resultBody);

    let allnotes = wmuNotes.notesStore.toHtml();

    return {
        body: resultBody,
        toc: resultToc,
        allnotes: allnotes,
        index: index
    };
}

export function transformFragment(str: string, config: wmubase.IConfig): string {

    // todo: practically same as transformPage (DRY)

    let parsed = transformString(str, config);

    let resultHtml = fragmentHtml({
        body: parsed.body,
        head: '',
        lang: '',
        toc: parsed.toc
    });

    resultHtml = wmuNotes.insertFootNotes(resultHtml, parsed.allnotes, 'endOfChapter'); // todo
    resultHtml = wmuindex.insertIndex(resultHtml, parsed.index);

    return resultHtml;
}

export function transformPage(wmustring: string, config: wmubase.IConfig): string {

    // todo: practically same as transformFragment (DRY)

    let parsed = transformString(wmustring, config);

    let resultHtml = pageHtml(<IHtmlPositions>{
            lang: "nl",
            toc: parsed.toc,
            body: parsed.body,
            head: '\t\t<link rel="stylesheet" href="../test.css">' + wmubase.eol
        });

    resultHtml = wmuNotes.insertFootNotes(resultHtml, parsed.allnotes, 'endOfChapter'); //endOfBook'); // todo
    resultHtml = wmuindex.insertIndex(resultHtml, parsed.index);

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

    if (newConfig.outputPath) {
        let outputPath = path.normalize(projectFile.dir + path.sep + newConfig.outputPath);

        fs.writeFileSync(outputPath + path.sep + 'output.html', bodyHtml, 'utf8');

        return;
    }

    return bodyHtml;
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

${wmubase.EndOfBookPlaceholder()}

${wmubase.IndexPlaceholder()}

    </body>
</html>`;

    return templ;
}

function fragmentHtml(vars: IHtmlPositions): string {

    let templ = `${vars.toc}

${vars.body}

${wmubase.IndexPlaceholder()}
`;

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