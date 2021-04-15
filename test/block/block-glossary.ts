import * as WmuLib from "../../src/WmuLib";
import { transformFragment } from '../../src/';

import { expect } from 'chai';
import 'mocha';

describe('Block glossary', () => {

  it('should convert to html - using transform', () => {

    let str: string = `|glossary
|=
C
|css
|css3
||Cascading Style Sheets
H
|html
||Hyper Text Markup Language`;

    const result = transformFragment(str, {});

    expect(result).to.equal(
      '<dl>' + WmuLib.eol +
      '\t<div class="dl-level-0">' + WmuLib.eol +
      '\t\t<dt>C</dt>' + WmuLib.eol +
      '\t</div>' + WmuLib.eol +
      '\t<div class="dl-level-1">' + WmuLib.eol +
      '\t\t<dt>css</dt>' + WmuLib.eol +
      '\t\t<dt>css3</dt>' + WmuLib.eol +
      '\t\t<dd>Cascading Style Sheets</dd>' + WmuLib.eol +
      '\t</div>' + WmuLib.eol +
      '\t<div class="dl-level-0">' + WmuLib.eol +
      '\t\t<dt>H</dt>' + WmuLib.eol +
      '\t</div>' + WmuLib.eol +
      '\t<div class="dl-level-1">' + WmuLib.eol +
      '\t\t<dt>html</dt>' + WmuLib.eol +
      '\t\t<dd>Hyper Text Markup Language</dd>' + WmuLib.eol +
      '\t</div>' + WmuLib.eol +
      '</dl>'
    );
  });

});
