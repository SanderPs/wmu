import * as wmubase from "../../src/wmu-base";
import { transformFragment } from '../../src/';

import { expect } from 'chai';
import 'mocha';

describe('Block glossary', () => {

  it('should convert to html - using transform', () => {

    let str: string = `|glossary
|=
|css
|css3
||Cascading Style Sheets
|html
||Hyper Text Markup Language`;

    const result = transformFragment(str, {});

    expect(result).to.equal(
      '<dl>' + wmubase.eol +
      '\t<div>' + wmubase.eol +
      '\t\t<dt>css</dt>' + wmubase.eol +
      '\t\t<dt>css3</dt>' + wmubase.eol +
      '\t\t<dd>Cascading Style Sheets</dd>' + wmubase.eol +
      '\t<div>' + wmubase.eol +
      '\t</div>' + wmubase.eol +
      '\t\t<dt>html</dt>' + wmubase.eol +
      '\t\t<dd>Hyper Text Markup Language</dd>' + wmubase.eol +
      '\t</div>' + wmubase.eol +
      '</dl>'
    );
  });

});
