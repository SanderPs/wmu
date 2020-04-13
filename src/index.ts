export {
    parseWmu
} from './main-parse';

export {
    transformFragment,
    transformPage,
    transformProject,
    transformString
} from "./main-transform";

import {parseWmu} from "./main-parse";

console.log('WMU: ', 
parseWmu(`Text in **bold**\n\n|code\n|=\nif x> 10`, {})
);

import {fillTemplate} from "./main-transform";

console.log('tmpl ', fillTemplate("test ${this.nr1} test",{"nr1": "ja"}));