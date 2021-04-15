import * as WmuLib from "../../src/WmuLib";
import { transformFragment } from '../../src/';

import { expect } from 'chai';
import 'mocha';

describe('Table of contents', () => {

  it('should convert to html - all headertypes', () => {

    let str: string = `
|config|toc=true

|h0|=Part 0

|h1|=Chapter 1

|h2|=Paragraph 1.1

|h3|=Paragraph 1.1.1

|h4|=Paragraph 1.1.1.1

|h5|=Paragraph 1.1.1.1.1

`;

    const result = transformFragment(str, {});

    expect(result).to.equal(`<div id="tableofcontents">` + WmuLib.eol +
`<ul class='indexlevel-0'>` + WmuLib.eol +
`\t<li><span class='numbering'>1</span> Part 0</li>` + WmuLib.eol +
`\t<ul class='indexlevel-1'>` + WmuLib.eol +
`\t\t<li><span class='numbering'>1</span> Chapter 1</li>` + WmuLib.eol +
`\t\t<ul class='indexlevel-2'>` + WmuLib.eol +
`\t\t\t<li><span class='numbering'>1.1</span> Paragraph 1.1</li>` + WmuLib.eol +
`\t\t\t<ul class='indexlevel-3'>` + WmuLib.eol +
`\t\t\t\t<li><span class='numbering'>1.1.1</span> Paragraph 1.1.1</li>` + WmuLib.eol +
`\t\t\t\t<ul class='indexlevel-4'>` + WmuLib.eol +
`\t\t\t\t\t<li><span class='numbering'>1.1.1.1</span> Paragraph 1.1.1.1</li>` + WmuLib.eol +
`\t\t\t\t\t<ul class='indexlevel-5'>` + WmuLib.eol +
`\t\t\t\t\t\t<li><span class='numbering'>1.1.1.1.1</span> Paragraph 1.1.1.1.1</li>` + WmuLib.eol +
`\t\t\t\t\t</ul>` + WmuLib.eol +
`\t\t\t\t</ul>` + WmuLib.eol +
`\t\t\t</ul>` + WmuLib.eol +
`\t\t</ul>` + WmuLib.eol +
`\t</ul>` + WmuLib.eol +
`</ul>` + WmuLib.eol +
`</div>` + WmuLib.eol +
'' + WmuLib.eol +
'' + WmuLib.eol +
'' + WmuLib.eol +
`<!-- config: ` + WmuLib.eol +
`createToc = true; ` + WmuLib.eol +
` -->` + WmuLib.eol +
`` + WmuLib.eol +
`<div class="page-part" id="id_871647533">1 Part 0</div>` + WmuLib.eol +
`` + WmuLib.eol +
`<h1 id="id_2009554675">1 Chapter 1</h1>` + WmuLib.eol +
`` + WmuLib.eol +
`<h2 id="id_1360765072">1.1 Paragraph 1.1</h2>` + WmuLib.eol +
`` + WmuLib.eol +
`<h3 id="id_2025173934">1.1.1 Paragraph 1.1.1</h3>` + WmuLib.eol +
`` + WmuLib.eol +
`<h4 id="id_571962252">1.1.1.1 Paragraph 1.1.1.1</h4>` + WmuLib.eol +
`` + WmuLib.eol +
`<h5 id="id_100093910">1.1.1.1.1 Paragraph 1.1.1.1.1</h5>` + WmuLib.eol +
`` + WmuLib.eol +
`<!-- footnotes id_2009554675 -->`);
  });

});
