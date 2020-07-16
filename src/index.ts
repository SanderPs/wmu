export {
    WmuDocument
} from './WmuDocument';

export {
    transformFragment,
    transformPage,
    transformProject
} from "./main-transform";


// wip tests

import {transformPage} from "./main-transform";

let WmuTestString = ``;

if (typeof window === 'undefined') {
    // running in Node
    let isInTest = typeof global.it === 'function'; // Mocha running?
    if (!isInTest) {
        console.log('WMU: ', transformPage( WmuTestString, {}));
    }
} else {
    // running in browser
}
