import * as WmuLib from "../../src/WmuLib";
import { transformFragment } from '../../src/';

import { expect } from 'chai';
import 'mocha';

describe('Tag [encode]', () => {

  it('should convert to html - ampersand', () => {
    const result = transformFragment(`Text with & example`, {});

    expect(result).to.equal('<p>' + WmuLib.eol +
    'Text with &amp; example' + WmuLib.eol +
    '</p>');
  });

  it('should convert to html - skip &amp;', () => {
    const result = transformFragment(`Text with &amp; example`, {});

    expect(result).to.equal('<p>' + WmuLib.eol +
    'Text with &amp; example' + WmuLib.eol +
    '</p>');
  });

  it('should convert to html - html tags', () => {
    const result = transformFragment(`Text with < and > example`, {});

    expect(result).to.equal('<p>' + WmuLib.eol +
    'Text with &lt; and &gt; example' + WmuLib.eol +
    '</p>');
  });


  it('should convert to html - escaped character', () => {
    const result = transformFragment(`Text with escaped pipe \\\\| example`, {});

    expect(result).to.equal('<p>' + WmuLib.eol +
    'Text with escaped pipe &#124; example' + WmuLib.eol +
    '</p>');
  });

});