import * as WmuLib from "../../src/WmuLib";
import { transformFragment } from '../../src/';

import { expect } from 'chai';
import 'mocha';

describe('Block list', () => {

	it('should convert to html - unordered list', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`- item 1` + WmuLib.eol +
			`- item 2`;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ul class="list-style-dash">` + WmuLib.eol +
			`	<li><span>item 1</span></li>` + WmuLib.eol +
			`	<li><span>item 2</span></li>` + WmuLib.eol +
			`</ul>` );
	});

  it('should convert to html - unordered list, with tabs between pipes', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`|- item 1` + WmuLib.eol +
			`|\t|- item 1.1` + WmuLib.eol +
			`|\t|\t|- item 1.1.1` + WmuLib.eol +
			`|\t|- item 1.2`;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ul class="list-style-dash">` + WmuLib.eol +
			`	<li><span>item 1</span>` + WmuLib.eol +
			`		<ul class="list-style-dash">` + WmuLib.eol +
			`			<li><span>item 1.1</span>` + WmuLib.eol +
			`				<ul class="list-style-dash">` + WmuLib.eol +
			`					<li><span>item 1.1.1</span></li>` + WmuLib.eol +
			`				</ul>` + WmuLib.eol +
			`			</li>` + WmuLib.eol +
			`			<li><span>item 1.2</span></li>` + WmuLib.eol +
			`		</ul>` + WmuLib.eol +
			`	</li>` + WmuLib.eol +
			`</ul>` );
	});

	it('should convert to html - ordered list numbers', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`1) item 1` + WmuLib.eol +
			`2) item 2`;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol class="list-style-decimal">` + WmuLib.eol +
			`	<li><span>item 1</span></li>` + WmuLib.eol +
			`	<li><span>item 2</span></li>` + WmuLib.eol +
			`</ol>` );
	});

	it('should convert to html - ordered list lowercase letters', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`a) item 1` + WmuLib.eol +
			`b) item 2`;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol class="list-style-lower-alpha">` + WmuLib.eol +
			`	<li><span>item 1</span></li>` + WmuLib.eol +
			`	<li><span>item 2</span></li>` + WmuLib.eol +
			`</ol>` );
	});

	it('should convert to html - ordered list uppercase letters', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`A) item 1` + WmuLib.eol +
			`B) item 2`;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol class="list-style-upper-alpha">` + WmuLib.eol +
			`	<li><span>item 1</span></li>` + WmuLib.eol +
			`	<li><span>item 2</span></li>` + WmuLib.eol +
			`</ol>` );
	});

	it('should convert to html - ordered list lowercase Roman numerals', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`i) item 1` + WmuLib.eol +
			`ii) item 2` + WmuLib.eol +
			`iii) item 3` + WmuLib.eol +
			`iv) item 4`;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol class="list-style-lower-roman">` + WmuLib.eol +
			`	<li><span>item 1</span></li>` + WmuLib.eol +
			`	<li><span>item 2</span></li>` + WmuLib.eol +
			`	<li><span>item 3</span></li>` + WmuLib.eol +
			`	<li><span>item 4</span></li>` + WmuLib.eol +
			`</ol>` );
	});

	it('should convert to html - ordered list uppercase Roman numerals', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`I) item 1` + WmuLib.eol +
			`II) item 2` + WmuLib.eol +
			`III) item 3` + WmuLib.eol +
			`IV) item 4` + WmuLib.eol;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol class="list-style-upper-roman">` + WmuLib.eol +
			`	<li><span>item 1</span></li>` + WmuLib.eol +
			`	<li><span>item 2</span></li>` + WmuLib.eol +
			`	<li><span>item 3</span></li>` + WmuLib.eol +
			`	<li><span>item 4</span></li>` + WmuLib.eol +
			`</ol>`
		);
	});

	it('should convert to html - nested list', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`|a) level 1 item 1` + WmuLib.eol +
			`||A) level 2 item 1` + WmuLib.eol +
			`|||-) level 3 item 1` + WmuLib.eol +
			`|||-) level 3 item 2` + WmuLib.eol +
			`||B.) level 2 item 2` + WmuLib.eol +
			`|b.) level 1 item 2` + WmuLib.eol;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol class="list-style-lower-alpha">` + WmuLib.eol +
			`	<li><span>level 1 item 1</span>` + WmuLib.eol +
			`		<ol class="list-style-upper-alpha">` + WmuLib.eol +
			`			<li><span>level 2 item 1</span>` + WmuLib.eol +
			`				<ul class="list-style-dash">` + WmuLib.eol +
			`					<li><span>level 3 item 1</span></li>` + WmuLib.eol +
			`					<li><span>level 3 item 2</span></li>` + WmuLib.eol +
			`				</ul>` + WmuLib.eol +
			`			</li>` + WmuLib.eol +
			`			<li><span>level 2 item 2</span></li>` + WmuLib.eol +
			`		</ol>` + WmuLib.eol +
			`	</li>` + WmuLib.eol +
			`	<li><span>level 1 item 2</span></li>` + WmuLib.eol +
			`</ol>`
		);
	});

	it('should convert to html - ordered list with values', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`1:2) item 1` + WmuLib.eol +
			`-:4) item 2` + WmuLib.eol +
			`-:6) item 3` + WmuLib.eol +
			`-:8) item 4` + WmuLib.eol;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol class="list-style-decimal">` + WmuLib.eol +
			`	<li value="2"><span>item 1</span></li>` + WmuLib.eol +
			`	<li value="4"><span>item 2</span></li>` + WmuLib.eol +
			`	<li value="6"><span>item 3</span></li>` + WmuLib.eol +
			`	<li value="8"><span>item 4</span></li>` + WmuLib.eol +
			`</ol>`
		);
	});

	it('should convert to html - ordered list, inline, without header', () => {

		let str: string = 
			`1) item 1` + WmuLib.eol +
			`2) item 2` + WmuLib.eol +
			`3) item 3` + WmuLib.eol +
			`4) item 4` + WmuLib.eol;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol class="list-style-decimal">` + WmuLib.eol +
			`	<li><span>item 1</span></li>` + WmuLib.eol +
			`	<li><span>item 2</span></li>` + WmuLib.eol +
			`	<li><span>item 3</span></li>` + WmuLib.eol +
			`	<li><span>item 4</span></li>` + WmuLib.eol +
			`</ol>`
		);
	});

	it('should convert to html - ordered list, inline, without header with values', () => {

		let str: string = 
			`1:2) item 1` + WmuLib.eol +
			`2:4) item 2` + WmuLib.eol +
			`3:6) item 3` + WmuLib.eol +
			`4:8) item 4` + WmuLib.eol;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol class="list-style-decimal">` + WmuLib.eol +
			`	<li value="2"><span>item 1</span></li>` + WmuLib.eol +
			`	<li value="4"><span>item 2</span></li>` + WmuLib.eol +
			`	<li value="6"><span>item 3</span></li>` + WmuLib.eol +
			`	<li value="8"><span>item 4</span></li>` + WmuLib.eol +
			`</ol>`
		);
	});

	it('should convert to html - unordered list, inline, without header', () => {

		let str: string = 
			`-) item 1` + WmuLib.eol +
			`- item 2` + WmuLib.eol +
			`- item 3` + WmuLib.eol +
			`- item 4` + WmuLib.eol;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ul class="list-style-dash">` + WmuLib.eol +
			`	<li><span>item 1</span></li>` + WmuLib.eol +
			`	<li><span>item 2</span></li>` + WmuLib.eol +
			`	<li><span>item 3</span></li>` + WmuLib.eol +
			`	<li><span>item 4</span></li>` + WmuLib.eol +
			`</ul>`
		);
	});

});
