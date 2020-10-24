import * as WmuLib from "../../src/WmuLib";
import { transformFragment } from '../../src/';

import { expect } from 'chai';
import 'mocha';

// todo:
// halign and valign

describe('Block table', () => {

	it('should convert to html - multi line table with header', () => {

		let str: string = 
			`|table|multiline=yes` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`::header::header 1|=|header 2|=|header 3` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`cell 1|=|cell 2|=|cell 3` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`cell 4|=|cell 5|=|cell 6`;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<table>` + WmuLib.eol +
			`	<tr>` + WmuLib.eol +
			`		<th>header 1</th>` + WmuLib.eol +
			`		<th>header 2</th>` + WmuLib.eol +
			`		<th>header 3</th>` + WmuLib.eol +
			`	</tr>` + WmuLib.eol +
			`	<tr>` + WmuLib.eol +
			`		<td>cell 1</td>` + WmuLib.eol +
			`		<td>cell 2</td>` + WmuLib.eol +
			`		<td>cell 3</td>` + WmuLib.eol +
			`	</tr>` + WmuLib.eol +
			`	<tr>` + WmuLib.eol +
			`		<td>cell 4</td>` + WmuLib.eol +
			`		<td>cell 5</td>` + WmuLib.eol +
			`		<td>cell 6</td>` + WmuLib.eol +
			`	</tr>` + WmuLib.eol +
			`</table>`
		);
	});

	it('should convert to html - multi line table with caption', () => {

		let str: string = 
			`|table|multiline=yes` + WmuLib.eol +
			`|caption=Title of the table` + WmuLib.eol +
			`|=` + WmuLib.eol +
			`cell 1|=|cell 2|=|cell 3` + WmuLib.eol;

		const result = transformFragment(str, {});

		expect(result).to.equal(
			`<table>` + WmuLib.eol +
			`<caption>Title of the table</caption>` + WmuLib.eol +
			`	<tr>` + WmuLib.eol +
			`		<td>cell 1</td>` + WmuLib.eol +
			`		<td>cell 2</td>` + WmuLib.eol +
			`		<td>cell 3</td>` + WmuLib.eol +
			`	</tr>` + WmuLib.eol +
			`</table>`
		);
	});

});
