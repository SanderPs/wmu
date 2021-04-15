import { parseTags } from '../../src/WmuDocument';

import { expect } from 'chai';
import 'mocha';

describe('Tag [code] - bug', () => {

  it('should be non-greedy', () => {
    const result = parseTags('``||`` ``??``', {});
    expect(result).to.equal('<code>||</code> <code>??</code>');
  });

});