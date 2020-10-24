import { splitBlocks } from '../../src/WmuDocument';

import { expect } from 'chai';
import 'mocha';

describe('WmuDocument', () => {

  it('should convert to an array of block objects with a single bodypart', () => {
    const result = splitBlocks(
`|block1

|block2
|=
block2-body-part1`
    )

    expect(result).to.eql(
        [
            {header: '|block1', body: []},
            {header: '|block2', body: ['block2-body-part1']},
        ]
        );
  });

  it('should convert to an array of block objects with multiple bodyparts', () => {
    const result = splitBlocks(
`|block1

|block2
|=
block2-body-part1
|=
block2-body-part2`
    )

    expect(result).to.eql(
        [
            {header: '|block1', body: []},
            {header: '|block2', body: ['block2-body-part1', 'block2-body-part2']},
        ]
        );
  });

  it('should ignore white space at the beginning and end', () => {
    const result = splitBlocks(
` \t
|block1
|=
block2-body-part1
 \t
`)

    expect(result).to.eql(
        [
            {header: '|block1', body: ['block2-body-part1']}
        ]
        );
  });
});