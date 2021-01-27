import * as WmuLib from "../../src/WmuLib";
import { transformFragment } from '../../src/';

import { expect } from 'chai';
import 'mocha';

describe('Block code', () => {

  it('should convert to html - using transform', () => {

    let str: string = `
|code
|language=js
|=
// some comment
|
function x() {
   if (y) {
      doThing(1);
   } else {
      doThing(2);
   }
}`;

    const result = transformFragment(str, {});

    expect(result).to.equal(
      `<div class="code-default">` + WmuLib.eol +
      `\t<table class="codelang-js">` + WmuLib.eol +
      `\t\t<tr><td>// some comment</td></tr>` + WmuLib.eol +
      `\t\t<tr><td>&nbsp;</td></tr>` + WmuLib.eol +
      `\t\t<tr><td>function x() {</td></tr>` + WmuLib.eol +
      `\t\t<tr><td>   if (y) {</td></tr>` + WmuLib.eol +
      `\t\t<tr><td>      doThing(1);</td></tr>` + WmuLib.eol +
      `\t\t<tr><td>   } else {</td></tr>` + WmuLib.eol +
      `\t\t<tr><td>      doThing(2);</td></tr>` + WmuLib.eol +
      `\t\t<tr><td>   }</td></tr>` + WmuLib.eol +
      `\t\t<tr><td>}</td></tr>` + WmuLib.eol +
      `\t</table>` + WmuLib.eol +
      `</div>`
    );
  });

  it('should convert line and inline diff - using transform', () => {

    let str: string = `
|code
|=
function z() {
// do something with [['result']]::note::
|
    return [[result]]::ins::::ins::
}
`;

    const result = transformFragment(str, {});

    expect(result).to.equal(
      `<div class="code-default">` + WmuLib.eol +
      `\t<table>` + WmuLib.eol +
      `\t\t<tr><td>function z() {</td></tr>` + WmuLib.eol +
      `\t\t<tr><td>// do something with <span class="code-note">'result'</span></td></tr>` + WmuLib.eol +
      `\t\t<tr><td>&nbsp;</td></tr>` + WmuLib.eol +
      `\t\t<tr class="ins"><td>    return <span class="code-ins">result</span></td></tr>` + WmuLib.eol +
      `\t\t<tr><td>}</td></tr>` + WmuLib.eol +
      `\t</table>` + WmuLib.eol +
      `</div>`
    );
  });


  it('should convert to html - using transform - output code-pre', () => {

    let str: string = `
|code
|language=js
|=
// some comment
|
function x() {
	if (y) {
		doThing(1);
	} else {
		doThing(2);
	}
}`;

    const result = transformFragment(str, { codeOutputFormat: 'code-pre' });

    expect(result).to.equal(
      `<pre class="codelang-js"><code>` + WmuLib.eol +
      `// some comment` + WmuLib.eol +
      WmuLib.eol +
      `function x() {` + WmuLib.eol +
      `\tif (y) {` + WmuLib.eol +
      `\t\tdoThing(1);` + WmuLib.eol +
      `\t} else {` + WmuLib.eol +
      `\t\tdoThing(2);` + WmuLib.eol +
      `\t}` + WmuLib.eol +
      `}\t</code>` + WmuLib.eol +
      `</pre>`
    );
  });


});
