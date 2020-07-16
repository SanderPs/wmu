import * as wmubase from "../../src/wmu-base";
import { transformFragment } from '../../src/';

import { expect } from 'chai';
import 'mocha';

describe('Block quote', () => {

  it('should convert to html - using transform', () => {

    let str: string = `|quote|-:|format=abc
|=
Dit is een interessante quote
|=
Door iemand`;

    const result = transformFragment(str, {});

    expect(result).to.equal(
      '<blockquote class="block-right abc">' + wmubase.eol +
      '\t<div>' + wmubase.eol +
      'Dit is een interessante quote' + wmubase.eol +
      '\t</div>' + wmubase.eol +
      '\t<footer>Door iemand</footer>' + wmubase.eol +
      '</blockquote>'
    );
  });

});
