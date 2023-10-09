import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, body: string[]) {
	let formatNewLine = (allVar.formatOutput ? WmuLib.eol : '');

	return '<p' + WmuLib.classAttr(allVar!['format'] ?? '') + '>' + formatNewLine +
		WmuLib.NewlineToBr(body[0]) + formatNewLine +
		'</p>' + formatNewLine + 
		WmuLib.eol
	;
}
