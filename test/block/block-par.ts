import * as wmubase from "../../src/wmu-base";
import { transformFragment } from '../../src/';

import { expect } from 'chai';
import 'mocha';

describe('Block paragraph', () => {

  it('should convert to html - using transform', () => {

    let str: string = `|par|format=css-class-xyz
|=
This is a paragraph with a css class`;

    const result = transformFragment(str, {});

    expect(result).to.equal(
      '<p class="css-class-xyz">' + wmubase.eol +
      'This is a paragraph with a css class' + wmubase.eol +
      '</p>'
    );
  });

});
