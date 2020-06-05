import * as parse from '../../src/main-parse';

import { expect } from 'chai';
import 'mocha';

describe('Tag [bold]', () => {

  it('should convert to html', () => {
    const result = parse.parseTags('Text in **bold**', {});
    expect(result).to.equal('Text in <b>bold</b>');
  });

});