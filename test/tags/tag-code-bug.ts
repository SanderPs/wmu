import * as parse from '../../src/WmuDocument';

import { expect } from 'chai';
import 'mocha';

describe('Tag [code] - bug', () => {

  it('should be non-greedy', () => {
    const result = parse.parseTags('``||`` ``??``', {});
    expect(result).to.equal('<code>||</code> <code>??</code>');
  });

});