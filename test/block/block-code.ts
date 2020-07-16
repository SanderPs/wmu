import * as wmubase from "../../src/wmu-base";
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
      '<pre class="codelang-js"><code>// some comment' + wmubase.eol +
       wmubase.eol +
       'function x() {' + wmubase.eol +
      '   if (y) {' + wmubase.eol +
      '      doThing(1);' + wmubase.eol +
      '   } else {' + wmubase.eol +
      '      doThing(2);' + wmubase.eol +
      '   }' + wmubase.eol +
      '}'  + wmubase.eol + 
      '</code></pre>'
    );
  });

});
