import { parseTags } from '../../src/WmuDocument';

import { expect } from 'chai';
import 'mocha';

describe('Tag [underline]', () => {

  it('should convert to html', () => {
    const result = parseTags('Text in !!underline!!', {});

    expect(result).to.equal('Text in <u>underline</u>');
  });

});