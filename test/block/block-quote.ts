import * as WmuLib from "../../src/WmuLib";
import { transformFragment } from '../../src/';

import { expect } from 'chai';
import 'mocha';

describe('Block quote', () => {

  it('should convert to html - using transform', () => {

    let str: string = `|quote|-:|format=abc
|=
Dit is een interessante quote
|=|
Door iemand`;

    const result = transformFragment(str, {});

    expect(result).to.equal(
      '<blockquote class="block-right abc">' + WmuLib.eol +
      '\t<div>' + WmuLib.eol +
      'Dit is een interessante quote' + WmuLib.eol +
      '\t</div>' + WmuLib.eol +
      '\t<footer>Door iemand</footer>' + WmuLib.eol +
      '</blockquote>'
    );
  });

});
