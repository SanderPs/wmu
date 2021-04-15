import { parseTags } from '../../src/WmuDocument';

import { expect } from 'chai';
import 'mocha';

describe('Two forward slashes can be interpreted wrongly as italics', () => {

  it('should convert to a link', () => {
    const result = parseTags('[[http://www.xyz.nl]]@@http://www.xyz.nl@@', {});

    expect(result).to.equal('<a href="http://www.xyz.nl">http://www.xyz.nl</a>');
  });

});