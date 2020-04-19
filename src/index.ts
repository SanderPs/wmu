export {
    parseWmu
} from './main-parse';

export {
    transformFragment,
    transformPage,
    transformProject
} from "./main-transform";


// wip tests

import {transformPage} from "./main-transform";
import * as teststrings from './test-string';

if (typeof window === 'undefined') {
    // running in Node
    let isInTest = typeof global.it === 'function'; // Mocha running?
    if (!isInTest) {
        console.log('WMU: ', transformPage( teststrings.test1, {}));
    }
} else {
    // running in browser
}
export let teststring: string = teststrings.test1;


// todo:
//    wmu.transformProject("./examples/project1/config.wmu", { outputPath: 'C:/testwmu/'});

