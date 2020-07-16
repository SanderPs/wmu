import * as wmubase from "../../src/wmu-base";
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
      '<div class="css-thumbsup-class">' + wmubase.eol +
      'This is text inside a block (div)!' + wmubase.eol +
      '</div>'
    );
  });

});
