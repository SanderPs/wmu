import * as WmuLib from "../../src/WmuLib";
import { transformFragment } from '../../src/';

import { expect } from 'chai';
import 'mocha';

describe('Block code', () => {

  it('should convert to html - using transform', () => {

    let str: string = `|code
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
}
`;

    const result = transformFragment(str, {});

    expect(result).to.equal(
      '<pre class="codelang-js"><code>// some comment' + WmuLib.eol +
      WmuLib.eol +
       'function x() {' + WmuLib.eol +
      '   if (y) {' + WmuLib.eol +
      '      doThing(1);' + WmuLib.eol +
      '   } else {' + WmuLib.eol +
      '      doThing(2);' + WmuLib.eol +
      '   }' + WmuLib.eol +
      '}'  + WmuLib.eol + 
      '</code></pre>'
    );
  });

});
