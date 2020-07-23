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
			`<ul>` + WmuLib.eol +
			`	<li>item 1</li>` + WmuLib.eol +
			`	<li>item 2</li>` + WmuLib.eol +
			`</ul>` );
	});

	it('should convert to html - ordered list numbers', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`1. item 1` + WmuLib.eol +
			`2. item 2`;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol type="1">` + WmuLib.eol +
			`	<li>item 1</li>` + WmuLib.eol +
			`	<li>item 2</li>` + WmuLib.eol +
			`</ol>` );
	});

	it('should convert to html - ordered list lowercase letters', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`a. item 1` + WmuLib.eol +
			`b. item 2`;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol type="a">` + WmuLib.eol +
			`	<li>item 1</li>` + WmuLib.eol +
			`	<li>item 2</li>` + WmuLib.eol +
			`</ol>` );
	});

	it('should convert to html - ordered list uppercase letters', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`A. item 1` + WmuLib.eol +
			`B. item 2`;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol type="A">` + WmuLib.eol +
			`	<li>item 1</li>` + WmuLib.eol +
			`	<li>item 2</li>` + WmuLib.eol +
			`</ol>` );
	});

	it('should convert to html - ordered list lowercase Roman numerals', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`i. item 1` + WmuLib.eol +
			`ii. item 2` + WmuLib.eol +
			`iii. item 3` + WmuLib.eol +
			`iv. item 4`;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol type="i">` + WmuLib.eol +
			`	<li>item 1</li>` + WmuLib.eol +
			`	<li>item 2</li>` + WmuLib.eol +
			`	<li>item 3</li>` + WmuLib.eol +
			`	<li>item 4</li>` + WmuLib.eol +
			`</ol>` );
	});

	it('should convert to html - ordered list uppercase Roman numerals', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`I. item 1` + WmuLib.eol +
			`II. item 2` + WmuLib.eol +
			`III. item 3` + WmuLib.eol +
			`IV. item 4` + WmuLib.eol;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol type="I">` + WmuLib.eol +
			`	<li>item 1</li>` + WmuLib.eol +
			`	<li>item 2</li>` + WmuLib.eol +
			`	<li>item 3</li>` + WmuLib.eol +
			`	<li>item 4</li>` + WmuLib.eol +
			`</ol>`
		);
	});

	it('should convert to html - nested list', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`|a. level 1 item 1` + WmuLib.eol +
			`||A. level 2 item 1` + WmuLib.eol +
			`|||- level 3 item 1` + WmuLib.eol +
			`|||- level 3 item 2` + WmuLib.eol +
			`||B. level 2 item 2` + WmuLib.eol +
			`|b. level 1 item 2` + WmuLib.eol;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol type="a">` + WmuLib.eol +
			`	<li>level 1 item 1` + WmuLib.eol +
			`		<ol type="A">` + WmuLib.eol +
			`			<li>level 2 item 1` + WmuLib.eol +
			`				<ul>` + WmuLib.eol +
			`					<li>level 3 item 1</li>` + WmuLib.eol +
			`					<li>level 3 item 2</li>` + WmuLib.eol +
			`				</ul>` + WmuLib.eol +
			`			</li>` + WmuLib.eol +
			`			<li>level 2 item 2</li>` + WmuLib.eol +
			`		</ol>` + WmuLib.eol +
			`	</li>` + WmuLib.eol +
			`	<li>level 1 item 2</li>` + WmuLib.eol +
			`</ol>`
		);
	});

	it('should convert to html - ordered list with values', () => {

		let str: string = 
			`|list` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`1:2. item 1` + WmuLib.eol +
			`-:4. item 2` + WmuLib.eol +
			`-:6. item 3` + WmuLib.eol +
			`-:8. item 4` + WmuLib.eol;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol type="1">` + WmuLib.eol +
			`	<li value="2">item 1</li>` + WmuLib.eol +
			`	<li value="4">item 2</li>` + WmuLib.eol +
			`	<li value="6">item 3</li>` + WmuLib.eol +
			`	<li value="8">item 4</li>` + WmuLib.eol +
			`</ol>`
		);
	});

	it('should convert to html - ordered list without header', () => {

		let str: string = 
			`1. item 1` + WmuLib.eol +
			`2. item 2` + WmuLib.eol +
			`3. item 3` + WmuLib.eol +
			`4. item 4` + WmuLib.eol;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol type="1">` + WmuLib.eol +
			`	<li>item 1</li>` + WmuLib.eol +
			`	<li>item 2</li>` + WmuLib.eol +
			`	<li>item 3</li>` + WmuLib.eol +
			`	<li>item 4</li>` + WmuLib.eol +
			`</ol>`
		);
	});

	it('should convert to html - ordered list without header with values', () => {

		let str: string = 
			`1:2. item 1` + WmuLib.eol +
			`2:4. item 2` + WmuLib.eol +
			`3:6. item 3` + WmuLib.eol +
			`4:8. item 4` + WmuLib.eol;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ol type="1">` + WmuLib.eol +
			`	<li value="2">item 1</li>` + WmuLib.eol +
			`	<li value="4">item 2</li>` + WmuLib.eol +
			`	<li value="6">item 3</li>` + WmuLib.eol +
			`	<li value="8">item 4</li>` + WmuLib.eol +
			`</ol>`
		);
	});

	it('should convert to html - unordered list without header', () => {

		let str: string = 
			`- item 1` + WmuLib.eol +
			`- item 2` + WmuLib.eol +
			`- item 3` + WmuLib.eol +
			`- item 4` + WmuLib.eol;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<ul>` + WmuLib.eol +
			`	<li>item 1</li>` + WmuLib.eol +
			`	<li>item 2</li>` + WmuLib.eol +
			`	<li>item 3</li>` + WmuLib.eol +
			`	<li>item 4</li>` + WmuLib.eol +
			`</ul>`
		);
	});

});
