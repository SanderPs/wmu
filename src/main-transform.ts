import * as fs from 'fs';
import * as path from 'path';

import * as wmubase from "./wmu-base";
import { WmuDocument } from "./WmuDocument";

export function transformFragment(wmustring: string, config: wmubase.IConfig): string {

    return new WmuDocument(
        wmustring, 
        Object.assign({}, config, <wmubase.IConfig>{format : 'fragment'})
    ).toHtml();
}

export function transformPage(wmustring: string, config: wmubase.IConfig): string {

    return new WmuDocument(
        wmustring, 
        Object.assign({}, config, <wmubase.IConfig>{format : 'page'})
    ).toHtml();
}

export function transformProject(filepath, config) {

    const newConfig = Object.assign({}, config, <wmubase.IConfig>{format : 'page'});
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

    let result = new WmuDocument(
        bodyWmu, 
        newConfig
    ).toHtml();

    if (newConfig.outputPath) {
        let outputPath = path.normalize(projectFile.dir + path.sep + newConfig.outputPath);

        fs.writeFileSync(outputPath + path.sep + 'output.html', result, 'utf8');

        return;
    }

    return result;
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