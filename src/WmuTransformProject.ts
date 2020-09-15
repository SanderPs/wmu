import * as fs from 'fs';
import * as path from 'path';

import { IConfig, IWmuProject } from "./types";
import * as WmuLib from "./WmuLib";
import { transformPage } from "./WmuTransformSingle";

export function transformProject(location: string, config: IConfig, projectSettings?: IWmuProject): string | undefined {

    let project

    try {
        project = fs.statSync( location );
    }
    catch(err) {
        return; // todo: return error
    }
    
    let projectData = {} as IWmuProject;
    let projectLocation = location;

    if (project.isFile()) {

        // load project.wmu
        projectData = readProjectFile( location );
        projectLocation = path.dirname( location );

    } else if (project.isDirectory()) {

        // check to see if folder has a config file:            
        let configFile: string = path.normalize( location ) + WmuLib.DefaultProjectFileName; 
        if (fs.existsSync(configFile)) {
            projectData = readProjectFile( configFile );
        } else {
            // it's a folder without a config file:
            projectData = {};
        }

    } else {

        // location points to something else
        return;
    }

    // if no output path is given, *assume* it's the project folder
    if (!projectSettings?.outputPath) {
        projectData.outputPath = projectLocation;
    } else {
        projectData.outputPath = path.normalize( projectLocation + projectSettings.outputPath );
    }

    projectData = Object.assign({}, projectSettings, projectData);

    let projectWmu: string;
    if (projectData.files?.length) {
        projectWmu = concatFiles(projectData.files, projectLocation);
    } else {
        projectWmu = getContentOfFiles(projectLocation);
    }

    let result = transformPage(projectWmu, config, projectData)
    
    if (projectData?.outputPath) {
        let outputPath = projectData.outputPath;
        fs.writeFileSync(outputPath + 'output.html', result, 'utf8');
        return;
    }

    return result
}

function readProjectFile(projectFile: string): IWmuProject {

    let projectData = fs.readFileSync(projectFile, 'utf8');

    let project: IWmuProject = Object.assign(
        {} as IWmuProject, 
        projectData
            .split(/(?:\r?\n)/gm)
            .map( line => line.split(/(?:\|)/))
            .reduce( (acc, val, i) => ({...acc, ...{[val[0]]: val[1]}}), {} )
    );

    if (!project.files?.length) {
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

    return contentArray.join(WmuLib.eol + WmuLib.eol) + WmuLib.eol + WmuLib.eol;
}


// folder:

function getContentOfFiles(filepath: string) {
	let projectFolder = path.normalize( filepath );
	let projectWmu = getFilesRecursive(projectFolder);

	return projectWmu.join(WmuLib.eol + WmuLib.eol);
}

function getFilesRecursive(loc: string) {

    var all = fs.readdirSync(loc).sort();

    return all.map(file => {
		let fl = loc + file;
		let flt = fs.statSync(fl);
        if (flt.isDirectory()) {
            return getFilesRecursive(fl);
		} else {
			if (!flt.isFile()) {
				return;
			}
			let flp = path.parse(fl);
			if (flp.ext === '.wmu' && flp.base !== WmuLib.DefaultProjectFileName) {
				return <string> fs.readFileSync(fl, 'utf8');
			}
		}
    });
}