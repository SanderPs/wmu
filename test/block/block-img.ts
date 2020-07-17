import * as WmuLib from "../../src/WmuLib";
import { IBlockDefinition } from "../../src/types";

import { transformFragment } from '../../src/';
import * as blockImage from '../../src/blocks/block-img';

import { expect } from 'chai';
import 'mocha';

describe('Block image - simple', () => {

  it('should convert to html - using transform', () => {

    let str: string = `|img|=https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg
|title=Image that explains it all`;

    const result = transformFragment(str, {});

    expect(result).to.equal(
      '<figure>' + WmuLib.eol +
      '<img src="https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg" />' + WmuLib.eol +
      '<figcaption>Image that explains it all</figcaption>' + WmuLib.eol +
      '</figure>'
    );
  });

  it('should convert to html - direct call', () => {

    let allVar: IBlockDefinition = {
      'src': '/path/image.jpg',
      'title': 'title for this image'
    };

    const result = blockImage.parse(allVar);

    expect(result).to.equal(
      '<figure>' + WmuLib.eol +
      '<img src="' + allVar['src'] + '" />' + WmuLib.eol +
      '<figcaption>' + allVar['title'] + '</figcaption>' + WmuLib.eol +
      '</figure>' + WmuLib.eol + WmuLib.eol
    );
  });

});

describe('Block image - no src', () => {

  it('should return html error', () => {

    let allVar: IBlockDefinition = {
    };

    const result = blockImage.parse(allVar);

    // todo: abstract error messages away
    expect(result).to.equal('<div class="wmu-error">Image without source</div>');
  });

});