import * as wmubase from "../../src/wmu-base";
import * as blockImage from '../../src/block-img';

import { expect } from 'chai';
import 'mocha';

describe('Block image', () => {

  it('Block image - minimal', () => {

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

  it('Block image - no source - fails', () => {

    let allVar: wmubase.IBlockDefinition = {
    };

    const result = blockImage.parse(allVar);

    expect(result).to.equal('');
  });

});