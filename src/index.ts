export {
    parseWmu
} from './main-parse';

export {
    transformFragment,
    transformPage,
    transformProject
} from "./main-transform";

import {parseWmu} from "./main-parse";
import {transformPage} from "./main-transform";

console.log('WMU: ', 
    //parseWmu
    transformPage(
`|config|toc=true

|h1|=1

|h2|=1.2

Text in **bold**

Some text with index word: [[Jung]]==Jung, Carl== etc.

Some text with index word: [[Jung]]==Jung, Carl== etc.

Some text with index word: [[Freud]]==Freud, Sigmund== etc.

With a link: [[Go to Wikipedia]]@@en.wikipedia.org@@

Example of class: [[Some special styling]]##my-styling##

Example of using{{1}} a note.

|fn|id=1
|=
This is the note text

|code
|=
if x> 10
`, {})
);
