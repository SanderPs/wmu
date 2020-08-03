export {
    WmuDocument
} from './WmuDocument';

export {
    transformFragment,
    transformPage
} from "./WmuTransformSingle";

export {
    transformProject
} from "./WmuTransformProject";


// wip tests

import {transformFragment} from "./WmuTransformSingle";
import {transformProject} from "./WmuTransformProject";

let WmuTestString = `
|h1|=test hst 1

|h2|=par 1.1

|h1|=test hst 2

|h2|=par 2.1
`;

if (typeof window === 'undefined') {
    // running in Node
    let isInTest = typeof global.it === 'function'; // Mocha running?
    if (!isInTest) {
        // console.log('WMU: ', transformFragment( WmuTestString, {}));
        // transformProjectFile("./examples/project1/config.wmu", {}, { outputPath: './'});
        console.log(transformProject("./examples/project2/", {}, { outputPath: './'}) );
    }
} else {
    // running in browser
}