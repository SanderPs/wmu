import * as WmuLib from "../../src/WmuLib";
import { transformFragment } from '../../src/';

import { expect } from 'chai';
import 'mocha';

describe('Block block', () => {

  it('should convert to html - using transform', () => {

    let str: string = `|block|=css-thumbsup-class
|=
This is text inside a block (div)!`;

    const result = transformFragment(str, {});

    expect(result).to.equal(
      '<div class="css-thumbsup-class">' + WmuLib.eol +
      'This is text inside a block (div)!' + WmuLib.eol +
      '</div>'
    );
  });

});
