export {
    WmuDocument
} from './WmuDocument';

export {
    transformFragment,
    transformPage,
    transformProject
} from "./main-transform";


// wip tests

import { WmuDocument } from "./WmuDocument";
import * as teststrings from './test-string';

export let teststring: string = teststrings.test1;

console.log( new WmuDocument(teststrings.test1, {}).toHtml() );


import {transformPage} from "./main-transform";

if (typeof window === 'undefined') {
    // running in Node
    let isInTest = typeof global.it === 'function'; // Mocha running?
    if (!isInTest) {
        console.log('WMU: ', transformPage( teststrings.test1, {}));
    }
} else {
    // running in browser
}


// todo:
//    wmu.transformProject("./examples/project1/config.wmu", { outputPath: 'C:/testwmu/'});

