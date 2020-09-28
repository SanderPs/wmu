import { splitBlocks } from '../../src/WmuDocument';

import { expect } from 'chai';
import 'mocha';

describe('WmuDocument', () => {

  it('should convert to an array of block objects with parts', () => {
    const result = splitBlocks(
`|block1

|block2
|=
block2-part2`
    )

    expect(result).to.eql(
        [
            {part1: '|block1'},
            {part1: '|block2', part2: 'block2-part2'},
        ]
        );
  });

  it('should ignore white space at the beginning and end', () => {
    const result = splitBlocks(
` \t
|block1
|=
block1-part2
 \t
`)

    expect(result).to.eql(
        [
            {part1: '|block1', part2: 'block1-part2'}
        ]
        );
  });
});