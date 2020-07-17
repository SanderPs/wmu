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

import {transformPage} from "./WmuTransformSingle";
import {transformProject} from "./WmuTransformProject";

let WmuTestString = ``;

if (typeof window === 'undefined') {
    // running in Node
    let isInTest = typeof global.it === 'function'; // Mocha running?
    if (!isInTest) {
        // console.log('WMU: ', transformPage( WmuTestString, {}));
        transformProject("./examples/project1/config.wmu", {}, { outputPath: './'});
    }
} else {
    // running in browser
}