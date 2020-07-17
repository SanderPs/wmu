import * as fs from 'fs';
import * as path from 'path';

import * as wmubase from "./wmu-base";
import { IConfig, IWmuProject } from "./types";
import { WmuDocument } from "./WmuDocument";

export function transformFragment(wmustring: string, config: IConfig): string {

    return new WmuDocument(
        wmustring, 
        Object.assign({}, config, <IConfig>{format : 'fragment'}),
        {} as IWmuProject
    ).toHtml();
}

export function transformPage(wmustring: string, config: IConfig, projectData: IWmuProject): string {

    return new WmuDocument(
        wmustring, 
        Object.assign({}, config, <IConfig>{format : 'page'}),
        projectData
    ).toHtml();
}

export function transformProject(filepath: string, config: IConfig, projectSettings?: IWmuProject): string | undefined {

    let projectFile: path.ParsedPath = path.parse(filepath);
    let projectData = Object.assign({}, projectSettings, readProjectFile(projectFile));
    let projectWmu = concatFiles(projectData.files, projectFile.dir + path.sep);

    let result = transformPage(projectWmu, config, projectData)
    
    if (projectData?.outputPath) {
        let outputPath = (/^\.\//.test(projectData.outputPath)) ?
            path.normalize( path.join(projectFile.dir, projectData.outputPath) ) : // relative
            path.normalize( projectData.outputPath ); // absolute

        // todo: try catch
        fs.writeFileSync(outputPath + 'output.html', result, 'utf8');

        return;
    }

    return result
}

function readProjectFile(projectFile: path.ParsedPath): IWmuProject {

    let projectData = fs.readFileSync(projectFile.dir + path.sep + projectFile.base, 'utf8');

    let project: IWmuProject = Object.assign(
        {} as IWmuProject, 
        projectData
            .split(/(?:\r?\n)/gm)
            .map( line => line.split(/(?:\|)/))
            .reduce( (acc, val, i) => ({...acc, ...{[val[0]]: val[1]}}), {} )
    );

    if (!project?.files.length) {
        console.log('ERROR: No files found in config file');
        return; // todo: throw
    }

    return project;
}

function concatFiles(files: string, location: string): string {
    let contentArray = [];
    let allfiles = files.trim().split(/\s*,\s*/);

    allfiles.forEach(file => {
        let filename = location + file;

        if (!fs.existsSync(filename)) {
            console.log('file not found: ' + filename); // todo:
        }

        try {
            contentArray.push(fs.readFileSync(filename, 'utf8'));
        } catch (err) {
            console.log('error reading file', err)
        };

    });

    return contentArray.join(wmubase.eol + wmubase.eol) + wmubase.eol + wmubase.eol;
}