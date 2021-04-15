import * as WmuLib from "../../src/WmuLib";
import { IBlockDefinition } from "../../src/types";

import { transformFragment } from '../../src/';

import { expect } from 'chai';
import 'mocha';

describe('Block comment', () => {

  it('should convert to html - using transform', () => {

    let str: string = `|config|keepComments=yes` + WmuLib.eol +
    WmuLib.eol +
    `|htmlComment` + WmuLib.eol +
    `|=` + WmuLib.eol +
    `This is a comment` + WmuLib.eol;

    const result = transformFragment(str, {});

    expect(result).to.equal(
      `<!-- config: ` + WmuLib.eol +
      `keepComments = true; ` + WmuLib.eol +
      ` -->` + WmuLib.eol +
      WmuLib.eol +
      `<!-- This is a comment -->`
    );
  });

  it('should keep comments - using transform', () => {

    let str: string = `|config|keepComments=yes` + WmuLib.eol +
    WmuLib.eol +
    `<!-- This is a comment -->` + WmuLib.eol;

    const result = transformFragment(str, {});

    expect(result).to.equal(
      `<!-- config: ` + WmuLib.eol +
      `keepComments = true; ` + WmuLib.eol +
      ` -->` + WmuLib.eol +
      WmuLib.eol +
      `<!-- This is a comment -->`
    );
  });

});