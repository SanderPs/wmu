import * as wmubase from "../../src/wmu-base";
import * as blockImage from '../../src/index';

import { expect } from 'chai';
import 'mocha';

describe('Tag bold', () => {

  it('Block image - minimal', () => {

    let options: wmubase.IConfig = {
    };

    const result = blockImage.parseWmu('Text in **bold**', options);

    expect(result).to.equal('Text in <b>bold</b>');
  });

});