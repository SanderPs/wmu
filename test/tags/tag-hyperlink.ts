import { parseTags } from '../../src/WmuDocument';

import { expect } from 'chai';
import 'mocha';

describe('Tag [bold]', () => {

  it('should convert to html', () => {
    const result = parseTags('Example [[$text]]@@$link@@ inline', {});

    expect(result).to.equal('Example <a href="$link">$text</a> inline');
  });

  it('should not convert when on multiple lines', () => {
    const result = parseTags('Example url @@https://site.com/path%20/default.html#xyz?var=1&var2=&amp;@@ inline', {});
    
    expect(result).to.equal(
      'Example url <a href="https://site.com/path%20/default.html#xyz?var=1&var2=&amp;">https://site.com/path%20/default.html#xyz?var=1&var2=&amp;</a> inline'
      );
  });

});