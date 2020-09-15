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

|img|src=https://bla.com/hoi.jpg

|list
|=
- item 1
- item 2

|list
|=
1. item 1
2. item 2

`;

if (typeof window === 'undefined') {
    // running in Node
    let isInTest = typeof global.it === 'function'; // Mocha running?
    if (!isInTest) {
        // console.log('WMU: ', transformFragment( WmuTestString, {}));
        // transformProject("./examples/project1/config.wmu", {}, { outputPath: './'});
    }
} else {
    // running in browser
}