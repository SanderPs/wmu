import * as wmubase from "../../src/wmu-base";
import * as blockImage from '../../src/blocks/block-img';

import { expect } from 'chai';
import 'mocha';

describe('Block image - simple', () => {

  it('should convert to html', () => {

    let allVar: wmubase.IBlockDefinition = {
      'src': '/path/image.jpg',
    };

    const result = blockImage.parse(allVar);

    expect(result).to.equal(
      '<figure>' + wmubase.eol +
      '<img src="' + allVar['src'] + '" />' + wmubase.eol +
      '</figure>' + wmubase.eol + wmubase.eol
    );
  });

});

describe('Block image - no src', () => {

  it('should return html error', () => {

    let allVar: wmubase.IBlockDefinition = {
    };

    const result = blockImage.parse(allVar);

    // todo: abstract error messages away
    expect(result).to.equal('<div class="wmu-error">Image without source</div>');
  });

});