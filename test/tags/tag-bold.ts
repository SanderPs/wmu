import { parseTags } from '../../src/WmuDocument';

import { expect } from 'chai';
import 'mocha';

describe('Tag [bold]', () => {

  it('should convert to html', () => {
    const result = parseTags('Text in **bold**', {});

    expect(result).to.equal('Text in <b>bold</b>');
  });

  it('should not convert when on multiple lines', () => {
    const result = parseTags('Text on one **line\nAnother** line', {});
    
    expect(result).to.equal('Text on one **line\nAnother** line');
  });

});